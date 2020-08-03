import * as types from '../actionTypes';

export function fetchSubjects (subjects) {
    return {
        type: types.RETRIVE_SUBJECTS,
        subjects
    }
}