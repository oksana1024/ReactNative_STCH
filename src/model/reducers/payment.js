import * as types from '../actionTypes';

const initialState = null

export default function payments (state = initialState, action = '') {
  switch (action.type) {
    case types.RETRIVE_PAYMENTS:
      return {
        ...state,
        ...action.payments
      }
    case types.CLEAR_PAYMENTS:
      return initialState
    default :
      return state
  }
}