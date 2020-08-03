import * as types from '../actionTypes';

const initialState = null

export default function payments (state = initialState, action = '') {
  switch (action.type) {
    case types.RETRIEVE_PAYMENT_HISTORY:
      return {
        ...state,
        ...action.history
      }
    case types.CLEAR_PAYMENT_HISTORY:
      return initialState
    default :
      return state
  }
}