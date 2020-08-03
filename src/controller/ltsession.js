import {auth, firestore} from '../constants/firebase';
import {clearListeners, clearUserListener, hasListener, addListener, offListenerWithPrefix} from './listeners';
import {getLearnSession, getTeachSession, clearLTSession, clearLearnSession, clearTeachSession} from '../model/actions/ltsessionAC';
import _ from 'lodash';

export function getMyLiveLearnSession() {
  return async function (dispatch, getState) {
    try {
      if (!hasListener('my_livelearn_session')) {
        let listener = firestore.collection('users').doc(auth.currentUser.uid).collection('learn_session')
        .onSnapshot(sn => {
          if (sn.size > 0) {
            dispatch(clearLearnSession());
            let sessionData = {};
            sn.forEach(doc => {
              let docData = doc.data();
              // let teacherId = docData.teacherId;
              // let teacherDoc = await firestore.collection('users').doc(teacherId).get();
              // let teacherName = teacherDoc.data().userName;
              // docData['teacherName'] = teacherName;
              // if (docData.sessionDeleted == false)
                sessionData[doc.id] = docData;
            });
            console.log("LiveLearn Session Data = ", sessionData);
            dispatch(getLearnSession(sessionData));
          } else {
            dispatch(clearLearnSession())
          }
        })
        addListener('my_livelearn_session', listener);
      }
    } catch (e) {
      console.log("Get My Live Learn Session Error ", e);
    }
  }
}

export function getMyLiveTeachSession() {
  return async function (dispatch, getState) {
    try {
      if (!hasListener('my_liveteach_session')) {
        let listener = firestore.collection('users').doc(auth.currentUser.uid).collection('teach_session').onSnapshot(sn => {
          if (sn.size > 0) {
            dispatch(clearTeachSession());
            let sessionData = {};
            sn.forEach(doc => {
              let docData = doc.data();
              // let posterId = docData.posterId;
              // let posterDoc = await firestore.collection('users').doc(posterId).get();
              // let studentName = posterDoc.data().userName;
              // docData['studentName'] = studentName;
              // if (docData.sessionDeleted == false)
                sessionData[doc.id] = docData;
            });
            dispatch(getTeachSession(sessionData));
          } else {
            dispatch(clearTeachSession());
          }
          
        });
        addListener('my_liveteach_session', listener);
      }
    } catch (e) {
      console.log("Get My Live Teach Session Error ", e);
    }
  }
}

export function clearMyLTSession() {
  return async function (dispatch, getState) {
    try {
      offListenerWithPrefix('my_livelearn_session');
      offListenerWithPrefix('my_liveteach_session');
      dispatch(clearLTSession());
    } catch (e) {
      console.log("Clear LTSession Error ", e);
    }
  }
}