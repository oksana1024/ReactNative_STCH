import React, {Component} from 'react';
import {
    StyleSheet,
    Image,
    View,
    ActivityIndicator,
    Alert,
    TouchableOpacity,
    Text,
    Linking
} from 'react-native';
import Page from '../../components/basePage';
import NavPage from '../../components/navPage';
import {getWidth, getHeight} from '../../constants/dynamicSize';
import BaseButton from '../../components/baseButton';
import BaseInput from '../../components/baseInput';
import NavButton from '../../components/navButton';
import AuthInput from '../../components/authInput';
import navigationService from '../../navigation/navigationService';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import pages from '../../constants/pages';
import Bank from '../../components/icons/bank';
import {validateExp, validateCardNum} from '../../service/utils';
// import {getStripeToken} from '../../service/stripe';
import store from '../../model/store';
import _ from 'lodash';
import {fetchUser} from '../../model/actions/userAC';
import {connect} from 'react-redux';
import { BLACK_PRIMARY, PURPLE_MAIN } from '../../constants/colors';
import {auth, firestore} from '../../constants/firebase';
import { withMappedNavigationParams } from 'react-navigation-props-mapper';

const ICON_LOGO = require('../../assets/images/icon-logo.png');
const BACK_BUTTON = require('../../assets/images/back-button.png');
const FORWARD_BUTTON = require('../../assets/images/forward-button.png');

@withMappedNavigationParams()
class BankSetup extends Component {

  constructor(props) {
    super(props);

    this.state = {
      routeName: '',
      emptyRoute: false,
      accountNumber: '',
      emptyAccountNumber: false,
      cardExp: '',
      emptyExp: false,
      secondAccount: '',
      emptySecond: false,
      invalidExp: false,
      invalidAccountNum: false,
      loading: false
    }
  }
    
  goForward = () => {
    const {email, password} = this.props;
    this.setState({loading: true});
    // dispatch(signupUserInfo({
    //   routeNumber: this.state.routeName,
    //   accountNumber: this.state.accountNumber,
    //   secondAccount: this.state.secondAccount,
    //   bankSkipped: false
    // }));
    auth.createUserWithEmailAndPassword(email, password).then((result) => {
      let currentState = store.getState();
      let signupInfo = _.get(currentState, 'signupInfo', {});
      store.dispatch(fetchUser(signupInfo));
      
      // dispatch(getExpress({desc: 'Express Account Will be Created'}));
      //Test mode ca_GnclzGHybAEFl9aSwOI96R3jkPDIIIlM
      //Live mode ca_GncllTyA3AAQIxk0jJd7RZsYaKCB1Jpi
      let url = `https://connect.stripe.com/express/oauth/authorize?redirect_uri=https://socrateach-65b77.firebaseapp.com&client_id=ca_GncllTyA3AAQIxk0jJd7RZsYaKCB1Jpi&state=${result.user.uid}`;
      Linking.canOpenURL(url)
      .then((supported) => {
        if (!supported) {
          console.log("Can't handle url: " + url);
        } else {
          return Linking.openURL(url);
        }
      })
      .catch((err) => console.error('An error occurred', err));
    }).catch(error => {
      console.log("Create Firebase User Error = ", error);
      Alert.alert(
        'User email is exist',
        'You entered same email with other user, please input other email!',
        [
          {
            text: 'OK',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel'
          }
        ],
        {cancelable: false}
      )
      return;
    })
    .finally(() => {
      this.setState({loading: false});
    })
  }

  _goBack = () => {
    navigationService.pop();
  }

  goSKIP = () => {
    const {email, password} = this.props;
    this.setState({loading: true});
    // dispatch(signupUserInfo({
    //   bankSkipped: true
    // }));

    auth.createUserWithEmailAndPassword(email, password).then((result) => {
      console.log("Signup Result = ", result);
      let currentState = store.getState();
      let signupInfo = _.get(currentState, 'signupInfo', {});
      store.dispatch(fetchUser(signupInfo));
      
    }).catch(error => {
      console.log("Create Firebase User Error = ", error);
      Alert.alert(
        'User email is exist',
        'You entered same email with other user, please input other email!',
        [
          {
            text: 'OK',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel'
          }
        ],
        {cancelable: false}
      )
      return;
    })
    .finally(() => {
      this.setState({loading: false});
    })
  }

  _changeRoute = (name) => {
    this.setState({routeName: name});
    if (name != '') {
      this.setState({emptyRoute: false});
    }
  }

  _changeAccountNumber = (number) => {
    this.setState({accountNumber: number});
    this.setState({invalidAccountNum: !validateCardNum(number)});
    if (number != '') {
      this.setState({emptyAccountNumber: false});
    }
  }

  _changeCardExp = (exp) => {
    this.setState({cardExp: exp});
    if (exp != '') {
      this.setState({emptyExp: false});
    }

    let invalidExp = validateExp(exp);
    if(invalidExp == false) {
      this.setState({invalidExp: true});
    } else {
      this.setState({invalidExp: false});
    }
  }

  _changeSecond = (security) => {
    this.setState({secondAccount: security});
    if (security != '') {
      this.setState({emptySecond: false});
    }
  }

  render () {
    return (
        <NavPage titleText={'Sign up'} onLeftClick={this._goBack}>
          {
            this.state.loading == true ? 
            <View style={styles.wrapper}>
              <ActivityIndicator size={'large'} />
            </View>
            :
            <View style={styles.container}>
                {/* <TouchableOpacity style={styles.backBtnView} onPress={this.goBack}>
                    <Image style={styles.backBtnImage} resizeMode={'contain'} source={BACK_BUTTON}/>
                </TouchableOpacity>
                <View style={{flex: 1, width: '100%'}}>

                
                <Image style={{width: getWidth(155), height: getHeight(82), alignSelf: 'center'}} resizeMode={'contain'} source={ICON_LOGO}/>
                  <View style={styles.modal}>
                    <View style={{flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center', paddingBottom: getHeight(40)}}>
                      <Bank size={getHeight(48)} color={BLACK_PRIMARY} />
                      <Text style={styles.bodyText}>Add bank account</Text>
                      <Text style={styles.secondText}>through Stripe</Text>
                    </View>
                    <TouchableOpacity style={styles.btnBody}
                    onPress={this.goForward}
                    >
                      
                      
                      <Text style={styles.btnText}>
                        Add Bank
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View> */}

                <View style={{flex: 1}}>
                  <Text style={styles.titleText}>
                      Add bank for teaching
                  </Text>
                  <Text style={styles.subTitle}>
                      Stripe Connect portal
                  </Text>
                  <TouchableOpacity style={styles.portalView}
                    onPress={this.goForward}
                  >
                    <Bank size={getHeight(24)} color={PURPLE_MAIN} />
                    <Text style={styles.portalText}>
                      Link to Stripe via the Web
                    </Text>
                  </TouchableOpacity>
                  <View style={styles.descView}>
                    <Text style={styles.descText}>
                      If you plan to only use the Learn feature, you can skip this section. You can add a bank account via Stripe at any time. In the Stripe sign up process, please use socrateach.com as your business website.
                    </Text>
                  </View>
                </View>
                <BaseButton 
                  text={'SKIP'}
                  onClick={this.goSKIP}
                  buttonStyle={{marginBottom: getHeight(18), backgroundColor: PURPLE_MAIN, alignSelf: 'center'}}
                  textStyle={{color: '#FFFFFF'}}
                />
              </View>
          }
        </NavPage>
    )
  }
}

BankSetup.navigatorStyle = {
    navBarHidden: false,
    statusBarBlur: false
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    wrapper: {
      flex: 1,
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center'
    },
    logoImage: {
        width: getWidth(291),
        height: getHeight(151),
        marginBottom: getHeight(19),
    },
    backBtnView: {
      marginTop: getHeight(48),
      marginLeft: getWidth(32),
      marginBottom: getHeight(24)
    },
    backBtnImage: {
        width: getHeight(48),
        height: getHeight(48)
    },
    forwardBtnView: {
        width: '100%', 
        alignItems: 'flex-end',
        marginBottom: getHeight(27)
    },
    forwardBtn: {
        marginRight: getWidth(32),
    },
    pageName: {
      fontFamily: 'Montserrat-Medium',
      fontSize: getHeight(25), 
      marginBottom: getHeight(22),
      color: '#FFFFFF',
      marginLeft: getWidth(34)
    },
    bottomBtnView: {
      width: '100%', 
      alignItems: 'center',
      marginBottom: getHeight(18)
    },
    titleText: {
      fontFamily: 'Montserrat-Medium',
      fontSize: getHeight(24),
      marginTop: getHeight(32),
      marginLeft: getWidth(32),
      marginBottom: getHeight(25),
      color: BLACK_PRIMARY
    },
    subTitle: {
      fontFamily: 'Montserrat-Medium',
      fontSize: getHeight(16),
      marginLeft: getWidth(32),
      marginBottom: getHeight(26),
      color: BLACK_PRIMARY
    },
    portalView: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      marginBottom: getHeight(26)
    },
    portalText: {
      fontFamily: 'Montserrat-Regular',
      fontSize: getHeight(20),
      color: PURPLE_MAIN,
      marginLeft: getWidth(7)
    },
    descView: {
      width: getWidth(320),
      alignSelf: 'center'
    },
    descText: {
      fontFamily: 'Montserrat-Regular',
      fontSize: getHeight(14),
    },
    btnText: {
      fontFamily: 'Montserrat-Medium',
      color: '#FFFFFF',
      fontSize: getHeight(18)
    },
    bodyText: {
      fontFamily: 'Montserrat-Medium',
      fontSize: getHeight(18),
      color: BLACK_PRIMARY,
      marginTop: getHeight(29)
    },
    secondText: {
      fontFamily: 'Montserrat-Medium',
      fontSize: getHeight(18),
      color: BLACK_PRIMARY,
    },
    bodySecText: {
      fontFamily: 'Montserrat-Medium',
      fontSize: getHeight(15),
      color: BLACK_PRIMARY
    },
    bodyThirdText: {
      fontFamily: 'Montserrat-Medium',
      fontSize: getHeight(18),
      color: BLACK_PRIMARY
    },
    btnBody: {
      width: getWidth(220), 
      height: getHeight(36), 
      borderRadius: getHeight(10), 
      backgroundColor: PURPLE_MAIN, 
      justifyContent: 'center',
      alignItems: 'center', 
      flexDirection: 'row',
      paddingLeft: getWidth(13),
      paddingRight: getWidth(25),
      marginBottom: getHeight(23)
    }
})

const mapStateToProps = (state) => ({
  signupInfo: state.signupInfo
});

export default connect(mapStateToProps)(BankSetup)