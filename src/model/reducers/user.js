import * as types from '../actionTypes';
import _ from 'lodash';

const initialState = {
  express: null
};

export default function user (state = initialState, action = '') {
  switch (action.type) {
    case types.RECEIVE_USER:
      return {
        ...action.user
      }
    case types.LOGOUT:
      return initialState
    // case types.RETRIEVE_EXPRESS_ACCOUNT:
    //   return {
    //     ...state,
    //     express: {
    //       ...action.account
    //     }
    //   }
    // case types.CLEAR_EXPRESS_ACCOUNT:
    //   return {
    //     ...state,
    //     express: null
    //   }
    default :
      return state
  }
}