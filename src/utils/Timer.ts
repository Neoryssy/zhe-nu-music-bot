export default class Timer {
  private _timeout: NodeJS.Timeout | null

  constructor() {
    this._timeout = null
  }

  set(ms: number, callback: () => void) {
    this._timeout = setTimeout(callback, ms)
  }

  stop() {
    if (this._timeout) {
      clearTimeout(this._timeout)
      this._timeout = null
    }
  }
}
