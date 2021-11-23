import {EVENTTYPES} from "./type";
import {AopCallback, aopHandler, subscribe} from "./subscribe";
import {aopObject, isBrowserEnv, typeDetection, voidFun} from "./tools";

function init(options: {}): void {
  webInit(options)
}

/**
 * 初始化配置
 * @param options
 */
function webInit(options: {}): void {
  //拦截xhr
  addAopHandler({
    type: EVENTTYPES.XHR,
    callback: (data) => {
      //todo:事件拦截的回调,进行消息发送
    }
  })
}

function addAopHandler(handler: aopHandler) {
  if (!subscribe(handler)) return false;
  aopFunction(handler.type);
}

function aopFunction(type: EVENTTYPES) {
  switch (type) {
    case EVENTTYPES.XHR:
      xhrAop()
      break
    case EVENTTYPES.FETCH:
      // fetchAop()
      break
    case EVENTTYPES.ERROR:
      // listenError()
      break
    case EVENTTYPES.HISTORY:
      // historyAop()
      break
    case EVENTTYPES.UNHANDLEDREJECTION:
      // unhandledrejectionAop()
      break
    case EVENTTYPES.DOM:
      // domAop()
      break
    case EVENTTYPES.HASHCHANGE:
      // listenHashchange()
      break
    default:
      break
  }
}

export declare interface SEXMLHttpRequest extends XMLHttpRequest {
  [key: string]: any;

  se_http_info?: SEHttp_Info;
}

export interface SEHttp_Info {
  type: string
  id?: string
  method?: string
  url?: string
  status?: number
  reqData?: any
  sTime?: number
  elapsedTime?: number
  responseText?: any
  time?: number
}

function xhrAop(): void {
  //browser环境 且支持XMLHttpRequest
  if (!isBrowserEnv() || !('XMLHttpRequest' in window)) return

  let proto = XMLHttpRequest.prototype;
  aopObject(proto, 'open', (originFun: voidFun): any => {
    return function (that: SEXMLHttpRequest, ...args: any[]): void {
      that.se_http_info = {
        method: typeDetection.isString(args[0]) ? args[0].toUpperCase() : args[0],
        url: args[1],
        sTime: Date.now(),
        type: 'xhr'
      }
      originFun.apply(that, args)
    }
  })
}

export {init}
