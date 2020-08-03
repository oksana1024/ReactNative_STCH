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
import Page from '../components/basePage';
import NavPage from '../components/navPage';
import {getWidth, getHeight} from '../constants/dynamicSize';
import navigationService from '../navigation/navigationService';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import pages from '../constants/pages';
import Bank from '../components/icons/bank';
import {validateExp, validateCardNum} from '../service/utils';
// import {getStripeToken} from '../service/stripe';
import {signupStripeInfo, signupUserInfo} from '../model/actions/signupAC';
import {getExpress} from '../model/actions/userAC';
import {connect} from 'react-redux';
import { BLACK_PRIMARY, PURPLE_MAIN } from '../constants/colors';
import {auth, firestore} from '../constants/firebase';
import { withMappedNavigationParams } from 'react-navigation-props-mapper';

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
    //Test mode ca_GnclzGHybAEFl9aSwOI96R3jkPDIIIlM
    //Live mode ca_GncllTyA3AAQIxk0jJd7RZsYaKCB1Jpi
    let url = `https://connect.stripe.com/express/oauth/authorize?redirect_uri=https://socrateach-65b77.firebaseapp.com&client_id=ca_GncllTyA3AAQIxk0jJd7RZsYaKCB1Jpi&state=${auth.currentUser.uid}`;
    Linking.canOpenURL(url)
    .then((supported) => {
      if (!supported) {
        console.log("Can't handle url: " + url);
      } else {
        Linking.openURL(url);
        navigationService.pop();
      }
    })
    .catch((err) => console.error('An error occurred', err));
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
    const {bank} = this.props;
    let displayBalance = '0.00';
    if (bank.balance != null) {
      displayBalance = bank.balance.total.toFixed(2);
    }
    return (
        <NavPage onLeftClick={this._goBack}>
          {
            this.state.loading == true ? 
            <View style={styles.wrapper}>
              <ActivityIndicator size={'large'} />
            </View>
            :
            <View style={styles.container}>
                <View style={{flex: 1}}>
                  {
                    this.props.bank.balance != null ?
                    <Text style={styles.titleText}>
                      Balance: ${displayBalance}
                    </Text>
                    :
                    <Text style={styles.titleText}>
                      Add bank for teaching
                    </Text>
                  }
                  
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
                  {
                    this.props.bank.express != null ?
                    <Text style={styles.descText}>
                      You are successfully connected to Stripe. Balances will be reflected once Stripe has verified your account (1~2 days). Balances will be paid out nightly. To access your Connect profile, or edit, add, and remove bank accounts, follow the link in your email. Money from new teaching sessions will be reflected in the balance within 5 minutes of the session.
                    </Text>
                    :
                    <Text style={styles.descText}>
                      Bank account/debit card linkage through Stripe will take 2~3 minutes to reflect within SocraTeach
                    </Text>
                  }
                  
                </View>
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
      width: '100%',
      marginBottom: getHeight(26),
      marginLeft: getWidth(38)
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
      color: BLACK_PRIMARY,
      width: getWidth(305),
      alignSelf: 'center'
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