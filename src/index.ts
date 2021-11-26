import {EVENTTYPES, HTTP_CODE} from "./type";
import {AopCallback, aopHandler, publishHandler, subscribe} from "./subscribe";
import {
  addListen,
  aopObject,
  generateSEId, getNow, hasProperty,
  isBrowserEnv, supportsHistory, throttle,
  typeDetection,
  voidFun
} from "./tools";
import {
  domAop,
  fetchAop,
  historyAop,
  listenErrorAop, listenHashchangeAop,
  unhandledrejectionAop,
  xhrAop
} from "./aop";

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
  //拦截fetch
  addAopHandler({
    type: EVENTTYPES.FETCH,
    callback: (data) => {
      //todo:事件拦截的回调,进行消息发送
    }
  })
  //拦截ERROR
  addAopHandler({
    type: EVENTTYPES.ERROR,
    callback: (data) => {
      //todo:事件拦截的回调,进行消息发送
    }
  })
  //拦截HASHCHANGE
  addAopHandler({
    type: EVENTTYPES.HASHCHANGE,
    callback: (data) => {
      //todo:事件拦截的回调,进行消息发送
    }
  })
  //拦截Dom点击
  addAopHandler({
    type: EVENTTYPES.DOM,
    callback: (data) => {
      //todo:事件拦截的回调,进行消息发送
    }
  })
  //拦截HISTORY改变
  addAopHandler({
    type: EVENTTYPES.HISTORY,
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
      fetchAop()
      break
    case EVENTTYPES.ERROR:
      listenErrorAop()
      break
    case EVENTTYPES.HISTORY:
      historyAop()
      break
    case EVENTTYPES.UNHANDLEDREJECTION:
      unhandledrejectionAop()
      break
    case EVENTTYPES.DOM:
      //点击事件埋点
      domAop()
      break
    case EVENTTYPES.HASHCHANGE:
      listenHashchangeAop()
      break
    default:
      break
  }
}


export {init}
