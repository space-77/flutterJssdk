import JssdkBase from './jssdkBase'
import type { Image } from './types'
class Jssdk extends JssdkBase {
  get isNative() {
    return this.native
  }

  onReady() {
    const time = Date.now()
    if (!window.flutter_inappwebview) return Promise.resolve(Date.now() - time)
    return new Promise<number>((resolve, reject) => {
      if (this.initDone) {
        resolve(Date.now() - time)
        return
      }
      this.onReadyFuns.push({ resolve, reject, time })
    })
  }

  reload() {
    location.reload()
    // if (this.native) {
    //   console.log('123');
    //   return this.callHandler<void>('reload')
    // } else {
    //   location.reload()
    // }
  }

  /**
   * @param {String} key
   * @param {String} value
   * @description 设置LocalStroge
   */
  setLocalStorage(key: string, value: any) {
    if (this.native) {
      return this.callHandler<void>('setLocalStorage', JSON.stringify({ key, value }))
    }
    return new Promise<void>(resolve => {
      resolve(localStorage.setItem(key, value))
    })
  }

  /**
   * @param {String} key
   * @description 获取LocalStroge
   */
  getLocalStorage(key: string) {
    if (this.native) return this.callHandler<string | null>('getLocalStorage', key)
    return new Promise<string | null>(resolve => {
      resolve(localStorage.getItem(key))
    })
  }

  /**
   * @param {String} key
   * @description 移除LocalStroge
   */
  removeLocalStroge(key: string) {
    if (this.native) return this.callHandler<boolean>('removeLocalStroge', key)
    return new Promise<boolean>(resolve => {
      localStorage.removeItem(key)
      resolve(true)
    })
  }

  /**
   * @description 清除LocalStroge
   */
  clearLocalStroge() {
    if (this.native) return this.callHandler('clearLocalStroge')
    return new Promise(resolve => {
      resolve(localStorage.clear())
    })
  }

  /**
   * @description 扫描二维码
   */
  qrcode() {
    if (this.native) return this.callHandler<string>('qrcode')
    // eslint-disable-next-line promise/param-names
    return new Promise((_, reject) => {
      reject('')
    })
  }

  /**
   * @description 获取图片
   */
  pickerPhoto(count = 1) {
    if (this.native) {
      return this.callHandler<Image[]>('pickerPhoto', JSON.stringify({ count }))
    }
    return new Promise<Image[]>((_, reject) => {
      reject()
    })
  }

  /**
   * @description 拍照
   */
  openCamera() {
    if (this.native) {
      return this.callHandler<Image | undefined>('openCamera')
    }
    return new Promise<Image | undefined>((_, reject) => {
      reject()
    })
  }

  /**
   * @description 原生返回
   */
  navPop() {
    if (this.native) this.callHandler<undefined>('navPop')
    return new Promise<undefined>((_, reject) => {
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
