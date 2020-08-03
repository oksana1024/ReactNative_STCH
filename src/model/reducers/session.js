import * as types from '../actionTypes';

const initialState = {
  poster: {},
  teacher: {}
};

export default function user (state = initialState, action = '') {
  switch (action.type) {
    case types.SESSION_UPDATE:
      return {
        sessionType: action.sessionType,
        subject: action.subject,
        problemId: action.problemId,
        problemData: action.problemData
      }
    case types.SESSION_CLEAR:
      return initialState
    case types.SESSION_GET_POSTER:
      return {
        ...state,
        poster: action.poster,
        [action.posterId]: {
          ...action.poster
        }
      }
    case types.SESSION_GET_TEACHER:
      return {
        ...state,
        teacher: action.teacher,
        [action.teacherId]: {
          ...action.teacherId
        }
      }
    default :
      return state
  }
}