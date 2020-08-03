import React, {Component} from 'react';
import {
    StyleSheet,
    Image,
    View,
    ActivityIndicator,
    Alert,
    TouchableOpacity,
    Text
} from 'react-native';
import Page from '../components/basePage';
import {getWidth, getHeight} from '../constants/dynamicSize';
import BaseButton from '../components/baseButton';
import AuthInput from '../components/authInput';
import navigationService from '../navigation/navigationService';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import pages from '../constants/pages';
import Bank from '../components/icons/bank';
import {validateExp, validateCardNum} from '../service/utils';
// import {getStripeToken} from '../service/stripe';
import {signupStripeInfo, signupUserInfo} from '../model/actions/signupAC';
import {connect} from 'react-redux';
import { BLACK_PRIMARY } from '../constants/colors';
import {auth} from '../constants/firebase';
import {withMappedNavigationParams} from 'react-navigation-props-mapper';

const LOGO_IMAGE = require('../assets/images/logo.png');
const BACK_BUTTON = require('../assets/images/back-button.png');
const FORWARD_BUTTON = require('../assets/images/forward-button.png');

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
    if (this.state.routeName == '') {
      this.setState({emptyRoute: true});
      return;
    }
    if (this.state.accountNumber == '') {
      this.setState({emptyAccountNumber: true});
      return;
    }
    
    if (this.state.secondAccount == '') {
      this.setState({emptySecond: true});
      return;
    }

    const {dispatch, signupInfo} = this.props;
    this.setState({loading: true});
    dispatch(signupUserInfo({
      routeNumber: this.state.routeName,
      accountNumber: this.state.accountNumber,
      secondAccount: this.state.secondAccount
    }));
    auth.createUserWithEmailAndPassword(signupInfo.email, signupInfo.password).then((result) => {
      console.log("Signup Result = ", result);
      firestore.collection('users').doc(result.user.uid).set({
        country: signupInfo.country,
        email: signupInfo.email,
        userName: signupInfo.userName,
        stripeToken: signupInfo.stripeToken,
        routeNumber: this.state.routeName,
        accountNumber: this.state.accountNumber,
        secondAccount: this.state.secondAccount,
        bankSkipped: false,
        lastLogin: Date.now()
      })
    }).finally(() => {
      this.setState({loading: false});
    })
  }

  goBack = () => {
    if (this.props.prevScreen == 'transfer')
      navigationService.navigate(pages.TRANSFER);
    else 
      navigationService.navigate(pages.BANKS);
  }

  goSKIP = () => {
    
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

  _onREMOVE = () => {

  }

  render () {
    return (
        <Page backgroundColor={BLACK_PRIMARY} forceInset={{top: 'never'}}>
          {
            this.state.loading == true ? 
            <View style={styles.wrapper}>
              <ActivityIndicator size={'large'} />
            </View>
            :
            <View style={{flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center'}}>
            <KeyboardAwareScrollView style={styles.container} contentContainerStyle={styles.wrapper}>
                <TouchableOpacity style={styles.backBtnView} onPress={this.goBack}>
                    <Image style={styles.backBtnImage} resizeMode={'contain'} source={BACK_BUTTON}/>
                </TouchableOpacity>
                <Text style={styles.pageName}>Bank</Text>
                <View style={{width: '100%', paddingLeft: getWidth(34), marginBottom: getHeight(56)}}>
                  <Bank size={getWidth(48)} color={'#FFFFFF'} />
                </View>

                <AuthInput 
                    desc={'Routing Number'}
                    wrapperStyle={{marginBottom: getHeight(27)}}
                    descStyle={{marginBottom: getHeight(25)}}
                    onChangeText={this._changeRoute}
                    errorExist={this.state.emptyRoute}
                    errorText={'Required!'}
                />

                <AuthInput 
                    desc={'Account Number'}
                    wrapperStyle={{marginBottom: getHeight(27)}}
                    descStyle={{marginBottom: getHeight(25)}}
                    onChangeText={this._changeAccountNumber}
                    errorExist={this.state.emptyAccountNumber || this.state.invalidAccountNum}
                    errorText={this.state.invalidAccountNum == true ? 'Invalid Card Number' : 'Required!'}
                    keyboardType={'numeric'}
                />
                
                <AuthInput 
                    desc={'Account Number'}
                    wrapperStyle={{marginBottom: getHeight(27)}}
                    descStyle={{marginBottom: getHeight(25)}}
                    onChangeText={this._changeSecond}
                    errorExist={this.state.emptySecond}
                    errorText={'Required!'}
                    keyboardType={'numeric'}
                />
                
                
            </KeyboardAwareScrollView>
            <View style={styles.bottomBtnView}>
                  <BaseButton 
                    text={'ADD'}
                    onClick={this._onREMOVE}
                  />
                </View>
            </View>
          }
        </Page>
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
    },
    wrapper: {
      flex: 1,
      width: '100%',
      height: '100%'
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
      marginBottom: getHeight(20)
    }
})

const mapStateToProps = (state) => ({
  signupInfo: state.signupInfo
});

export default connect(mapStateToProps)(BankSetup)