import * as types from '../actionTypes';

export function fetchSubjects (problem) {
    return {
        type: types.TEACH_SELECT,
        problem
    }
}

export function fetchMyTeachProblems(problems, lastProblem, blockIndex) {
  return {
    type: types.RECEIVE_MYTEACH_LIST,
    problems,
    lastProblem,
    blockIndex
  }
}

export function fetchMyTeachProblemsMore(problems, lastProblem, blockIndex) {
  return {
    type: types.RECEIVE_MYTEACH_MORE,
    problems,
    lastProblem,
    blockIndex
  }
}

export function clearMyTeachProblems(){
  return {
    type: types.CLEAR_MYTEACH_LIST
  }
}