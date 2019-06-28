// @flow
// some general logic, like attaching auth_token to every request
// and signing out after auth error
import { get, merge } from 'lodash'

import type { Params, Headers, RequestParams, Response, ErrorResponse, SuccessfulResponse } from '../types'

const createErrorHandler = (store, handleResponseError) => (error) => {
  handleResponseError(error, store)

  return Promise.reject(error)
}

type ParamsAndHeaders = { params: ?Params, headers: ?Headers }

type Config = {
  enhanceRequest: (any, RequestParams) => ParamsAndHeaders,
  handleResponseError: any
}

export default ({ enhanceRequest, handleResponseError }: Config) =>
  (api: any) =>
    (requestParams: RequestParams) =>
      (store: any) => {
        let errorHandler
        let newRequestParams = requestParams
          
        if (enhanceRequest) {
          newRequestParams = merge({}, requestParams, enhanceRequest(store, requestParams))
        }

        if (handleResponseError) {
          errorHandler = createErrorHandler(store, handleResponseError)
        }

        let call = api(newRequestParams)

        if (errorHandler) {
          call = call.catch(errorHandler)
        }

        if (requestParams.then) {
          call = call.then(requestParams.then)
        }

        return call
      }
