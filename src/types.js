// @flow
export type Params = { [string]: any }
export type Headers = { [string]: any }
export type Then = (any) => any

export type RequestParams = {|
  method: string,
  path: string,
  params: ?Params,
  headers: ?Headers,
  then?: Then
|}

export type SuccessfulResponse = { [string]: any }
export type ErrorResponse = { [string]: any }
export type Response = SuccessfulResponse | ErrorResponse
export type RequestPromise = Promise<Response>
export type Fetch = RequestParams => RequestPromise

export type AsyncActionTypes = {
  START: string,
  SUCCESS: string,
  FAILURE: string
}
