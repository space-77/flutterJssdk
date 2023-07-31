import urlJoin from 'url-join'
import JssdkBase, { JssdkOprion, maxrockyWebView } from './jssdkBase'
import type {
  BaseRequest,
  CameraPhotoParams,
  ConnectivityInfo,
  HttpRequest,
  HttpRequestConfig,
  Image,
  LocalNotification,
  NetworkInfo,
  PickerPhotoParams,
  ToastToast
} from './types'
export default class Jssdk extends JssdkBase {
  // constructor(option?: JssdkOprion) {
  //   super(option)
  // }

  get isNative() {
    return this.native
  }

  onReady() {
    const time = Date.now()
    if (!maxrockyWebView) return Promise.resolve(Date.now() - time)
    return new Promise<number>((resolve, reject) => {
      if (this.initDone) {
        resolve(Date.now() - time)
        return
      }
      this.onReadyFuns.push({ resolve, reject, time })
    })
  }

  reload() {
    if (this.native) return this.callHandler<void>('reload')
    location.reload()
  }

  /**
   * @param {String} key
   * @param {String} value
   * @description 设置LocalStroge
   */
  setLocalStorage(key: string, value: any) {
    if (this.native) return this.callHandler<void>('setLocalStorage', JSON.stringify({ key, value }))
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
  pickerPhoto(params?: PickerPhotoParams) {
    if (this.native) return this.callHandler<Image[]>('pickerPhoto', JSON.stringify(params ?? {}))
    return new Promise<Image[]>((_, reject) => {
      reject()
    })
  }

  /**
   * @description 拍照
   */
  openCamera(params?: CameraPhotoParams) {
    if (this.native) return this.callHandler<Image | undefined>('openCamera', JSON.stringify(params ?? {}))
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
   * @description 获取设备信息，那个型号，什么系统，可用屏幕、刘海屏
   */
  getDeviceInfo() {
    if (this.native) return this.callHandler('deviceInfo')
    return new Promise((_, reject) => {
      reject('is not native')
    })
  }

  /**
   * @description toast
   */
  toast(params: ToastToast | string) {
    const p: ToastToast = typeof params === 'string' ? { msg: params } : params
    if (this.native) return this.callHandler('toast', JSON.stringify(p))
    return new Promise((_, reject) => {
      reject('is not native')
    })
  }

  /**
   * @description 获取网络状态
   */
  getConnectivity() {
    if (this.native) return this.callHandler<ConnectivityInfo>('connectivity')
    return new Promise<ConnectivityInfo>(resolve => {
      resolve(navigator.onLine ? 'wifi' : 'none')
    })
  }

  /**
   * @description 获取网络信息，ipv4 ipv6 网关 等
   */
  getNetworkInfo() {
    if (this.native) return this.callHandler<NetworkInfo>('networkInfo')
    return new Promise<NetworkInfo>((_, reject) => {
      reject()
    })
  }

  /**
   * @description 设置导航颜色
   */
  setNavigationBarColor(type: 'dark' | 'light') {
    if (this.native) return this.callHandler('setNavigationBarColor', type)
    return new Promise((_, reject) => {
      reject()
    })
  }

  /**
   * @description 原生提供网络请求，没有跨域
   */
  async httpRequest<T>(config: HttpRequestConfig): Promise<HttpRequest<T>> {
    if (this.native) {
      const res = await this.callHandler('httpRequest', JSON.stringify(config))
      const data = JSON.parse(res) as HttpRequest<T>
      data.config = config
      if (data.status >= 400) return Promise.reject(data)
      return data
    }
    return new Promise<HttpRequest<T>>((_, reject) => {
      reject()
    })
  }

  /**
   * @description 创建请求方法，类似 axios.created()
   */
  createHttpRequest<T>(baseConfig: BaseRequest = {}) {
    const { baseUrl, timeout, headers = {} } = baseConfig
    return <D = T>(config: HttpRequestConfig) => {
      let url = config.url
      if (!this.isLink(url) && baseUrl) url = urlJoin(baseUrl, url)

      const cof: HttpRequestConfig = {
        ...config,
        url,
        timeout: config.timeout || timeout,
        headers: { ...headers, ...(config.headers ?? {}) }
      }
      return this.httpRequest<D>(cof)
    }
  }

  /**
   * @description 本地通知 / 任务栏通知
   */
  localNotification(config: LocalNotification) {
    if (this.isNative) return this.callHandler('localNotification', JSON.stringify(config))
    return new Promise(resolve => {
      resolve('')
    })
  }

  /**
   * @description 文件下载
   */
  fileDownload(url: string) {
    if (this.isNative) return this.callHandler('fileDownload', url)
    return new Promise(resolve => {
      resolve('')
    })
  }

  /**
   * @description 文件上传
   */
  fileUpload(url: string) {
    if (this.isNative) return this.callHandler('fileUpload', url)
    return new Promise(resolve => {
      resolve('')
    })
  }

  /**
   * @description 复制内容到粘贴板
   */
  setClipboard(text: string) {
    if (this.isNative) return this.callHandler('setClipboard', text)
    return new Promise(resolve => {
      resolve('')
    })
  }

  /**
   * @description 获取粘贴板内容
   */
  getClipboard() {
    if (this.isNative) return this.callHandler('getClipboard')
    return new Promise(resolve => {
      resolve('')
    })
  }
}
