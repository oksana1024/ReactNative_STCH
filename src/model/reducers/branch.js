import * as types from '../actionTypes';

const initialState = {
  branch: 'learn'
}

export default function payments (state = initialState, action = '') {
  switch (action.type) {
    case types.CHANGE_APP_BRANCH:
      return {
        ...state,
        branch: action.branch
      }
    default :
      return state
  }
}