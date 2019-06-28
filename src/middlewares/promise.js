// @flow
import type { Action, Payload } from '../types'

export default () => (next: Action => any) => (action: Action) => {
  if (!action.promise) return next(action)

  const { promise, types } = action

  const payload: Payload = action.payload || {}

  const { START, SUCCESS, FAILURE } = types

  next({ payload, type: START })

  return promise
    .then(
      (result) => {
        next({ type: SUCCESS, payload: { ...payload, result }})

        return result
      },
      (error) => {
        next({ type: FAILURE, payload: { ...payload, error }})

        return Promise.reject(error)
      }
    )
}
