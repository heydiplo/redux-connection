// @flow
// { path: '/items/:id', params: { id: 5 } } => { path: '/items/5', params: {} }
import { has } from 'lodash'

import type { Fetch, RequestParams, RequestPromise } from '../types'

export default (api: Fetch) => (options: RequestParams): RequestPromise => {
  const { params, path } = options
  const newParams = { ...params }
  let newPath = path

  if (params) {
    newPath = path.replace(
      /:([^:/.]+)/g,
      (originalPart, param) => {
        if (has(params, param)) {
          delete newParams[param]
          return params[param]
        }

        return originalPart
      }
    )
  }

  return api({
    ...options,
    path: newPath,
    params: newParams
  })
}
