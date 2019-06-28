// @flow
import type { Action, ReduxStore } from '../types'

export default (store: ReduxStore) => (next: Action => any) => (action: Action) => {
  if (!action.api) return next(action)

  return next({
    types: action.types,
    payload: action.payload,
    promise: action.api(store)
  })
}
