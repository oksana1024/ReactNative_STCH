import {auth, firestore} from '../constants/firebase';
import navigationService from '../navigation/navigationService';
import pages from '../constants/pages';
import store from '../model/store';
import {clearListeners, clearUserListener, hasListener, addListener, offListenerWithPrefix} from './listeners';
import {fetchMyLearnProblems, fetchMyLearnProblemsMore, clearMyLearnProblems, fetchMyLiveLearnProblems, fetchMyLiveLearnProblemsMore, clearMyLiveLearnProblems} from '../model/actions/learnAC';
import {getLearnSession} from '../model/actions/ltsessionAC';
import _ from 'lodash';

export function getMyInitLearnList () {
  return async function (dispatch, getState) {
    try {
      if (!hasListener('my_learn_' + 0)) {
        
        var listener = firestore.collection('users')
        .doc(auth.currentUser.uid).collection('learn')
        .orderBy('uploadTime', 'DESC')
        .limit(50)
        .onSnapshot((snapShot) => {
          if (snapShot.docs.length > 0) {
            let problemArray = [];
            let lastProblem = snapShot.docs[snapShot.docs.length - 1];
            snapShot.forEach((doc) => {
              let problemData = doc.data();
              
                problemArray.push(problemData);
              
            })
            dispatch(fetchMyLearnProblems(problemArray, lastProblem, 0));
          }
        });
        addListener('my_learn_' + 0, listener);
      }
    } catch (e) {
      console.log("Fetch My Learn Problem Error = ", e);
    }
  }
}

export function getMyMoreLearnList () {
  return async function (dispatch, getState) {
    try {

      const currentState = getState();
      const teachObject = _.get(currentState, 'myLearn', {});
      const prevLastProblem = _.get(teachObject, 'lastProblem', null);
      const prevBlockIndex = _.get(teachObject, 'blockIndex', 0);
      const currentBlockIndex = prevBlockIndex + 1;

      if (!hasListener('my_learn_' + currentBlockIndex)) {  
        var listener = firestore.collection('users')
        .doc(auth.currentUser.uid).collection('learn')
        .orderBy('uploadTime', 'DESC')
        .startAfter(prevLastProblem)
        .limit(50)
        .onSnapshot((snapShot) => {
          if (snapShot.docs.length > 0) {
            let problemArray = [];
            let lastProblem = snapShot.docs[snapShot.docs.length - 1];
            snapShot.forEach((doc) => {
              let problemData = doc.data();
                problemArray.push(problemData);
            })
            dispatch(fetchMyLearnProblemsMore(problemArray, lastProblem, currentBlockIndex));
          }
        });
        addListener('my_learn_' + currentBlockIndex, listener);
      }
    } catch (e) {
      console.log("Fetch My Learn Problem Error = ", e);
    }
  }
}

export function clearMyLearnList() {
  return async function (dispatch, getState) {
    try {
      offListenerWithPrefix('my_learn');
      dispatch(clearMyLearnProblems());
    } catch (e) {
      console.log("Clear My Learn Problem Error = ", e);
    }
  }
}

export function getMyInitLiveLearnList () {
  return async function (dispatch, getState) {
    try {
      if (!hasListener('my_live_learn_start')) {
        var listener = firestore.collection('users')
        .doc(auth.currentUser.uid).collection('learn')
        .orderBy('uploadTime', 'DESC')
        .limit(50)
        .onSnapshot((snapShot) => {
          if (snapShot.docs.length > 0) {
            let problemArray = [];
            let lastProblem = snapShot.docs[snapShot.docs.length - 1];
            snapShot.forEach((doc) => {
              let problemData = doc.data();
              if (problemData.sesssionStartedAt != undefined && problemData.sesssionStartedAt == false
              ) {
                problemArray.push(problemData);
              }
            })
            dispatch(fetchMyLiveLearnProblems(problemArray, lastProblem));
          }
        });
        addListener('my_live_learn_start', listener);
      }
    } catch (e) {
      console.log("Fetch My Live Learn Problem Error = ", e);
    }
  }
}

export function getMyMoreLiveLearnList () {
  return async function (dispatch, getState) {
    try {
      const currentState = getState();
      const teachObject = _.get(currentState, 'myLiveLearn', {});
      const prevLastProblem = _.get(teachObject, 'lastProblem', null);

      if (!hasListener('my_live_learn_' + prevLastProblem)) {  
        var listener = firestore.collection('users')
        .doc(auth.currentUser.uid).collection('learn')
        .orderBy('uploadTime', 'DESC')
        .startAfter(prevLastProblem)
        .limit(50)
        .onSnapshot((snapShot) => {
          if (snapShot.docs.length > 0) {
            let problemArray = [];
            let lastProblem = snapShot.docs[snapShot.docs.length - 1];
            snapShot.forEach((doc) => {
              let problemData = doc.data();
              if (problemData.sesssionStartedAt != undefined && problemData.sesssionStartedAt == false
              ) {
                problemArray.push(problemData);
              }
            })
            dispatch(fetchMyLiveLearnProblemsMore(problemArray, lastProblem));
          }
        });
        addListener('my_live_learn_' + prevLastProblem, listener);
      }
    } catch (e) {
      console.log("Fetch My Live Learn More Problem Error = ", e);
    }
  }
}

export function clearMyLiveLearnList() {
  return async function (dispatch, getState) {
    try {
      offListenerWithPrefix('my_live_learn');
      dispatch(clearMyLiveLearnList());
    } catch (e) {
      console.log("Clear My Live Learn Problem Error = ", e);
    }
  }
}

