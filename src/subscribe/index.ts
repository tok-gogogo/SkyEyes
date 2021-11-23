import {EVENTTYPES} from "../type";
import {tryCatch} from "../tools";

export  type AopCallback = (data: any) => void

export interface aopHandler {
  type: EVENTTYPES
  callback: AopCallback
}

const handlers: { [key in EVENTTYPES]?: AopCallback } = {}

/**订阅发布模型 防止重复监听**/
/**
 * 订阅type
 * @param handler
 */
export function subscribe(handler: aopHandler): boolean {
  if (handlers[handler.type]) return false
  handlers[handler.type] = handler.callback;
  return true
}

/**
 * 通知回调执行
 * @param type
 * @param data
 */
export function publishHandler(type: EVENTTYPES, data: any) {

  if(!type || handlers[type]) return;
  let callback = handlers[type];
  tryCatch(()=>{
    callback(data);
  },(e:Error)=>{
    console.log('重写事件publishHandler的回调函数发生错误')
  })


}
