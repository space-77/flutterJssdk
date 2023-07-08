type MethodsName =
  | 'deviceInfo'
  | 'storageValue'
  | 'acquireValue'
  | 'clearValue'
  | 'qrcode'
  | 'selectPhoto'
  | 'openCamera'
  | 'recordAudio'
  | 'recordAudio'

type TOnReadyFuns = { resolve: Function; reject: Function; time: number }
type TEventList = Omit<TOnReadyFuns, 'time'> & { timer: number }

type MaxRockyEvent = {
  code: number
  data: string
  msg: string
  sessionId: number
}

class Jssdk {
  protected native = false
  protected initDone = false
  protected static sessionId = 0
  protected initTimer?: number
  protected timeout = 1000 * 5
  protected eventList = new Map<number, TEventList>()
  protected onReadyFuns: TOnReadyFuns[] = []

  get isNative() {
    return this.native
  }

  constructor() {
    this.init()
    this.addEventListener()
  }

  protected init() {
    window.addEventListener('onMaxrockyReady', () => {
      clearTimeout(this.initTimer)
      this.native = true
      this.initDone = true
      this.onReadyFuns.forEach(({ resolve, time }) => {
        resolve(Date.now() - time)
      })
    })

    this.initTimer = setTimeout(() => {
      this.native = false
      this.onReadyFuns.forEach(({ reject }) => {
        this.initDone = true
        reject('is not navtive')
      })
    }, 800)
  }

  protected addEventListener() {
    window.addEventListener('onBridgeCallBack', ({ detail }: any) => {
      const { sessionId, code, msg, data } = detail as MaxRockyEvent
      const eventInfo = this.eventList.get(sessionId)
      if (!eventInfo) return
      const { resolve, reject, timer } = eventInfo
      clearTimeout(timer)
      this.eventList.delete(sessionId)
      code === 0 ? resolve(data) : reject(msg)
    })
  }

  protected getSessionid() {
    if (Jssdk.sessionId >= 999999) Jssdk.sessionId = 0
    Jssdk.sessionId++
    return Jssdk.sessionId
  }

  protected callHandler<T = any>(methodName: MethodsName, params: string | number = '') {
    return new Promise<T>((resolve, reject) => {
      const sessionId = this.getSessionid()
      const timer = setTimeout(() => {
        reject('timeout')
        this.eventList.delete(sessionId)
      }, this.timeout)
      this.eventList.set(sessionId, { resolve, reject, timer })

      console.log('this.eventList.size', this.eventList.size)

      // 通知原生事件
      window.maxrocky.postMessage(JSON.stringify({ sessionId, methodName, params }))
    })
  }

  onReady() {
    return new Promise<number>((resolve, reject) => {
      if (this.initDone) {
        resolve(0)
        return
      }
      this.onReadyFuns.push({ resolve, reject, time: Date.now() })
    })
  }

  /**
   * @param {String} key
   * @param {String} value
   * @description 设置LocalStroge
   */
  onSetLocalStorage(key: string, value: any) {
    if (this.native) {
      return this.callHandler<void>('storageValue', JSON.stringify({ key, value }))
    }
    return new Promise<void>(resolve => {
      resolve(localStorage.setItem(key, value))
    })
  }

  /**
   * @param {String} key
   * @description 获取LocalStroge
   */
  onGetLocalStorage(key: string) {
    if (this.native) {
      return this.callHandler<string | null>('acquireValue', key)
    }
    return new Promise<string | null>(resolve => {
      resolve(localStorage.getItem(key))
    })
  }

  /**
   * @param {String} key
   * @description 移除LocalStroge
   */
  onRemoveLocalStorage(key: string) {
    if (this.native) {
      return this.callHandler('clearValue', key)
    }
    return new Promise(resolve => {
      resolve(localStorage.removeItem(key))
    })
  }

  /**
   * @description 清空LocalStroge
   */
  onClearLocalStorage() {
    if (this.native) {
      return new Promise((_, reject) => {
        reject('TODO')
      })
    }
    return new Promise(resolve => {
      resolve(localStorage.clear())
    })
  }

  /**
   * @description 扫描二维码
   */
  onQRCodeClick() {
    if (this.native) {
      return this.callHandler('qrcode')
    }
    return new Promise((_, reject) => {
      reject('')
    })
  }

  /**
   * @description 获取图片
   */
  pickerPhoto(count = 1) {
    if (this.native) {
      return this.callHandler('selectPhoto', JSON.stringify({ count }))
    }
    return new Promise((_, reject) => {
      reject()
    })
  }

  /**
   * @description 拍照
   */
  takePhotos() {
    if (this.native) {
      return this.callHandler('openCamera')
    }
    return new Promise((_, reject) => {
      reject()
    })
  }

  /**
   * @description 开始录音
   */
  startRecordAudio(duration = 60) {
    if (this.native) {
      return this.callHandler('recordAudio', duration)
    }
    return new Promise((_, reject) => {
      reject()
    })
  }

  /**
   * @description 获取 ClientId， 华润做消息推送（公司那边肯能是自己推送）
   */
  getClientId() {
    if (this.native) {
      // TODO 待完成
      return new Promise((_, reject) => {
        reject('TODO')
      })
    }
    return new Promise((_, reject) => {
      reject()
    })
  }

  /**
   * @description 获取设备信息，那个型号，什么系统，可用屏幕、刘海屏
   */
  getDeviceInfo() {
    if (this.native) return this.callHandler('deviceInfo')
    return new Promise((_, reject) => {
      reject('is not native')
    })
  }

  /**
   * @description 获取网络状态
   */
  getNetworkType() {
    if (this.native) {
      // TODO 待完成
      return new Promise((_, reject) => {
        reject('TODO')
      })
    }
    return new Promise(resolve => {
      resolve(navigator.onLine ? 'wifi' : 'unknown')
    })
  }
}

const jssdk = new Jssdk()

export default jssdk
