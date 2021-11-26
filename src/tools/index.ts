interface IObjectProto {
  [key: string]: any
}

/**
 *
 * 重写对象的某个属性进行aop插入数据收集代码
 * @param source 需要被重写的对象
 * @param key 需要被重写对象的key
 * @param callback 以原有的函数作为参数，执行并重写原有函数
 */
export function aopObject(source: IObjectProto, key: string, callback: (...args: any[]) => any): void {
  if (source === undefined) return
  if (key in source) {
    const original = source[key]
    const wrapped = callback(original)
    if (typeof wrapped === 'function') {
      source[key] = wrapped
    }
  }
}

/**
 * 用&分割对象，返回a=1&b=2
 * @param obj 需要拼接的对象
 */
export function objToQuery(obj: Record<string, unknown>): string {
  return Object.entries(obj).reduce((result, [key, value], index) => {
    if (index !== 0) {
      result += '&'
    }
    const valueStr = typeDetection.isObject(value) || typeDetection.isArray(value) ? JSON.stringify(value) : value
    result += `${key}=${valueStr}`
    return result
  }, '')
}


/**
 * 检测变量类型
 * @param type
 */
function isType(type: string) {
  return function (value: any): boolean {
    return Object.prototype.toString.call(value) === `[object ${type}]`
  }
}

export const typeDetection = {
  isNumber: isType('Number'),
  isString: isType('String'),
  isBoolean: isType('Boolean'),
  isNull: isType('Null'),
  isUndefined: isType('Undefined'),
  isSymbol: isType('Symbol'),
  isFunction: isType('Function'),
  isObject: isType('Object'),
  isArray: isType('Array'),
  isWindow: isType('Window')
}

export declare type voidFun = () => void;

/**
 * 自定义try函数，添加fn 回调函数
 * @param fn try中执行的函数体
 * @param errorFn 报错时执行的函数体，将err传入
 */
export function tryCatch(fn: voidFun, errorFn?: (err: any) => void): void {
  try {
    fn()
  } catch (err) {
    console.log('err', err)
    if (errorFn) {
      errorFn(err)
    }
  }
}

/**
 * 判断执行环境 是否是browser环境
 */
export function isBrowserEnv(): boolean {
  if (typeof window !== 'undefined' && typeDetection.isWindow(window))
    return true;
  else
    return false
}

/** 生成唯一id**/
export function generateSEId(): string {
  let d = new Date().getTime()
  const seId = 'ssssssss-xsss-4sss-esss-ssssssssssss'.replace(/[se]/g, function (c) {
    const r = (d + Math.random() * 16) % 16 | 0
    d = Math.floor(d / 16)
    return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16)
  })
  return seId
}

/**
 * 添加自定义事件监听器
 * @param target
 * @param eventName
 * @param handler
 * @param opitons
 */
export function addListen(
  target: { addEventListener: Function },
  eventName: string,
  callback: Function,
  option: boolean | unknown = false
): void {
  target.addEventListener(eventName, callback, option)
}

/**
 * 获取当前时间
 */
export  function  getNow(){
  return Date.now();
}

/**
 * 判断property
 * @param obj
 * @param key
 */
export function hasProperty(obj: Object, key: string | number | symbol): boolean {
  return obj.hasOwnProperty(key)
}


/**
 * 节流函数
 * @param fn
 * @param delay
 */
export const throttle = (fn: Function, delay: number): Function => {
  let canRun = true
  return function (...args: any) {
    if (!canRun) return
    fn.apply(this, args)
    canRun = false
    setTimeout(() => {
      canRun = true
    }, delay)
  }
}

/**
 *
 */
export function supportsHistory(): boolean {
  // NOTE: in Chrome App environment, touching history.pushState, *even inside
  //       a try/catch block*, will cause Chrome to output an error to console.error
  // borrowed from: https://github.com/angular/angular.js/pull/13945/files
  const chrome = (window as any).chrome
  // tslint:disable-next-line:no-unsafe-any
  const isChromePackagedApp = chrome && chrome.app && chrome.app.runtime
  const hasHistoryApi = 'history' in window && !!window.history.pushState && !!window.history.replaceState

  return !isChromePackagedApp && hasHistoryApi
}
