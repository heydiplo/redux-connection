import type { AsyncActionTypes } from '../types'

export default (actionName: string): AsyncActionTypes => ({
  START: actionName,
  SUCCESS: `${actionName}_SUCCESS`,
  FAILURE: `${actionName}_FAILURE`
})
