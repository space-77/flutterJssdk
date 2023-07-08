export {}

declare global {
  interface Window {
    onMaxrockyReady(): void
    __maxrockyWebViewJavascriptBridgeCallBack__(method: string, response: string): void

    isNative: boolean

    maxrocky: {
      postMessage: (message: string) => void
    }
  }
}
