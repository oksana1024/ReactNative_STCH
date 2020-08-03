import * as types from '../actionTypes';

export function fetchInitChats (chats, subject, problemId, lastProblem, blockIndex = 0) {
  return {
    type: types.RECEIVE_INIT_CHATS,
    chats,
    subject,
    problemId,
    lastProblem,
    blockIndex
  }
}

export function fetchMoreChats (chats, subject, problemId, lastProblem, blockIndex) {
  return {
    type: types.RECEIVE_MORE_CHATS,
    chats,
    subject,
    problemId,
    lastProblem,
    blockIndex
  }
}

export function clearChats () {
  return {
    type: types.CLEAR_CHATS
  }
}

export function fetchChatUsers (users) {
  return {
    type: types.RECEIVE_CHAT_USERS,
    users
  }
}

export function loadEarlierChats (loading) {
  return {
    type: types.LOADING_EARLIER_MESSAGES,
    loading
  }
}

export function setEarliearLoadable(lodable) {
  return {
    type: types.SET_EARLIER_LODABLE,
    lodable
  }
}