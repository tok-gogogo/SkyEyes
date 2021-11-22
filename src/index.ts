import {EVENTTYPES} from "./type";
import {AopCallback, aopHandler} from "./subscribe";

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

}

export {init}
