type MethodsName =
  | 'toast'
  | 'navPop'
  | 'reload'
  | 'qrcode'
  | 'deviceInfo'
  | 'httpRequest'
  | 'networkInfo'
  | 'openCamera'
  | 'pickerPhoto'
  | 'connectivity'
  | 'fileDownload'
  | 'setLocalStorage'
  | 'getLocalStorage'
  | 'removeLocalStroge'
  | 'clearLocalStroge'
  | 'localNotification'
  | 'setNavigationBarColor'

type TOnReadyFuns = { resolve: Function; reject: Function; time: number }
type TEventList = Omit<TOnReadyFuns, 'time'>

type MaxRockyEvent = {
  code: number
  data: string
  msg: string
  sessionId: number
}

type onDidReceiveNotificationRes = { type: 'selectedNotification' | 'selectedNotificationAction'; payload?: string }

export type JssdkOprion = {
  /**
   * @description 拦截用户退出应用事件
   * @returns { Boolean } 返回退出应用结果，true 退出，false 取消
   */
  onWillPop?: () => boolean

  /**
   * @param res
   * @description 点击了本地通知回调
   */
  onDidReceiveNotificationResponse?: (res: onDidReceiveNotificationRes) => void
}

export const webviewName = 'flutter_inappwebview'
export const maxrockyWebView = window[webviewName]

export default class JssdkBase {
  protected native = false
  protected initDone = false
  protected baseScheme?: string
  protected static sessionId = 0
  protected initTimer?: number
  protected timeout = 1000 * 5
  protected eventList = new Map<number, TEventList>()
  protected onReadyFuns: TOnReadyFuns[] = []

  constructor({ onWillPop, onDidReceiveNotificationResponse }: JssdkOprion = {}) {
    if (maxrockyWebView.$jssdk) {
      console.error('jssdk has already been built, please do not repeat the construction')
      return maxrockyWebView.$jssdk
    }
    maxrockyWebView.$jssdk = this
    this.init()
    this.addEventListener()
    maxrockyWebView.onWillPop = onWillPop?.bind(this)
    maxrockyWebView.onDidReceiveNotificationResponse = onDidReceiveNotificationResponse?.bind(this)
  }

  protected init() {
    window.addEventListener('onMaxrockyReady', ({ detail }: any = {}) => {
      const { baseScheme } = detail as { baseScheme: string }
      this.native = true
      this.initDone = true
      this.baseScheme = baseScheme
      this.onReadyFuns.forEach(({ resolve, time }) => {
        resolve(Date.now() - time)
      })
    })
  }

  protected addEventListener() {
    window.addEventListener('onJsBridgeCallBack', ({ detail }: any) => {
      const { sessionId, code, msg, data } = detail as MaxRockyEvent
      const eventInfo = this.eventList.get(sessionId)
      if (!eventInfo) return
      const { resolve, reject } = eventInfo
      this.eventList.delete(sessionId)
      code === 0 ? resolve(data) : reject(msg)
    })
  }

  protected getSessionid() {
    if (JssdkBase.sessionId >= 999999) JssdkBase.sessionId = 0
    JssdkBase.sessionId++
    return JssdkBase.sessionId
  }

  protected callHandler<T = any>(methodName: MethodsName, params?: string | number): Promise<T> {
    // 使用 JsBridge 方式通讯
    return new Promise<T>((resolve, reject) => {
      const sessionId = this.getSessionid()
      this.eventList.set(sessionId, { resolve, reject })

      // 通知原生事件
      maxrockyWebView?.callHandler('postMessage', JSON.stringify({ sessionId, methodName, params }))
    })
  }

  protected isLink(url: string) {
    return /https?:\/\//.test(url) || (this.baseScheme && url.startsWith(this.baseScheme))
  }
}
