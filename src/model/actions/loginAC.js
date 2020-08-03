import * as types from '../actionTypes';

export function loginUserInfo (userInfo) {
  return {
    type: types.LOGIN_USERINFO,
    userInfo
  }
}