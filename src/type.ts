import JssdkBase from './jssdk/jssdkBase'
import type { JssdkOprion } from './jssdk/jssdkBase'

declare global {
  interface Window {
    isNative: boolean
    flutter_inappwebview: {
      $jssdk?: JssdkBase
      onWillPop?: JssdkOprion['onWillPop']
      onDidReceiveNotificationResponse?: JssdkOprion['onDidReceiveNotificationResponse']
      callHandler: (metName: 'postMessage', message: string) => void
    }
  }
}

export {}
