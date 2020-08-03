import * as types from '../actionTypes';

const initialState = null;

export default function user (state = initialState, action = '') {
  switch (action.type) {
    case types.RETRIVE_SUBJECTS:
      return {
        subject: action.subjects
      }
    default :
      return state
  }
}