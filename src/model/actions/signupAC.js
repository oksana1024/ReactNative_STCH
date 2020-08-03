import * as types from '../actionTypes';

export function signupUserInfo (userInfo) {
  return {
    type: types.SIGNUP_USERINFO,
    userInfo
  }
}

export function signupTechInfo (teachPay) {
  return {
    type: types.SIGNUP_TECHPAY,
    teachPay
  }
}

export function signupLearnInfo (learnPay) {
  return {
    type: types.SIGNUP_LEARNPAY,
    learnPay
  }
}

export function signupStripeInfo (stripeToken, card) {
  return {
    type: types.SIGNUP_STRIPE,
    stripeToken,
    card
  }
}