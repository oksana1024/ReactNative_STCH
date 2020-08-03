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
import Card from '../components/icons/card';
import {validateExp, validateCardNum} from '../service/utils';
// import {getStripeToken} from '../service/stripe';
import {signupStripeInfo} from '../model/actions/signupAC';
import {connect} from 'react-redux';
import { BLACK_PRIMARY } from '../constants/colors';
import {withMappedNavigationParams} from 'react-navigation-props-mapper';
import {auth, firestore} from '../constants/firebase';


const BACK_BUTTON = require('../assets/images/back-button.png');
const FORWARD_BUTTON = require('../assets/images/forward-button.png');

@withMappedNavigationParams()
class PaymentSetup extends Component {

  constructor(props) {
    super(props);

    this.state = {
      cardName: '',
      emptyName: false,
      cardNumber: '',
      emptyCardNumber: false,
      cardExp: '',
      emptyExp: false,
      cardSecurity: '',
      emptySecurity: false,
      invalidExp: false,
      invalidCardNum: false,
      loading: false
    }
  }
    
  goForward = () => {
    if (this.state.cardName == '') {
      this.setState({emptyName: true});
      return;
    }
    if (this.state.cardNumber == '') {
      this.setState({emptyCardNumber: true});
      return;
    }
    if (this.state.cardExp == '') {
      this.setState({emptyExp: true});
      return;
    }
    if (this.state.cardSecurity == '') {
      this.setState({emptySecurity: true});
      return;
    }
    if (this.state.invalidExp == true) {
      return;
    }
    if(this.state.invalidCardNum == true) {
      return;
    }
    let expArray = this.state.cardExp.split('/');
    let exp_month = expArray[0];
    let exp_year = expArray[1];

    const {dispatch} = this.props;
    // this.setState({loading: true});
    // getStripeToken(this.state.cardNumber, exp_month, exp_year, this.state.cardSecurity).then((value) => {
    //   console.log("Stripe Response ", value.tokenId);
    //   dispatch(signupStripeInfo(value.tokenId));
    //   navigationService.navigate(pages.BANK);
    // }).catch(() => {
    //   Alert.alert(
    //     'Invalid Card',
    //     'Please use correct Card',
    //     [
    //       {
    //         text: 'OK',
    //         onPress: () => console.log('Cancel Pressed'),
    //         style: 'cancel'
    //       }
    //     ],
    //     {cancelable: false}
    //   )
    // })
    // .finally(() => {
    //   this.setState({loading: false});
    // });

    // navigationService.navigate(pages.SINGUP_FINISH);
  }

  goBack = () => {
    navigationService.navigate(pages.PAYMENTS);
  }

  _changeName = (name) => {
    this.setState({cardName: name});
    if (name != '') {
      this.setState({emptyName: false});
    }
  }

  _changeCardNumber = (number) => {
    this.setState({cardNumber: number});
    this.setState({invalidCardNum: !validateCardNum(number)});
    if (number != '') {
      this.setState({emptyCardNumber: false});
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

  _changeSecurity = (security) => {
    this.setState({cardSecurity: security});
    if (security != '') {
      this.setState({emptySecurity: false});
    }
  }

  _removeCard = () => {
    this.setState({loading: true});
    firestore.collection('users').doc(auth.currentUser.uid).collection('stripe_paymentMethods').doc(this.props.cardId).delete().then(() => {
      this.setState({loading: false})
      firestore.collection('users').doc(auth.currentUser.uid).collection('cards').doc(this.props.cardId).delete().then(() => {
        navigationService.reset(pages.PAYMENTS);
      })
    })
  }

  render () {
    return (
        <Page backgroundColor={BLACK_PRIMARY} forceInset={{top: 'never', bottom: 'never'}}>
          {
            this.state.loading == true ? 
            <View style={styles.loadingWrapper}>
              <ActivityIndicator size={'large'} />
              <Text style={{color: 'white', fontFamily: 'Montserrat-Medium', fontSize: getHeight(14), width: '100%', textAlign: 'center'}}>Card maybe disappear after a few seconds.</Text>
            </View>
            :
            <View style={{flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center'}}>
              <KeyboardAwareScrollView style={styles.container} contentContainerStyle={styles.wrapper}>
                
                <TouchableOpacity style={styles.backBtnView} onPress={this.goBack}>
                    <Image style={styles.backBtnImage} resizeMode={'contain'} source={BACK_BUTTON}/>
                </TouchableOpacity>
                <Text style={styles.pageName}>Credit/Debit</Text>
                <View style={{width: '100%', paddingLeft: getWidth(34), marginBottom: getHeight(56)}}>
                  <Card width={getWidth(40)} height={getHeight(32)} color={'#FFFFFF'} />
                </View>

                <AuthInput 
                    desc={'Name on Card'}
                    wrapperStyle={{marginBottom: getHeight(27)}}
                    descStyle={{marginBottom: getHeight(25)}}
                    defaultValue={this.props.cardInfo.name}
                    onChangeText={this._changeName}
                    errorExist={this.state.emptyName}
                    errorText={'Required!'}
                />

                <AuthInput 
                    desc={'Number'}
                    wrapperStyle={{marginBottom: getHeight(27)}}
                    descStyle={{marginBottom: getHeight(25)}}
                    defaultValue={this.props.cardInfo.number}
                    onChangeText={this._changeCardNumber}
                    errorExist={this.state.emptyCardNumber || this.state.invalidCardNum}
                    errorText={this.state.invalidCardNum == true ? 'Invalid Card Number' : 'Required!'}
                    keyboardType={'default'}
                />
                
                <AuthInput 
                    desc={'Expiration'}
                    wrapperStyle={{marginBottom: getHeight(27)}}
                    descStyle={{marginBottom: getHeight(25)}}
                    onChangeText={this._changeCardExp}
                    errorExist={this.state.emptyExp || this.state.invalidExp}
                    errorText={this.state.invalidExp == true ? 'Invalid Expiration!' : 'Required!'}
                    defaultValue={this.props.cardInfo.exp_month + '/' + this.props.cardInfo.exp_year}
                    keyboardType={'default'}
                />

                <AuthInput 
                    desc={'Security Code'}
                    wrapperStyle={{marginBottom: getHeight(27)}}
                    descStyle={{marginBottom: getHeight(25)}}
                    onChangeText={this._changeSecurity}
                    errorExist={this.state.emptySecurity}
                    defaultValue={this.props.cardInfo.cvc}
                    errorText={'Required!'}
                />
                
              </KeyboardAwareScrollView>
              <BaseButton text={'REMOVE'} onClick={this._removeCard} buttonStyle={{marginBottom: getHeight(20), marginTop: getHeight(20)}}/>
            </View>
            
          }
        </Page>
    )
  }
}

PaymentSetup.navigatorStyle = {
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
    loadingWrapper: {
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
    },
    forwardBtn: {
        marginRight: getWidth(32),
    },
    pageName: {
      fontFamily: 'Montserrat-Bold',
      fontSize: getHeight(25), 
      marginBottom: getHeight(22),
      color: '#FFFFFF',
      marginLeft: getWidth(34)
    }
})

const mapStateToProps = (state) => ({
  signupInfo: state.signupInfo
});

export default connect(mapStateToProps)(PaymentSetup)