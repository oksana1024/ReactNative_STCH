import * as types from '../actionTypes';

export function logoutUser () {
    return {
        type: types.LOGOUT
    }
}

export function fetchUser(user) {
    return {
        type: types.RECEIVE_USER,
        user
    }
}

export function clear (user) {
    return {
        type: types.CLEAR
    }
}