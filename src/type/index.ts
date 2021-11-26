/**
 * 可以重写的事件类型
 */
export enum EVENTTYPES {
  XHR = 'xhr',
  FETCH = 'fetch',
  DOM = 'dom',
  HISTORY = 'history',
  ERROR = 'error',
  HASHCHANGE = 'hashchange',
  UNHANDLEDREJECTION = 'unhandledrejection',
}

/**
 * http code
 */
export enum HTTP_CODE {
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  INTERNAL_EXCEPTION = 500
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
