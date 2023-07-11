export {}

declare global {
  interface Window {
    isNative: boolean
    flutter_inappwebview: {
      callHandler: (metName: 'postMessage', message: string) => void
    }
  }
}
