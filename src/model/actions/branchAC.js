import * as types from '../actionTypes';

export function changeAppBranch(branch) {
  return {
    type: types.CHANGE_APP_BRANCH,
    branch
  }
}