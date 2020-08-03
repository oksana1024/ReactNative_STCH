import * as types from '../actionTypes';

export function getLearnSession (sessionData) {
    return {
        type: types.LSESSION_GET,
        sessionData
    }
}

export function getTeachSession (sessionData) {
  return {
    type: types.TSESSION_GET,
    sessionData
  }
}

export function clearLTSession() {
  return {
    type: types.LTSESSION_CLEAR
  }
}

export function clearLearnSession() {
  return {
    type: types.LEARN_SESSION_CLEAR
  }
}

export function clearTeachSession () {
  return {
    type: types.TEACH_SESSION_CLEAR
  }
}

