import {auth, firestore} from '../constants/firebase';
import navigationService from '../navigation/navigationService';
import pages from '../constants/pages';
import store from '../model/store';
import {clearListeners, clearUserListener, hasListener, addListener} from './listeners';
import {fetchUserBank, clearUserBank} from '../model/actions/bankAC';

export function getUserBank() {
  return async function (dispatch, getState) {
    try {
      if (!hasListener('user_bank')) {
        let listener = firestore.collection('users').doc(auth.currentUser.uid).collection('express_account').doc('real_account').onSnapshot(doc => {
          if (doc.exists) {
            dispatch(clearUserBank());
            dispatch(fetchUserBank(doc.data()));
          }            
        })
        addListener('user_bank', listener);
      }
    } catch (e) {
      console.log('Get Express Account', e);
    }
  }
}