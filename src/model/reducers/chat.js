import * as types from '../actionTypes';
import _ from 'lodash';

const initialState = {
  earlierLodable: false
};

export default function singup (state = initialState, action = '') {
  switch (action.type) {
    case types.RECEIVE_INIT_CHATS:
      return {
        ...state,
        messages: {
          ..._.get(state, 'messages', {}),
          ...action.chats
        },
        subject: action.subject,
        problemId: action.problemId,
        lastProblem: action.lastProblem,
        blockIndex: action.blockIndex,
      }
    case types.RECEIVE_MORE_CHATS:
      return {
        ...state,
        messages: {
          ..._.get(state, 'messages', {}),
          ...action.chats
        },
        subject: action.subject,
        problemId: action.problemId,
        lastProblem: action.lastProblem,
        blockIndex: action.blockIndex
      }
    case types.RECEIVE_CHAT_USERS:
      return {
        ...state,
        users: {
          ..._.get(state, 'users', {}),
          ...action.users
        }
      }
    case types.CLEAR_CHATS:
      return initialState
    case types.LOADING_EARLIER_MESSAGES:
      return {
        ...state,
        loading: action.loading
      }
    case types.SET_EARLIER_LODABLE:
      return {
        ...state,
        earlierLodable: action.lodable
      }
    default :
      return state
  }
}