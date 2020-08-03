import * as types from '../actionTypes';

export function updateSession (sessionType, subject, problemId, problemData) {
    return {
        type: types.SESSION_UPDATE,
        sessionType,
        subject,
        problemId,
        problemData
    }
}

export function clearSession() {
    return {
        type: types.SESSION_CLEAR
    }
}

export function updatePoster(poster, posterId) {
  return {
    type: types.SESSION_GET_POSTER,
    poster,
    posterId
  }
}

export function updateTeacher(teacher, teacherId) {
  return {
    type: types.SESSION_GET_TEACHER,
    teacher,
    teacherId
  }
}