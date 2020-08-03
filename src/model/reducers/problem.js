import * as types from '../actionTypes';
import _ from 'lodash';

const initialState = null;

export default function user (state = initialState, action = '') {
  switch (action.type) {
    case types.RETRIVE_PROBLMES:
      return {
        subject: action.subject,
        problems: {
          ..._.get(state, 'problems', {}),
          ...action.problems
        },
        lastProblem: action.lastProblem,
      }
    case types.RETRIVE_MORE_PROBLEMS:
      // let prevProblemObject = _.get(state, action.subject, {});
      let prevProblems = _.get(state, 'problems', []);
      let prevProblemBlockIndex = _.get(state, 'blockIndex', 0);
      let prevProblemLength = _.get(state, 'problemLength', 0);
      let currentProblemLength = action.problems.length;
      return {
        subject: action.subject,
        problems: _.concat(prevProblems, action.problems),
        lastProblem: action.lastProblem,
        blockIndex: prevProblemBlockIndex++,
        problemLength: prevProblemLength + currentProblemLength
      }
    case types.CLEAR_PROBLEMS:
      return initialState;
    default :
      return state
  }
}