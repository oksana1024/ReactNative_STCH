import * as types from '../actionTypes';
import _ from 'lodash';

const initialState = null;

export default function user (state = initialState, action = '') {
  switch (action.type) {
    case types.RECEIVE_MYLEARN_LIST: 
      let problemLength = action.problems.length ? action.problems.length : 0;
      return {
        problems: action.problems,
        lastProblem: action.lastProblem,
        blockIndex: 0,
        problemLength: problemLength
      }
    case types.RECEIVE_MYLEARN_MORE:
      let prevProblems = _.get(state, 'problems', []);
      let prevProblemBlockIndex = _.get(state, 'blockIndex', -1);
      let prevProblemLength = _.get(state, 'problemLength', 0);
      let currentProblemLength = action.problems.length;
      return {
        problems: _.concat(prevProblems, action.problems),
        lastProblem: action.lastProblem,
        blockIndex: prevProblemBlockIndex++,
        problemLength: prevProblemLength + currentProblemLength
      }
    case types.CLEAR_MYLEARN_LIST:
      return initialState;
    default :
      return state
  }
}