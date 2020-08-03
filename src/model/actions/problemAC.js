import * as types from '../actionTypes';

export function fetchProblem (subject, problems, lastProblem) {
    return {
        type: types.RETRIVE_PROBLMES,
        subject,
        problems,
        lastProblem
    }
}

export function clearProblems() {
    return {
        type: types.CLEAR_PROBLEMS
    }
}