import * as types from '../actionTypes';

export function getPaymentMethods (payments) {
    return {
      type: types.RETRIVE_PAYMENTS,
      payments
    }
}

export function clearPaymentMethods() {
  return {
    type: types.CLEAR_PAYMENTS
  }
}

export function getPaymentHistory(history) {
  return {
    type: types.RETRIEVE_PAYMENT_HISTORY,
    history
  }
}

export function clearPaymentHistory() {
  return {
    type: types.CLEAR_PAYMENT_HISTORY
  }
}