export {}

declare global {
  interface Window {
    isNative: boolean

    maxrockyJsbridge: {
      postMessage: (message: string) => void
    }
  }
}
