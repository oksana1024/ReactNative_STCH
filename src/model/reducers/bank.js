import * as types from '../actionTypes';

const initialState = null

export default function payments (state = initialState, action = '') {
  switch (action.type) {
    // case types.RETRIEVE_BANK:
    //   return {
    //     ...action.bank
    //   }
    case types.RETRIEVE_EXPRESS_ACCOUNT:
      return {
        ...state,
        express: {
          ...action.account
        }
      }
    case types.CLEAR_EXPRESS_ACCOUNT:
      return {
        ...state,
        express: null
      }
    case types.RETRIEVE_BALANCE:
      return {
        ...state,
        balance: {
          total: action.total,
          available: action.available,
          pending: action.pending
        }
      }
    case types.CLEAR_BALANCE:
      return {
        ...state,
        balance: null
      }
    // case types.CLEAR_BANK:
    //   return initialState
    default :
      return state
  }
}