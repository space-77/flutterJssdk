type MethodsName =
  | 'navPop'
  | 'deviceInfo'
  | 'reload'
  | 'setLocalStorage'
  | 'getLocalStorage'
  | 'removeLocalStroge'
  | 'clearLocalStroge'
  | 'qrcode'
  | 'pickerPhoto'
  | 'openCamera'
  | 'recordAudio'
  | 'recordAudio'

type TOnReadyFuns = { resolve: Function; reject: Function; time: number }
type TEventList = Omit<TOnReadyFuns, 'time'>

type MaxRockyEvent = {
  code: number
  data: string
  msg: string
  sessionId: number
}

export default class JssdkBase {
  protected native = false
  protected initDone = false
  protected baseScheme?: string
  protected static sessionId = 0
  protected initTimer?: number
  protected timeout = 1000 * 5
  protected eventList = new Map<number, TEventList>()
  protected onReadyFuns: TOnReadyFuns[] = []

  constructor() {
    this.init()
    this.addEventListener()
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
      window.flutter_inappwebview.callHandler('postMessage', JSON.stringify({ sessionId, methodName, params }))
    })
  }
}
