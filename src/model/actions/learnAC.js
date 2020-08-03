import * as types from '../actionTypes';

export function fetchMyLearnProblems(problems, lastProblem, blockIndex) {
  return {
    type: types.RECEIVE_MYLEARN_LIST,
    problems,
    lastProblem,
    blockIndex
  }
}

export function fetchMyLearnProblemsMore(problems, lastProblem, blockIndex) {
  return {
    type: types.RECEIVE_MYLEARN_MORE,
    problems,
    lastProblem,
    blockIndex
  }
}

export function clearMyLearnProblems(){
  return {
    type: types.CLEAR_MYTEACH_LIST
  }
}

export function fetchMyLiveLearnProblems (problems, lastProblem) {
  return {
    type: types.RECEIVE_MYLIVE_LEARN,
    problems,
    lastProblem
  }
}

export function fetchMyLiveLearnProblemsMore(problems, lastProblem) {
  return {
    type: types.RECEIVE_MYLIVE_LEARN_MORE,
    problems,
    lastProblem
  }
}

export function clearMyLiveLearnProblems(problems, lastProblem) {
  return {
    type: types.CLEAR_MYLIVE_LEARN
  }
}