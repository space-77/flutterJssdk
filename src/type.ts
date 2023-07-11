export {}

declare global {
  interface Window {
    isNative: boolean

    flutter_inappwebview: {
      postMessage: (message: string) => void
    }
  }
}
