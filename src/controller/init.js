import {auth, firestore, message, notifications} from '../constants/firebase';
import navigationService from '../navigation/navigationService';
import pages from '../constants/pages';
import store from '../model/store';
import {fetchUser, logoutUser} from '../model/actions/userAC';
import {fetchSubjects} from '../model/actions/subjectAC';
import {clearExpress, clearBalance} from '../model/actions/bankAC';
import {changeAppBranch} from '../model/actions/branchAC';
import {clearListeners, clearUserListener, hasListener, addListener} from './listeners';
import {clearMyLTSession} from './ltsession';
import {getMyInitTeachList} from './teach';
import {getMyInitLearnList} from './learn';
import AsyncStorage from '@react-native-community/async-storage';
import {fetchBalance} from './user';
import _ from 'lodash';

let firstAuth = true;

async function getSubjectInfo() {
  try {
    if (!hasListener('subjects')) {
      let subListener = firestore.collection('subjects').onSnapshot((sn) => {
        let subjects = [];
        sn.forEach((doc) => {
          subjects.push(doc.data());
        })
        store.dispatch(fetchSubjects(subjects));
      })
      addListener('subjects', subListener);
    }
  } catch (e) {
    console.log("Getting Subject List Error ", e);
  }
}

async function setFCMToken(authData) {
  try {
    const enabled = await message.hasPermission();
    if (!enabled) {
      await message.requestPermission();
    } 
    message.getToken().then((value) => {
      console.log("FCM Token === ", value);
      firestore.collection('users').doc(authData.uid).update({
        fcmToken: value
      })
    })
  } catch (e) {
    console.log("Get FCM Token Error = ", e);
  }
}

async function getUserInfo (authData) {
  // try {
    console.log('fetchUser', authData.uid)
    const userId = authData.uid
    // const enabled = await message.hasPermission();
    //   if (!enabled) {
    //     await message.requestPermission();
    //   } 
    // const recheck = await message.hasPermission();
    // let fcmToken = ""
    // if (recheck) {
    //   let fcmToken = await message.getToken();
    // }
    // console.log("FCM Token === ", fcmToken);
    firestore.collection('users').doc(userId).get().then(doc => {
      console.log("Fetch User Result = ", doc.data());
      if (doc.exists) {
        store.dispatch(fetchUser(doc.data()));
        // firestore.collection('users').doc(userId).update({
        //   fcmToken: fcmToken
        // })
        if (!hasListener(userId + 'my_user_info')) {
          let listener = firestore.collection('users').doc(userId).onSnapshot(sn => {
            let userData = sn.data();
            store.dispatch(fetchUser(userData));
            store.dispatch(fetchBalance());
          });
          addListener(userId + 'my_user_info',  listener);
        }
        navigationService.navigate(pages.APP)
      } else { //Signup
        let currentState = store.getState();
        let signupInfo = _.get(currentState, 'signupInfo', {});
        // store.dispatch(fetchUser(signupInfo));
        console.log("Signup Info =", signupInfo);
        store.dispatch(changeAppBranch('learn'));
        if (signupInfo.email != "" && signupInfo.userName != "" && signupInfo.phoneNumber != undefined) {
          firestore.collection('users').doc(userId).set({
            phoneNumber: signupInfo.phoneNumber != undefined ? signupInfo.phoneNumber : '',
            email: signupInfo.email != undefined ? signupInfo.email : '',
            userName: signupInfo.firstName != undefined ? signupInfo.firstName + ' ' + signupInfo.lastName : '',
            firstName: signupInfo.firstName != undefined ? signupInfo.firstName : '',
            lastName: signupInfo.lastName != undefined ? signupInfo.lastName: '',
            // routeNumber: signupInfo.routeNumber != undefined ? signupInfo.routeNumber : null,
            // accountNumber: signupInfo.accountNumber != undefined ? signupInfo.accountNumber : null,
            // secondAccount: signupInfo.secondAccount != undefined ? signupInfo.secondAccount : null,
            // bankSkipped: signupInfo.bankSkipped != undefined ? signupInfo.bankSkipped : true,
            // card: signupInfo.card != undefined ? signupInfo.card : {},
            offerSend: signupInfo.offerSend != undefined ? signupInfo.offerSend : false,
            skipPayment: signupInfo.skipPayment != undefined ? signupInfo.skipPayment : true,
            userId: userId,
            lastLogin: Date.now(),
            // fcmToken: fcmToken,
            badge: 0,
            sessionNum: 0,
            rating: 0,
            currentChatSee: false,
            currentChatSubject: '',
            currentChatProblem: ''
          }).then((value) => {
            navigationService.navigate(pages.APP)
          });
        } else {
          clearListeners();
          clearUserListener();
          store.dispatch(logoutUser());
          store.dispatch(clearBalance());
          store.dispatch(clearExpress());
          store.dispatch(clearMyLTSession());
          navigationService.navigate(pages.AUTH);
        }
      }
    }).catch(error => {
      console.log("Get User Doc Error !!!! = ", error);
      clearListeners();
      clearUserListener();
      store.dispatch(logoutUser());
      store.dispatch(clearBalance());
      store.dispatch(clearExpress());
      store.dispatch(clearMyLTSession());
      navigationService.navigate(pages.AUTH);
    });
    
  // } catch (e) {
  //   console.log('fetch user error', e)
  // }
}

async function onAuthStateChanged (authData) {
  console.log('authData', authData)
  if (authData) {
    await getSubjectInfo();
    await getUserInfo(authData);
    // setFCMToken(authData);
    
  } else {
    console.log('onAuthStateChanged authData null');
    clearListeners();
    clearUserListener();
    firstAuth = true;
    navigationService.navigate(pages.AUTH);
    store.dispatch(logoutUser());
    store.dispatch(clearBalance());
    store.dispatch(clearExpress());
    store.dispatch(clearMyLTSession());
    // setCompanyName('')
  }
}

export function appInitialized () {
  return async function (dispatch, getState) {
    try {
      console.log('appInitialized');
      auth.onAuthStateChanged(onAuthStateChanged)
    } catch (e) {
      console.log('app initialization error', e);
    }
  }
}