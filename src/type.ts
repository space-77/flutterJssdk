import JssdkBase from './jssdk/jssdkBase'

declare global {
  interface Window {
    isNative: boolean
    flutter_inappwebview: {
      $jssdk?: JssdkBase
      onWillPop?: () => boolean
      callHandler: (metName: 'postMessage', message: string) => void
    }
  }
}

export {}
