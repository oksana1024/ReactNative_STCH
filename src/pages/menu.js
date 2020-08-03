import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ActivityIndicator,
    Image,
    SafeAreaView,
    TouchableOpacity
} from 'react-native';
import {getWidth, getHeight} from '../constants/dynamicSize';
import Person from '../components/icons/person';
import navigationService from '../navigation/navigationService';
import pages from '../constants/pages';
import Home from '../components/icons/home';
import Arrow from '../components/icons/arrow';
import Scard from '../components/icons/scard';
import Bank from '../components/icons/bank';
import Qmark from '../components/icons/qmark';
import Hat from '../components/icons/hat';
import Logout from '../components/icons/logout';
import {PURPLE_MAIN, BLACK_PRIMARY} from '../constants/colors';
import MenuItem  from '../components/baseMenuItem';
import {auth} from '../constants/firebase';
import {connect} from 'react-redux';
import {getUserPayments, getUserPaymentHistory} from '../controller/payment';
import _ from 'lodash';
import Star from '../components/icons/star';
import {getMyLiveLearnSession, getMyLiveTeachSession, clearMyLTSession} from '../controller/ltsession';
import {getExpressAccount, fetchBalance} from '../controller/user';

const MENU_LOGO = require('../assets/images/logo-menu.png')

class MenuContent extends Component {

  constructor(props) {
    super(props)

    this.state = {
      user: {},
      prevBank: {},
      balanceAmount: '$0.00 in ',
      notiExist: false,
      prevNotiExist: false,
      prevLearnSession: {},
      prevTeachSession: {},
      prevUser: {}
    }
  }
    
    loginClick = () => {
      navigationService.navigate(pages.SIGN_IN);
    }

    singupClick = () => {
        navigationService.navigate(pages.SIGN_UP);
    }

    onHomeClick = () => {
      // navigationService.navigate(pages.HOME_SCREEN);
      navigationService.reset(pages.LOADING);
    }

    onSignoutClick = () => {
      navigationService.popToTop();
      auth.signOut();
    }

    onMatchClick = () => {
      if (this.props.branch == 'learn')
        navigationService.navigate(pages.LESESSION_STACK);
      else {
        if(this.props.bank.express == null) {
          navigationService.navigate(pages.BANK_EDIT, {bank: this.props.bank});
        } else {   
          navigationService.navigate(pages.TESESSION_STACK);
        }
      }
    }

    onTeachHistory = () => {
      navigationService.navigate(pages.TEACH_HISTORY);
    }

    onLearnHistory = () => {
      navigationService.navigate(pages.LEARN_HISTORY);
    }

    _onPayments = () => {
      navigationService.navigate(pages.PAYMENTS);
    }

    _onBanks = () => {
      navigationService.navigate(pages.BANK_EDIT, {bank: this.props.bank});
    }

    _onTransactionHistory = () => {
      navigationService.navigate(pages.TRANSACTION_HISTORY);
    }

    

    _onTransfer = () => {
      navigationService.navigate(pages.TRANSFER);
    }

    _onHelp = () => {
      navigationService.navigate(pages.HELP)
    }

    static getDerivedStateFromProps (props, state) {
      let learnSessionData = props.learnSession;
      let teachSessionData = props.teachSession;
      let notiExist = state.notiExist;
      let filteredLearn = {};
      let filteredTeach = {};
      let secondTeach = {};
      let balance = state.balanceAmount;
      if (!_.isNil(learnSessionData) || !_.isNil(teachSessionData)) {
        filteredLearn = _.filter(learnSessionData, ['acceptance', false]);
        filteredTeach = _.filter(teachSessionData, ['acceptance', true]);
        secondTeach = _.filter(filteredTeach, ['confirmed', false]);
      }

      if (props.bank != null) {
        balance = props.bank.balance;
      }

      if (props.user != null) {
        userData = props.user;
      }

      if (!_.isEmpty(filteredLearn) || !_.isEmpty(secondTeach)) {
        notiExist = true;
      } else {
        notiExist = false;
      }

      if (state.prevLearnSession != learnSessionData || state.prevTeachSession != teachSessionData ||
        state.prevBank != props.bank || state.prevUser != props.user || state.prevNotiExist != notiExist) {
          return {
            balanceAmount: balance != null ? '$' + balance.total + ' in ' : '$0.00 in ',
            prevBank: props.bank,
            user: props.user,
            prevUser: props.user,
            notiExist: notiExist,
            prevNotiExist: notiExist,
            prevLearnSession: learnSessionData,
            prevTeachSession: teachSessionData
          }
      } else {
        return null;
      }
          
          
          
        
      // if (state.prevLearnSession == learnSessionData && state.prevTeachSession == teachSessionData)
      //   return null;
      

      // if (props.bank != null && props.bank != state.prevBank && props.user != null) {
      //   let balance = props.bank.balance;
      //   console.log("Props.Balance", props.bank.balance, props.user);
      //   if (balance != null) {
      //     if(!_.isEmpty(filteredLearn) || !_.isEmpty(secondTeach)) {
      //       return {
      //         balanceAmount: '$' + balance.total + ' in',
      //         prevBank: props.bank,
      //         user: props.user,
      //         notiExist: true,
      //         prevLearnSession: learnSessionData,
      //         prevTeachSession: teachSessionData
      //       }
      //     } else {
      //       return {
      //         balanceAmount: '$' + balance.total + ' in',
      //         prevBank: props.bank,
      //         user: props.user,
      //         notiExist: false,
      //         prevLearnSession: learnSessionData,
      //         prevTeachSession: teachSessionData
      //       }
      //     }
      //   } else if (props.user != null) {
      //     if(!_.isEmpty(filteredLearn) || !_.isEmpty(secondTeach)) {
      //       return {
      //         notiExist: true,
      //         prevLearnSession: learnSessionData,
      //         prevTeachSession: teachSessionData,
      //         user: props.user
      //       };
      //     } else {
      //       return {
      //         user: props.user,
      //         notiExist: false,
      //         prevLearnSession: learnSessionData,
      //         prevTeachSession: teachSessionData
      //       }
      //     }
          
      //   }
        
      // } else {
      //   if(!_.isEmpty(filteredLearn) || !_.isEmpty(secondTeach))
      //     return {
      //       notiExist: true,
      //       prevLearnSession: learnSessionData,
      //       prevTeachSession: teachSessionData
      //     }
      //   else
      //     return {
      //       notiExist: false,
      //       prevLearnSession: learnSessionData,
      //       prevTeachSession: teachSessionData
      //     }
      // }

      // return null;
      
    }

    _changeUserInfo = () => {
      const {user} = this.props;
      if (user) {
        navigationService.navigate(pages.CHANGE_USER_INFO, {userData: user});
      }
      
    }

    componentDidMount() {
      console.log("Menu Content Loaded#########");
      const {dispatch} = this.props;
      dispatch(getUserPayments());
      dispatch(getUserPaymentHistory());
      dispatch(clearMyLTSession());
      dispatch(getMyLiveLearnSession());
      dispatch(getMyLiveTeachSession());
    }

    render () {
      // console.log("This.props === ", this.props.user);
      const balance = this.props.bank ? this.props.bank.balance : null;
      
      const displayBalance = balance ? '$' + balance + ' in Socra' : '$0.00 in Socra';
      const {user} = this.props;
      let userRating = user.rating == undefined ? 0 : user.rating;
      let displayRating = userRating.toFixed(2);
      // if (userRating * 100 % 100 == 0 && userRating != 0) {
      //   displayRating = userRating + '.00';
      // }
      console.log("User Rating !!!!, ", user.rating);
        return (
            <View style={styles.container}>
              <SafeAreaView style={styles.safeView}>
                <View style={styles.contentView}>
                  <View style={styles.header}>
                    <TouchableOpacity style={styles.personView} onPress={() => {this._changeUserInfo()}}>
                      <Person size={getHeight(30)} color={BLACK_PRIMARY} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>
                      {
                        this.state.user.userName == undefined ? '' : this.state.user.userName
                      }
                    </Text>
                  </View>
                  <View style={styles.markView}>
                    <Star width={getWidth(18)} height={getHeight(17)} color ={BLACK_PRIMARY}/>
                    <Text style={styles.markTitle}>
                      {
                        displayRating
                      }
                    </Text>
                  </View>
                  
                  <View style={styles.statusPart}>
                    <Text style={styles.statusText}>
                      {this.state.balanceAmount}
                    </Text>
                    <Text style={[styles.statusText, {color: PURPLE_MAIN}]}>
                      Stripe
                    </Text>
                    {/* <Text style={[styles.statusBold, {color: PURPLE_MAIN}]}>
                      Teach
                    </Text> */}
                    {/* <Text style={[styles.statusText, {color: BLACK_PRIMARY}]}>
                      {' balance'}
                    </Text> */}
                  </View>

                  <MenuItem 
                    text={'Home'}
                    icon={<Home size={getHeight(20)} color={'#FFFFFF'} />}
                    onClick={this.onHomeClick}
                  />
                  <MenuItem 
                    text={'Matches'}
                    onClick={this.onMatchClick}
                    notiExist={this.state.notiExist}
                  />
                  {/* <MenuItem 
                    text={'Transfer Balance'}
                    icon={<Arrow size={getHeight(20)} color={'#FFFFFF'} />}
                    onClick={this._onTransfer}
                  /> */}
                  {/* <MenuItem 
                    text={'Teaching History'}
                    icon={<Clock size={getHeight(20)} color={'#FFFFFF'} />}
                    onClick={this.onTeachHistory}
                  />
                  <MenuItem 
                    text={'Learning History'}
                    icon={<Clock size={getHeight(20)} color={'#FFFFFF'} />}
                    onClick={this.onLearnHistory}
                  /> */}
                  {/* <MenuItem 
                    text={'Transaction History'}
                    icon={<Hat width={getHeight(20)} height={getHeight(20)} color={'#FFFFFF'} />}
                    onClick={this._onTransactionHistory}
                  /> */}
                  <MenuItem 
                    text={'Stripe Portal'}
                    icon={<Bank size={getHeight(20)} color={'#FFFFFF'} />}
                    onClick={this._onBanks}
                  />
                  {/* <MenuItem 
                    text={'Payments for Learning'}
                    icon={<Scard size={getHeight(20)} color={'#FFFFFF'} />}
                    onClick={this._onPayments}
                  /> */}
                  <MenuItem 
                    text={'Help'}
                    icon={<Qmark size={getHeight(20)} color={'#FFFFFF'} />}
                    onClick={this._onHelp}
                  />
                  
                  {/* <MenuItem 
                    text={'Free Learning Sessions'}
                    icon={<Image source={LOGO_IMAGE} style={{width: getWidth(38.54), height: getHeight(20)}} resizeMode={'contain'} />}
                    onClick={this.onHomeClick1}
                  />
                  <MenuItem 
                    text={'Claim Free Stylus'}
                    icon={<Pencil size={getHeight(20)} color={'#FFFFFF'} />}
                    onClick={this.onHomeClick1}
                  />
                  <MenuItem 
                    text={'Legal'}
                    icon={<Hammer size={getHeight(20)} color={'#FFFFFF'} />}
                    onClick={this.onHomeClick1}
                  /> */}
                  <MenuItem 
                    text={'Log out'}
                    icon={<Logout size={getHeight(20)} color={'#FFFFFF'} />}
                    onClick={this.onSignoutClick}
                  />
                  <View style={styles.logoView}>
                    
                  </View>
                </View>
                
              </SafeAreaView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF'
    },
    safeView: {
      flex: 1, 
      width: '100%', 
      height: '100%'
    },
    contentView: {
      flex: 1, 
      backgroundColor: '#FFFFFF',
      justifyContent: 'center',
      alignItems: 'center'
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      width: '100%',
      marginTop: getHeight(20)
    },
    personView: {
      width: getWidth(75),
      justifyContent: 'center',
      alignItems: 'center'
    },
    headerTitle: {
      fontFamily: 'Montserrat-Bold',
      fontSize: getHeight(20),
      color: BLACK_PRIMARY
    },
    markView: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
      paddingLeft: getWidth(75),
      marginBottom: getHeight(10)
    },
    markTitle: {
      fontFamily: 'Montserrat-Bold',
      fontSize: getHeight(18),
      color: BLACK_PRIMARY
    },
    statusPart: {
      width: '100%',
      height: getHeight(30),
      backgroundColor: '#FFFFFF',
      paddingLeft: getWidth(18),
      justifyContent: 'flex-start',
      alignItems: 'center',
      marginBottom: getHeight(16),
      flexDirection: 'row',
      flexWrap: 'wrap'
    },
    statusText: {
      fontFamily: 'Montserrat-Medium',
      fontSize: getHeight(21),
      color: BLACK_PRIMARY,
    },
    statusBold: {
      fontFamily: 'Montserrat-Bold',
      fontSize: getHeight(21),
      color: '#FFFFFF',
    },
    logoView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    }
})

const mapStateToProps = (state) => ({
  user: state.user,
  payment: state.payment,
  bank: state.bank,
  learnSession: state.ltSession.learn_session,
  teachSession: state.ltSession.teach_session,
  branch: state.branch.branch
})

export default connect(mapStateToProps)(MenuContent);