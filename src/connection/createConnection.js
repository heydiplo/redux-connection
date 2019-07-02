// @flow
import 'isomorphic-fetch'

import { stringify } from 'qs'
import { some, each, isPlainObject, isArray } from 'lodash'

import type { RequestParams, Response, ErrorResponse, SuccessfulResponse } from '../types'

type ExtractErrorResponse = ({}) => any

type ConnectionConfig = {|
  endpoint: string,
  credentials?: CredentialsType,
  extractErrorResponse?: ExtractErrorResponse
|}

const defaultHandleErrorReponse: ExtractErrorResponse = (v) => v

const createHandleResponse = (extractErrorResponse: ExtractErrorResponse) => (response): Promise<SuccessfulResponse> => (
  response.text()
    .then((text) => {
      if (response.ok) {
        return Promise.resolve(JSON.parse(text))
      }

      let error
      try {
        error = JSON.parse(text)
        error = extractErrorResponse(error)
      } catch (e) {
        error = { message: text }
      }

      return Promise.reject(error)
    })
)

const handleNetworkError = (_error): Promise<ErrorResponse> => {
  let message = _error && _error.message

  if (!message || message === 'Failed to fetch') {
    message = 'Error loading data'
  }

  const error = _error || new Error()
  error.message = message

  return Promise.reject(error)
}

const formBody = (params) => {
  const body = new FormData()

  each(params, (value, key) => {
    let formValue = value

    if (isPlainObject(value) || isArray(value)) {
      formValue = JSON.stringify(value)
    }

    body.append(key, formValue)
  })

  return body
}

const jsonBody = (params) =>  JSON.stringify(params)

export default ({ endpoint, credentials, extractErrorResponse }: ConnectionConfig) => {
  const handleResponse = createHandleResponse(extractErrorResponse || defaultHandleErrorReponse)

  return ({
    method, path, params, headers: _headers
  }: RequestParams): Promise<Response> => {
    let body
    let url = `${endpoint}${path}`
    let json

    if (method === 'GET') {
      const query = stringify(params || {})
      if (query) url = `${url}?${query}`
    } else {
      json = !some(params, (value) => value instanceof File)

      body = json ? jsonBody(params) : formBody(params)
    }

    const headers = _headers || {}
    if (json) {
      headers['Content-Type'] = 'application/json'
    }

    return fetch(
      url, {
        method,
        body,
        headers,
        credentials
      }
    ).then(
      handleResponse,
      handleNetworkError
    )
  }
}
