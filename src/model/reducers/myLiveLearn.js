import * as types from '../actionTypes';
import _ from 'lodash';

const initialState = null;

export default function user (state = initialState, action = '') {
  switch (action.type) {
    case types.RECEIVE_MYLIVE_LEARN: 
      let problemLength = action.problems.length ? action.problems.length : 0;
      return {
        problems: action.problems,
        lastProblem: action.lastProblem,
        problemLength: problemLength
      }
    case types.RECEIVE_MYLIVE_LEARN_MORE:
      let prevProblems = _.get(state, 'problems', []);
      let prevProblemLength = _.get(state, 'problemLength', 0);
      let currentProblemLength = action.problems.length;
      return {
        problems: _.concat(prevProblems, action.problems),
        lastProblem: action.lastProblem,
        problemLength: prevProblemLength + currentProblemLength
      }
    case types.CLEAR_MYLIVE_LEARN:
      return initialState;
    default :
      return state
  }
}