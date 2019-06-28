import type { Fetch, RequestParams, RequestPromise } from '../types'

export default (enabled: bool) => (api: Fetch) => {
  if (!enabled) return api

  return (options: RequestParams): RequestPromise => {
    const started = new Date()

    const finished = (status: string) => {
      const time = (new Date()) - started

      console.log(`API ${options.path}: ${status} ${time}ms`)
    }

    const onSuccess = (response) => {
      finished('OK')
      return response
    }
    const onError = (error) => {
      finished('ERROR')
      throw error
    }

    return api(options).then(onSuccess, onError)
  }
}
