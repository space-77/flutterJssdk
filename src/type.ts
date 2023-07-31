import JssdkBase from './jssdk/jssdkBase'
import type { JssdkOprion } from './jssdk/jssdkBase'

declare global {
  interface Window {
    isNative: boolean
    flutter_inappwebview: {
      $jssdk?: JssdkBase
      onWillPop?: JssdkOprion['onWillPop']
      callHandler: (metName: 'postMessage', message: string) => void
      changeAppLifecycleState?: (status: 'resumed' | 'inactive' | 'detached' | 'paused') => void
      onDidReceiveNotificationResponse?: JssdkOprion['onDidReceiveNotificationResponse']
    }
  }
}

export {}
