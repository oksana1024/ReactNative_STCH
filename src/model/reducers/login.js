import * as types from '../actionTypes';

const initialState = {
  userName: '',
  email: ''
};

export default function singup (state = initialState, action = '') {
  switch (action.type) {
    case types.LOGIN_USERINFO:
      return {
        ...state,
        ...action.userInfo
      }
    default :
      return state
  }
}