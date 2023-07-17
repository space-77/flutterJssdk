import Jssdk from './jssdk/index'
import { JssdkBaseOprion } from './jssdk/jssdkBase'

const exitTime = 2 * 1000 // 两秒内两次返回退出应用
let exitTimer: number | undefined = undefined

const option: JssdkBaseOprion = {
  onWillPop() {
    if (exitTimer === undefined) {
      console.log('再点一次退出')
      exitTimer = setTimeout(() => {
        clearTimeout(exitTimer)
        exitTimer = undefined
      }, exitTime)
      return false
    }

    console.log('退出应用')
    return true
  }
}

const jsskd = new Jssdk(option)

export default jsskd
