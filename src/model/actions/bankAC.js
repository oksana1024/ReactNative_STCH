import * as types from '../actionTypes';

export function fetchUserBank (bank) {
    return {
      type: types.RETRIEVE_BANK,
      bank
    }
}

export function clearUserBank() {
  return {
    type: types.CLEAR_BANK
  }
}

export function getExpress(account) {
  return {
      type: types.RETRIEVE_EXPRESS_ACCOUNT,
      account
  }
}

export function clearExpress() {
  return {
      type: types.CLEAR_EXPRESS_ACCOUNT
  }
}

export function getBalance(total, available, pending) {
  return {
    type: types.RETRIEVE_BALANCE,
    total, 
    available, 
    pending
  }
}

export function clearBalance() {
  return {
    type: types.CLEAR_BALANCE
  }
}