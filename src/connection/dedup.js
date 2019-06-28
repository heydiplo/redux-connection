// @flow
// keeps track of requests inflight and attaches to them
// insted of firing a new one
import type { Fetch, RequestParams, RequestPromise } from '../types'

export default (api: Fetch) => {
  const inflight = {}

  const onSuccess = (key) => (r) => {
    delete inflight[key]

    return r
  }

  const onFailure = (key) => (error) => {
    delete inflight[key]

    return Promise.reject(error)
  }

  const getHash = (options) => {
    const { method, path, params } = options

    return [method, path, JSON.stringify(params)].join('/')
  }

  const withDedup = (options: RequestParams): RequestPromise => {
    if (options.method !== 'GET') {
      return api(options)
    }

    const hash = getHash(options)

    if (!inflight[hash]) {
      inflight[hash] = api(options).then(onSuccess(hash), onFailure(hash))
    }

    return inflight[hash]
  }

  withDedup.inflight = inflight

  return withDedup
}
