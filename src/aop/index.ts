
// last time route
import {
  addListen,
  aopObject, generateSEId, getNow, hasProperty, isBrowserEnv,
  supportsHistory,
  throttle, typeDetection,
  voidFun
} from "../tools";
import {publishHandler} from "../subscribe";
import {EVENTTYPES, HTTP_CODE, SEHttp_Info, SEXMLHttpRequest} from "../type";

let lastHref = document.location.href;
export function historyAop(): void {
  if (!supportsHistory()) return
  const oldOnpopstate = window.onpopstate
  window.onpopstate = function (this: WindowEventHandlers, ...args: any[]): any {
    const to = document.location.href;
    const from = lastHref
    lastHref = to
    publishHandler(EVENTTYPES.HISTORY, {
      from,
      to
    })
    oldOnpopstate && oldOnpopstate.apply(this, args)
  }
  function historyReplaceFn(originalHistoryFn: voidFun): voidFun {
    return function (this: History, ...args: any[]): void {
      const url = args.length > 2 ? args[2] : undefined
      if (url) {
        const from = lastHref
        const to = String(url)
        lastHref = to
        publishHandler(EVENTTYPES.HISTORY, {
          from,
          to
        })
      }
      return originalHistoryFn.apply(this, args)
    }
  }
  aopObject(window.history, 'pushState', historyReplaceFn)
  aopObject(window.history, 'replaceState', historyReplaceFn)
}


export function domAop(): void {
  if (!('document' in window)) return
  const clickThrottle = throttle(publishHandler, 0)
  addListen(
    window.document,
    'click',
    function () {
      clickThrottle(EVENTTYPES.DOM, {
        category: 'click',
        data: this
      })
    },
    true
  )
}

export function listenHashchangeAop(): void {
  if (!hasProperty(window, 'onpopstate')) {
    addListen(window, EVENTTYPES.HASHCHANGE, function (e: HashChangeEvent) {
      publishHandler(EVENTTYPES.HASHCHANGE, e)
    })
  }
}

export function unhandledrejectionAop(): void {
  addListen(window, EVENTTYPES.UNHANDLEDREJECTION, function (ev: PromiseRejectionEvent) {
    publishHandler(EVENTTYPES.UNHANDLEDREJECTION, ev)
  })
}

export function listenErrorAop(): void {
  addListen(
    window,
    'error',
    function (e: ErrorEvent) {
      publishHandler(EVENTTYPES.ERROR, e)
    },
    true
  )
}



export function xhrAop(): void {
  //browser环境 且支持XMLHttpRequest
  if (!isBrowserEnv() || !('XMLHttpRequest' in window)) return
  let proto = XMLHttpRequest.prototype;
  //open 记录信息
  aopObject(proto, 'open', (originFun: voidFun): Function => {
    return function (that: SEXMLHttpRequest, ...args: any[]): void {
      that.se_http_info = {
        method: typeDetection.isString(args[0]) ? args[0].toUpperCase() : args[0],
        url: args[1],
        sTime: getNow(),
        type: 'xhr'
      }
      originFun.apply(that, args)
    }
  })
  aopObject(proto, 'send', (originFun: voidFun): Function => {
    return function (that: SEXMLHttpRequest, ...args: any[]): void {
      // const { method, url } = that.se_http_info
      that.se_http_info.id = generateSEId();

      addListen(that, 'loadend', function (that: SEXMLHttpRequest) {
        const {responseType, response, status} = that
        that.se_http_info.reqData = args[0]
        const eTime = getNow();
        that.se_http_info.time = that.se_http_info.sTime
        that.se_http_info.status = status
        if (['', 'json', 'text'].indexOf(responseType) !== -1) {
          that.se_http_info.responseText = typeof response === 'object' ? JSON.stringify(response) : response
        }
        that.se_http_info.elapsedTime = eTime - that.se_http_info.sTime
        publishHandler(EVENTTYPES.XHR, that.se_http_info)
      })
      originFun.apply(this, args)
    }
  })
}

export function fetchAop(): void {
  //browser环境 且支持fetch
  if (!isBrowserEnv() || !('fetch' in window)) return
  aopObject(window, EVENTTYPES.FETCH, (originFun: voidFun) => {
    return function (url: string, config: Partial<Request> = {}): void {
      const sTime = getNow()
      const method = (config && config.method) || 'GET'
      let handlerData: SEHttp_Info = {
        type: "fetch",
        method,
        reqData: config && config.body,
        url
      }
      const headers = new Headers(config.headers || {})
      Object.assign(headers, {
        setRequestHeader: headers.set
      })
      handlerData.id = generateSEId();
      config = {
        ...config,
        headers
      }
      return originFun.apply(window, [url, config]).then(
        (res: Response) => {
          const tempRes = res.clone()
          const eTime = getNow()
          handlerData = {
            ...handlerData,
            elapsedTime: eTime - sTime,
            status: tempRes.status,
            // statusText: tempRes.statusText,
            time: sTime
          }
          tempRes.text().then((data) => {
            handlerData.responseText = tempRes.status > HTTP_CODE.UNAUTHORIZED && data
            publishHandler(EVENTTYPES.FETCH, handlerData)
          })
          return res
        },
        (err: Error) => {
          const eTime = getNow()
          handlerData = {
            ...handlerData,
            elapsedTime: eTime - sTime,
            status: 0,
            // statusText: err.name + err.message,
            time: sTime
          }
          publishHandler(EVENTTYPES.FETCH, handlerData)
          throw err
        }
      )
    }
  })
}
