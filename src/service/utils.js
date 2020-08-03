import {Platform, Dimensions} from 'react-native';
import _ from 'lodash';

export const isIOS = Platform.OS === 'ios';
export const modelIOS = Platform.Version;

const VIEWPORT = Dimensions.get('window');
export const isIphoneX = (
  isIOS &&
  // (_.toLower(_.get(Constants, ['platform', 'ios', 'model'])).startsWith('iphone x') ||
  ((VIEWPORT.height === 812 || VIEWPORT.width === 812) || // iphone x iphone xs
  (VIEWPORT.height === 896 || VIEWPORT.width === 896)) // iphone xs max iphone xr
)

export function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

export function validateExp(exp) {
  let arrayString = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '/'];
  let same = false; let other = false; let separator = false;
  for (let i = 0; i < exp.length; i++) {
    same = false;
    for (let j = 0; j < arrayString.length; j++) {
      if (exp[i] == '/') {
        separator = true;
      }

      if (exp[i] == arrayString[j]) {
        same = true
        break;
      }
    }
    if (same == true) {
      continue;
    }

    if (same == false) {
      other = true;
      break;
    }
  }

  if (other == true) {
    return false
  }
  
  let dateArray = exp.split('/');

  if (parseInt(dateArray[0]) < 1 || parseInt(dateArray[0]) > 12) {
    return false;
  }

  if (separator == false) {
    return false;
  } else {
    if (dateArray[1].length != 4) {
      return false;
    }
  }

  return true;
}

export const validateCardNum = (number) => {
  return /^(?=.*\d)[\d ]+$/.test(number);
}

export const validatePhoneNumber = (number) => {
  var phoneno = /^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/;
  if(number.match(phoneno)) {
    return true;
  }  
  else {  
    // alert("message");
    return false;
  }
}

export const calcDiffTS = (past, current) => {
  var difference = current - past;

  var daysDifference = Math.floor(difference/1000/60/60/24);
  difference -= daysDifference*1000*60*60*24

  var hoursDifference = Math.floor(difference/1000/60/60);
  difference -= hoursDifference*1000*60*60

  var minutesDifference = Math.floor(difference/1000/60);
  difference -= minutesDifference*1000*60

  var secondsDifference = Math.floor(difference/1000);

  var weekDifference = Math.floor(daysDifference / 7);
  var monthDifference = Math.floor(daysDifference / 30);

  if (monthDifference > 0) return monthDifference + 'm';
  if (weekDifference > 0) return weekDifference + 'w';
  if (daysDifference > 0) return daysDifference + 'd';
  return '1d';
}

export const getAMPM = (timeObject) => {
    let hours = timeObject.getHours();
    hours = (hours+24)%24; 
    let mid='am';
    let min = timeObject.getMinutes();
    if(hours==0){ //At 00 hours we need to show 12 am
      hours=12;
    }
    else if(hours>12)
    {
      hours=hours%12;
      mid='pm';
    }

    if (hours < 10) {
      hours = '0' + hours;
    }

    if (min < 10) {
      min = '0' + min;
    }

    return (hours + ':' + min + mid);
}