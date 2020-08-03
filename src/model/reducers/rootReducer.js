import {combineReducers} from 'redux';
import user from './user';
import signupInfo from './singup';
import subject from './subject';
import problem from './problem';
import myTeach from './myTeach';
import myLearn from './myLearn';
import chat from './chat';
import session from './session';
import myLiveLearn from './myLiveLearn';
import login from './login';
import ltSession from './ltSession';
import payment from './payment';
import bank from './bank';
import pHistory from './pHistory';
import branch from './branch';

export default combineReducers({
  user,
  signupInfo,
  subject,
  problem,
  myTeach,
  myLearn,
  chat,
  session,
  myLiveLearn,
  login,
  ltSession,
  payment,
  bank,
  pHistory,
  branch
})