import Jssdk from './jssdk/index'
import { JssdkOprion, AppLifecycleState } from './jssdk/jssdkBase'

const exitTime = 2 * 1000 // 两秒内两次返回退出应用
let exitTimer: number | undefined = undefined

const option: JssdkOprion = {
  onWillPop() {
    if (exitTimer === undefined) {
      jsskd.toast('再点一次退出')
      exitTimer = setTimeout(() => {
        clearTimeout(exitTimer)
        exitTimer = undefined
      }, exitTime)
      return false
    }

    console.log('退出应用')
    return true
  },
  onDidReceiveNotificationResponse({ payload, type }) {
    console.log(payload, type)
  },
  changeAppLifecycleState(state) {
    switch (state) {
      case AppLifecycleState.resumed:
        console.log('应用进入前台')
        break
      case AppLifecycleState.inactive:
        console.log('应用处于闲置状态')
        break
      case AppLifecycleState.detached:
        console.log('当前页面即将退出')
        break
      case AppLifecycleState.paused:
        console.log('应用处于后台')
        break
    }
  }
}

const jsskd = new Jssdk(option)

export const request = jsskd.createHttpRequest({
  baseUrl: 'https://om.gtcloud.cn',
  timeout: 20 * 1000,
  headers: {
    Cookie: `_bl_uid=Rklwwjmmsqt8jXsUjzqehjy4kvsg; JSESSIONID=141E455149E6D83E1E7B91B9B17336C4; SERVERID=4eedd86a9ee3ebadd2fb50501f7730fe|1689823518|1689823498`
  }
})

export default jsskd
