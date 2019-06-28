// @flow
import type { Then, Params } from '../types'

export default (api: any) => {
  const wrapper =
    (method: string) =>
      (path: string, params?: Params, then?: Then) =>
        api({ method, path, params, then })

  return {
    POST: wrapper('POST'),
    GET: wrapper('GET'),
    DELETE: wrapper('DELETE'),
    PATCH: wrapper('PATCH')
  }
}
