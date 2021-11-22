import {EVENTTYPES} from "../type";

export  type AopCallback = (data: any) => void

export interface aopHandler {
  type: EVENTTYPES
  callback: AopCallback
}

const handlers: { [key in EVENTTYPES]?: AopCallback[] } = {}

/**订阅发布模型模型**/
/**
 * 订阅type
 * @param handler
 */
export function subscribe(handler: aopHandler): void {
  handlers[handler.type] = handlers[handler.type] || [];
  handlers[handler.type].push(handler.callback);
}

/**
 * 通知回调执行
 * @param type
 * @param data
 */
export  function publishHandler(type:EVENTTYPES,data:any){


}
