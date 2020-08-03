import {auth, firestore} from '../constants/firebase';
import navigationService from '../navigation/navigationService';
import pages from '../constants/pages';
import store from '../model/store';
import {getExpress, clearExpress, getBalance, clearBalance} from '../model/actions/bankAC';
import {fetchSubjects} from '../model/actions/subjectAC';
import {clearListeners, clearUserListener, hasListener, addListener} from './listeners';
import {updatePoster, updateTeacher} from '../model/actions/sessionAC';

export function getPosterInfo(posterId) {
  return async function (dispatch, getState) {
    try {
      firestore.collection('users').doc(posterId).get().then((posterDoc) => {
        let posterData = posterDoc.data();
          dispatch(updatePoster(posterData, posterId));
      })
    } catch (e) {
      console.log('Get Poster Info error', e);
    }
  }
}

export function getTeacherInfo (teacherId) {
  return async function (dispatch, getState) {
    try {
      firestore.collection('users').doc(teacherId).get().then((teacherDoc) => {
        let teacherData = teacherDoc.data();
          dispatch(updateTeacher(teacherData, teacherId));
      })
    } catch (e) {
      console.log('Get Teacher Info error', e);
    }
  }
}

export function fetchBalance() {
  return async function (dispatch, getState) {
    try {
      let xhr = new XMLHttpRequest();
      xhr.open('GET', `https://us-central1-socrateach-65b77.cloudfunctions.net/proto/getAccountBalance/${auth.currentUser.uid}`);
      xhr.send();

      xhr.onload = () => { 
          if (xhr.status == 200) {
              let responseData = JSON.parse(xhr.response);
              if (responseData['result'] == true) {
                dispatch(clearBalance());
                let balanceObject = responseData['balance'];
                let availableArray = balanceObject.available;
                let pendingArray = balanceObject.pending;
                let totalAmount = 0;
                let availableAmount = 0;
                let pendingAmount = 0;
                availableArray.forEach(element => {
                  availableAmount += element.amount;
                });
                pendingArray.forEach(element => {
                  pendingAmount += element.amount;
                });
                totalAmount = availableAmount / 100 + pendingAmount / 100;
                dispatch(getBalance(totalAmount, availableAmount / 100, pendingAmount / 100));
              } else {
                dispatch(clearBalance());
              }
          }
      }
    } catch (error) {
      console.log("Get Balance Error: ", error);
    }
  }
}

export function getExpressAccount() {
  return async function (dispatch, getState) {
    try {
      if (!hasListener('user_express_account')) {
        let listener = firestore.collection('users').doc(auth.currentUser.uid).collection('express_account').doc('express_account_creation_result').onSnapshot(doc => {
            if (doc.exists) {
              dispatch(clearExpress());
              console.log("Fetch Express Account", doc.data());
              dispatch(getExpress(doc.data()));
              if (doc.data().newPayment != undefined && doc.data().newPayment > 0) {
                dispatch(fetchBalance());
              }
            } else {
              dispatch(clearExpress());
            }
        })
        addListener('user_express_account', listener);
      }
    } catch (e) {
      console.log('Get Express Account', e);
    }
  }
}

