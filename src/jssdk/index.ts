type CallBackRes = {
  msg: string;
  data: any;
  code: 0 | -1;
  sessionId: number;
};

type MethodsName =
  | "deviceInfo"
  | "storageValue"
  | "acquireValue"
  | "clearValue"
  | "qrcode"
  | "selectPhoto"
  | "openCamera"
  | "recordAudio"
  | "recordAudio";

type TOnReadyFuns = { resolve: Function; reject: Function; time: number };

type MaxRockyEvent = {
  code: number;
  data: string;
  msg: string;
  sessionid: number;
};

class Jssdk {
  isNative = false;
  protected initDone = false;
  protected static sessionid = 0;
  protected static initTimer?: number;
  protected timeout = 1000 * 5;
  protected eventList = new Map<number, [Function, Function, number]>();
  protected onReadyFuns: TOnReadyFuns[] = [];

  constructor() {
    this.init();
    this.addEventListener();
  }

  protected init() {
    clearTimeout(Jssdk.initTimer);

    window.onMaxrockyReady = () => {
      this.isNative = true;
      this.initDone = true;
      this.onReadyFuns.forEach(({ resolve, time }) => {
        resolve(Date.now() - time);
      });
    };

    setTimeout(() => {
      this.isNative = false;
      this.onReadyFuns.forEach(({ reject }) => {
        this.initDone = true;
        reject("is not navtive");
      });
    }, 800);
  }

  protected addEventListener() {
    // const ev = document.createEvent("CustomEvent");
    // ev.initCustomEvent("bridgeCallBack", false, false, args);
    // window

    // const ev = new Event("BridgeCallBack");
    // window.dispatchEvent(ev);
    window.addEventListener("BridgeCallBack", (res: any) => {
      const { sessionid, code, msg, data } = res.detail as MaxRockyEvent;
      const eventInfo = this.eventList.get(sessionid);

      console.log(eventInfo);

      if (!eventInfo) return;

      console.log({ sessionid, code, msg, data });

      const [resolve, reject, timer] = eventInfo;
      code === 0 ? resolve(data) : reject(msg);
      clearTimeout(timer);
      this.eventList.delete(sessionid);
    });
  }

  protected getSessionid() {
    if (Jssdk.sessionid >= 999999) Jssdk.sessionid = 0;
    Jssdk.sessionid++;
    return Jssdk.sessionid;
  }

  // protected jsBridgeCallBack(_: string, response: string) {
  //   try {
  //     // const [_, response] = res as string[]
  //     const { data, code, msg, sessionId } = JSON.parse(
  //       response
  //     ) as CallBackRes;
  //     const promiseFun = this.eventList.get(sessionId);
  //     if (!promiseFun) return;
  //     const [resolve, reject, timer] = promiseFun;
  //     code === 0 ? resolve(data) : reject(msg);
  //     clearTimeout(timer);
  //     this.eventList.delete(sessionId);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }

  protected callHandler<T = any>(
    methodName: MethodsName,
    params: string | number = ""
  ) {
    return new Promise<T>((resolve, reject) => {
      const sessionId = this.getSessionid();
      const timer = setTimeout(() => {
        reject("timeout");
        this.eventList.delete(sessionId);
      }, this.timeout);
      this.eventList.set(sessionId, [resolve, reject, timer]);

      // 通知原生事件
      window.maxrocky.postMessage(
        JSON.stringify({ sessionId, methodName, params })
      );
    });
  }

  onReady() {
    return new Promise<number>((resolve, reject) => {
      if (this.initDone) {
        resolve(0);
        return;
      }
      this.onReadyFuns.push({ resolve, reject, time: Date.now() });
    });
  }

  // on(funInfo: TMethod) {
  //   this.onMethods.push(funInfo);
  // }

  /**
   * @param {String} key
   * @param {String} value
   * @description 设置LocalStroge
   */
  onSetLocalStorage(key: string, value: any) {
    if (this.isNative) {
      return this.callHandler<void>(
        "storageValue",
        JSON.stringify({ key, value })
      );
    }
    return new Promise<void>((resolve) => {
      resolve(localStorage.setItem(key, value));
    });
  }

  /**
   * @param {String} key
   * @description 获取LocalStroge
   */
  onGetLocalStorage(key: string) {
    if (this.isNative) {
      return this.callHandler<string | null>("acquireValue", key);
    }
    return new Promise<string | null>((resolve) => {
      resolve(localStorage.getItem(key));
    });
  }

  /**
   * @param {String} key
   * @description 移除LocalStroge
   */
  onRemoveLocalStorage(key: string) {
    if (this.isNative) {
      return this.callHandler("clearValue", key);
    }
    return new Promise((resolve) => {
      resolve(localStorage.removeItem(key));
    });
  }

  /**
   * @description 清空LocalStroge
   */
  onClearLocalStorage() {
    if (this.isNative) {
      return new Promise((_, reject) => {
        reject("TODO");
      });
    }
    return new Promise((resolve) => {
      resolve(localStorage.clear());
    });
  }

  /**
   * @description 扫描二维码
   */
  onQRCodeClick() {
    if (this.isNative) {
      return this.callHandler("qrcode");
    }
    return new Promise((_, reject) => {
      reject("");
    });
  }

  /**
   * @description 获取图片
   */
  pickerPhoto(count = 1) {
    if (this.isNative) {
      return this.callHandler("selectPhoto", JSON.stringify({ count }));
    }
    return new Promise((_, reject) => {
      reject();
    });
  }

  /**
   * @description 拍照
   */
  takePhotos() {
    if (this.isNative) {
      return this.callHandler("openCamera");
    }
    return new Promise((_, reject) => {
      reject();
    });
  }

  /**
   * @description 开始录音
   */
  startRecordAudio(duration = 60) {
    if (this.isNative) {
      return this.callHandler("recordAudio", duration);
    }
    return new Promise((_, reject) => {
      reject();
    });
  }

  /**
   * @description 获取 ClientId， 华润做消息推送（公司那边肯能是自己推送）
   */
  getClientId() {
    if (this.isNative) {
      // TODO 待完成
      return new Promise((_, reject) => {
        reject("TODO");
      });
    }
    return new Promise((_, reject) => {
      reject();
    });
  }

  /**
   * @description 获取设备信息，那个型号，什么系统，可用屏幕、刘海屏
   */
  getDeviceInfo() {
    console.log(this.isNative);
    if (this.isNative) {
      // TODO 待完成
      return this.callHandler("deviceInfo");
    }
    return new Promise((_, reject) => {
      reject();
    });
  }

  /**
   * @description 获取网络状态
   */
  getNetworkType() {
    if (this.isNative) {
      // TODO 待完成
      return new Promise((_, reject) => {
        reject("TODO");
      });
    }
    return new Promise((resolve) => {
      resolve(navigator.onLine ? "wifi" : "unknown");
    });
  }
}

const jssdk = new Jssdk();

export default jssdk;
