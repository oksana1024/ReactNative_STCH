import {auth, firestore} from '../constants/firebase';
import navigationService from '../navigation/navigationService';
import pages from '../constants/pages';
import store from '../model/store';
// import {fetchUser, logoutUser} from '../model/actions/userAC';
// import {fetchProblem, fetchMoreProblems, clearProblems} from '../model/actions/problemAC';
import {fetchInitChats, fetchMoreChats, clearChats, fetchChatUsers, loadEarlierChats, setEarliearLoadable} from '../model/actions/chatAC';
import {clearListeners, clearUserListener, hasListener, addListener, offListenerWithPrefix} from './listeners';
import _ from 'lodash';

let BlockIndex = 0;
let lastProblem = '';

export function getChatUsers(subject, problemId) {
  return async function (dispatch, getState) {
    
    try {
      if (!hasListener('chat_users_'+ subject + '_' + problemId)) {
        
        let channelListener = firestore.collection(subject).doc(problemId).onSnapshot(sn => {
          let problemData = sn.data();
          console.log("GET CHAT USERS ======", subject);
          firestore.collection('users').doc(problemData.posterId).get().then(sn => {
            let postUserData = {};
            postUserData[sn.id] = sn.data();
            dispatch(fetchChatUsers(postUserData));
          });
            
          if (problemData.teacherId != undefined && problemData.teacherId != null) {
            firestore.collection('users').doc(problemData.teacherId).get().then(sn => {
              let teacherData = {};
              teacherData[sn.id] = sn.data();
              dispatch(fetchChatUsers(teacherData));
            });
          }
        })
        addListener('chat_users_'+ subject + '_' + problemId, channelListener);
      }
    } catch(e) {
      console.log("Fetch Chat Channel User Info Error = ", e);
    }
  }
}

export function getInitChats(subject, problemId) {
  return async function (dispatch, getState) {
    
    try {
      let newLastProblem = null;
      let currentState = getState();
      let chatObject = _.get(currentState, 'chat', {});
      
      firestore.collection(subject).doc(problemId).collection('messages')
      .orderBy('timestamp', 'DESC').limit(10).get().then(sn => {
        
        newLastProblem = sn.docs[sn.docs.length - 1];
        if (sn.docs.length == 10) {
          dispatch(setEarliearLoadable(true));
        } else {
          dispatch(setEarliearLoadable(false));
        }
        
        if (newLastProblem !== undefined && sn.docs.length > 0 && !hasListener('chats_' + subject + '_' + problemId + '_' + newLastProblem.id)) {
          
          lastProblem = newLastProblem;
          var listener = firestore.collection(subject).doc(problemId).collection('messages')
          .orderBy('timestamp', 'DESC')
          .endAt(newLastProblem)
          .onSnapshot((snapShot) => {
            console.log("GET CHAT getInitChats ======", newLastProblem.id);
            if (!snapShot.empty) {
              let chatsData = {};
              snapShot.forEach((doc) => {
                // dispatch(fetchProblem(subject, doc.data()));
                let chatData = doc.data();
                chatsData[doc.id] = {
                  _id: chatData._id,
                  text: chatData.text,
                  image: chatData.image != undefined ? chatData.image : '',
                  createdAt: new Date(chatData.timestamp),
                  sentBy: chatData.sentBy,
                  timestamp: chatData.timestamp
                };
              })
              dispatch(fetchInitChats(chatsData, subject, problemId, newLastProblem, newLastProblem.id));
            }
          });
          addListener('chats_' + subject + '_' + problemId + '_' + newLastProblem.id, listener);
        }
      });
      
    } catch (e) {
      console.log("Fetch Initital Chat Error = ", e);
    }
  }
}

export function getMoreChats(subject, problemId) {
  return async function(dispatch, getState) {
    try {
      let newLastProblem = null;
      let currentState = getState();
      let chatObject = _.get(currentState, 'chat', {});
      // let prevLastProblem = _.get(chatObject, 'lastProblem', null);
      let earlierLodable = _.get(chatObject, 'earlierLodable', true);
      if (earlierLodable == false) {
        return;
      }
      // let currentBlockIndex = BlockIndex + 1;
      firestore.collection(subject).doc(problemId).collection('messages')
      .orderBy('timestamp', 'DESC').startAfter(lastProblem).limit(20).get().then(sn => {
        newLastProblem = sn.docs[sn.docs.length - 1];
        if (sn.docs.length == 20) {
          dispatch(setEarliearLoadable(true));
        } else {
          dispatch(setEarliearLoadable(false));
        }
        dispatch(loadEarlierChats(true));
        if (sn.docs.length > 0 && !hasListener('chats_' + subject + '_' + problemId + '_' + newLastProblem.id)) {
          
          // BlockIndex = currentBlockIndex;
          
          var listener = firestore.collection(subject).doc(problemId).collection('messages')
          .orderBy('timestamp', 'DESC')
          .startAfter(lastProblem).endAt(newLastProblem)
          .onSnapshot((snapShot) => {
            
            if (!snapShot.empty) {
              let chatsData = {};
              snapShot.forEach((doc) => {
                // dispatch(fetchProblem(subject, doc.data()));
                let chatData = doc.data();
                chatsData[doc.id] = {
                  _id: chatData._id,
                  text: chatData.text,
                  image: chatData.image != undefined ? chatData.image : '',
                  createdAt: new Date(chatData.timestamp),
                  sentBy: chatData.sentBy,
                  timestamp: chatData.timestamp
                };
              })
              dispatch(fetchMoreChats(chatsData, subject, problemId, newLastProblem, newLastProblem.id));
              dispatch(loadEarlierChats(false));
              lastProblem = newLastProblem
            }
          })
          addListener('chats_' + subject + '_' + problemId + '_' + newLastProblem.id, listener);
          dispatch(loadEarlierChats(false));
        } else {
          dispatch(loadEarlierChats(false));
        }
      })
    } catch(e) {
      console.log("Fetch More Chats Error = ", e);
    }
  }
}

export function sendMessage (subject, problemId, message, shouldGetInitChats, toUser) {
  // console.log("Subject =====", subject);
  return async function(dispatch, getState) {
    try {
      await firestore.collection(subject).doc(problemId).collection('messages').doc(message._id).set({
        _id: message._id,
        text: message.text != undefined ? message.text : '',
        image: message.image != undefined ? message.image : '',
        sentBy: auth.currentUser.uid,
        deliverTo: toUser,
        // createdAt: message.createdAt,
        timestamp: Date.now()
      }).finally(() => {
        if (shouldGetInitChats == true) {
          dispatch(getChatUsers(subject, problemId));
          dispatch(getInitChats(subject, problemId));
        }
      })
    } catch (e) {
      console.log("Send message Error ==== ", e);
    }
  }
}

export function updateReadStatus(subject, problemId) {
  return async function(dispatch, getState) {
    try {
      firestore.collection(subject).doc(problemId).collection('readBy').doc(auth.currentUser.uid).get().then((doc) => {
        if (doc.exists){
          firestore.collection(subject).doc(problemId).collection('readBy').doc(auth.currentUser.uid).update({
            timestamp: (new Date()).getTime()
          })
        } else {
          firestore.collection(subject).doc(problemId).collection('readBy').doc(auth.currentUser.uid).set({
            timestamp: (new Date()).getTime()
          })
        }
      })
    } catch (e) {
      console.log("Update Message Read Status Error = ", e);
    }
  }
}

export function clearChatsData(subject, problemId) {
  return async function (dispatch, getState) {
    try {
      // BlockIndex = 0;
      lastProblem = '';
      offListenerWithPrefix('chats_');
      dispatch(clearChats());
    } catch (e) {
      console.log("Fetch Initital Problem Error = ", e);
    }
  }
}