import {auth, firestore} from '../constants/firebase';
import navigationService from '../navigation/navigationService';
import pages from '../constants/pages';
import store from '../model/store';
import {clearListeners, clearUserListener, hasListener, addListener} from './listeners';
import {getPaymentMethods, clearPaymentMethods, getPaymentHistory, clearPaymentHistory} from '../model/actions/paymentAC';

export function getUserPayments() {
  return async function (dispatch, getState) {
    try {
      if (!hasListener('user_payments')) {
        let listener = firestore.collection('users').doc(auth.currentUser.uid).collection('stripe_paymentMethods').onSnapshot(sn => {
          if (sn.size > 0) {
            dispatch(clearPaymentMethods());
            let payments = {}
            sn.forEach(doc => {
              let paymentData = doc.data();
              paymentData['cardId'] = doc.id;
              payments[doc.id] = paymentData;
            });
            dispatch(getPaymentMethods(payments));
          } else {
            dispatch(clearPaymentMethods());
          }
        })
        addListener('user_payments', listener);
      }
    } catch (e) {
      console.log('Get Express Account', e);
    }
  }
}

export function getUserPaymentHistory() {
  return async function (dispatch, getState) {
    try {
      if (!hasListener('user_payment_history')) {
        let listener = firestore.collection('users').doc(auth.currentUser.uid).collection('payment_history').onSnapshot(sn => {
          if (sn.size > 0) {
            dispatch(clearPaymentHistory());
            let history = {};
            sn.forEach(doc => {
              let historyData = doc.data();
              historyData['historyId'] = doc.id;
              history[doc.id] = historyData;
            })
            dispatch(getPaymentHistory(history));
          } else {
            dispatch(clearPaymentHistory());
          }
        })
        addListener('user_payment_history', listener)
      }
    } catch (error) {
      console.log("Get Payment History Error !", error);
    }
  }
}