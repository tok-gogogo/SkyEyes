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
export function aopObject(source: IObjectProto, key: string, callback: (...args: any[]) => any,): void {
  if (source === undefined) return
  if (key in source ) {
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
