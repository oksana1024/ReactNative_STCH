import * as types from '../actionTypes';

const initialState = {
  userName: '',
  email: ''
};

export default function singup (state = initialState, action = '') {
  switch (action.type) {
    case types.SIGNUP_USERINFO:
      return {
        ...state,
        ...action.userInfo
      }
    case types.SIGNUP_TECHPAY:
      return {
        ...state,
        teachPay: {
          ...action.teachPay
        }
      }
    case types.SIGNUP_LEARNPAY:
      return {
        ...state,
        learnPay: {
          ...action.learnPay
        }
      }
    case types.SIGNUP_STRIPE:
      return {
        ...state,
        stripeToken: action.stripeToken,
        card: {
          ...action.card
        }
      }
    default :
      return state
  }
}