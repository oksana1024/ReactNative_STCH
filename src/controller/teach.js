import {auth, firestore} from '../constants/firebase';
import navigationService from '../navigation/navigationService';
import pages from '../constants/pages';
import store from '../model/store';
import {clearListeners, clearUserListener, hasListener, addListener, offListenerWithPrefix} from './listeners';
import {fetchMyTeachProblems, fetchMyTeachProblemsMore, clearMyTeachProblems} from '../model/actions/teachAC';
import _ from 'lodash';

export async function selectProblem(subject, problem) {
  // console.log("Problem Select ID = ", problem.problemId);
  firestore.collection(subject.toLowerCase()).doc(problem.problemId).update({
    sessionExist: true,
    teacherId: auth.currentUser.uid
  })
}

export function getMyInitTeachList () {
  return async function (dispatch, getState) {
    try {
      if (!hasListener('my_teach_' + 0)) {
        
        var listener = firestore.collection('users')
        .doc(auth.currentUser.uid).collection('teach')
        .orderBy('sessionStartedAt', 'DESC')
        .limit(20)
        .onSnapshot((snapShot) => {
          if (snapShot.docs.length > 0) {
            let problemArray = [];
            let lastProblem = snapShot.docs[snapShot.docs.length - 1];
            snapShot.forEach((doc) => {
              let problemData = doc.data();
              // problemData['userName'] = '';
              // let userData = await firestore.collection('users').doc(problemData.posterId).get();
              // problemData['userName'] = userData.userName;
              problemArray.push(problemData);
            })
            dispatch(fetchMyTeachProblems(problemArray, lastProblem, 0));
          }
        });
        addListener('my_teach_' + 0, listener);
      }
    } catch (e) {
      console.log("Fetch My Teaching Problem Error = ", e);
    }
  }
}

export function getMyMoreTeachList () {
  return async function (dispatch, getState) {
    try {

      const currentState = getState();
      const teachObject = _.get(currentState, 'myTeach', {});
      const prevLastProblem = _.get(teachObject, 'lastProblem', null);
      const prevBlockIndex = _.get(teachObject, 'blockIndex', 0);
      const currentBlockIndex = prevBlockIndex + 1;

      if (!hasListener('my_teach_' + currentBlockIndex)) {  
        var listener = firestore.collection('users')
        .doc(auth.currentUser.uid).collection('teach')
        .orderBy('sessionStartedAt', 'DESC')
        .startAfter(prevLastProblem)
        .limit(20)
        .onSnapshot((snapShot) => {
          if (snapShot.docs.length > 0) {
            let problemArray = [];
            let lastProblem = snapShot.docs[snapShot.docs.length - 1];
            snapShot.forEach((doc) => {
              let problemData = doc.data();
              // problemData['userName'] = '';
              // let userData = await firestore.collection('users').doc(problemData.posterId).get();
              // problemData['userName'] = userData.userName;
              problemArray.push(problemData);
            })
            dispatch(fetchMyTeachProblemsMore(problemArray, lastProblem, currentBlockIndex));
          }
        });
        addListener('my_teach_' + currentBlockIndex, listener);
      }
    } catch (e) {
      console.log("Fetch My Teaching Problem Error = ", e);
    }
  }
}

export function clearMyTeachList() {
  return async function (dispatch, getState) {
    try {
      offListenerWithPrefix('my_teach');
      dispatch(clearMyTeachProblems());
    } catch (e) {
      console.log("Clear My Teach Problem Error = ", e);
    }
  }
}