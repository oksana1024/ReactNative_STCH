import React, {Component} from 'react';
import {
    StyleSheet,
    Image,
    ActivityIndicator,
    View,
    TouchableOpacity,
    Text
} from 'react-native';
import NavPage from '../components/navPage';
import {getWidth, getHeight} from '../constants/dynamicSize';
import BaseButton from '../components/baseButton';
import BaseInput from '../components/baseInput';
import AuthInput from '../components/authInput';
import NavButton from '../components/navButton';
import navigationService from '../navigation/navigationService';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {auth, firestore} from '../constants/firebase';
import {validateEmail} from '../service/utils';
import { BLACK_PRIMARY, PURPLE_MAIN } from '../constants/colors';
import pages from '../constants/pages';
import {connect} from 'react-redux';
// import { withMappedNavigationParams } from 'react-navigation-props-mapper';

const LOGO_IMAGE = require('../assets/images/icon-logo.png');
const BACK_BUTTON = require('../assets/images/back-button.png');
const FORWARD_BUTTON = require('../assets/images/forward-button.png');

class ForgotPassword extends Component {

    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            emptyEmail: false,
            invalidEmail: false,
            emptyPassword: false,
            mismatch: false,
            loading: false,
            modalVisiable: false
        }
    }
    
    goBack = () => {
      navigationService.pop();
    }

    _changeEmail = (email) => {
        this.setState({email: email});
        if (email != '') {
            this.setState({emptyEmail: false});
        }

        if (!validateEmail(email)) {
            this.setState({invalidEmail: true});
        } else {
            this.setState({invalidEmail: false});
        }
    }

    _changePassword = (password) => {
        this.setState({password: password});
        if (password != '') {
            this.setState({emptyPassword: false})
        }
    }

    _forgotpasswordClick = () => {
        this.setState({modalVisiable: true});
    }

    _gotoHome = () => {
        console.log("Go To Home!!!!!", this.props.login.email);
        auth.sendPasswordResetEmail(this.props.login.email).then((value) => {

        })
        navigationService.reset(pages.LOADING);
        
    }

    _forwardClick = () => {
        if (this.state.password == '') {
            this.setState({emptyPassword: true});
            return;
        }

       
    }

    _gotoSignup = () => {
        navigationService.navigate(pages.SIGNUP_SWITCH);
    }

    _goBack = () => {
      navigationService.pop();
    }

    _forwardClick = () => {
      if (this.state.invalidEmail == true) {
        return;
      }

      if (this.state.email == '') {
        this.setState({emptyEmail: true});
        return;
      }

      auth.sendPasswordResetEmail(this.state.email).then((value) => {
        console.log("Password Reset email sent === ", value);
      }).catch(error => {
        console.log("Password Reset Error == ", error);
      })
      navigationService.popToTop();
    }

    render () {
        return (
          <NavPage titleText={'Password Recovery'} onLeftClick={this._goBack}>
                {
                    this.state.loading == true ? 
                    <View style={styles.loadingWrapper}>
                        <ActivityIndicator size={'large'} />
                    </View>
                    :
                    <KeyboardAwareScrollView style={styles.container} contentContainerStyle={styles.wrapper}>
                        <View style={{flex: 1}}>
                            <Text style={styles.titleText}>
                                Recovery
                            </Text>
                            <AuthInput 
                                desc={'Email Address'}
                                wrapperStyle={{marginBottom: getHeight(27)}}
                                descStyle={{marginBottom: getHeight(25)}}
                                onChangeText={this._changeEmail}
                                errorExist={this.state.emptyEmail || this.state.invalidEmail}
                                errorText={this.state.emptyEmail ? 'Required!': 'Invalid Emaild!'}
                                autoCap={false}
                                autoFocus={true}
                            />
                            <Text style={styles.forgotText}>
                                Password recovery information will be sent to this e-mail address.
                            </Text>
                        </View>
                        <View style={{width: '100%', alignItems: 'center'}}>
                            <BaseButton 
                                text={'Recover Password'}
                                onClick={this._forwardClick}
                                buttonStyle={{marginBottom: getHeight(18), backgroundColor: PURPLE_MAIN}}
                                textStyle={{color: '#FFFFFF'}}
                            />
                        </View>
                    </KeyboardAwareScrollView>
                }
            </NavPage>
        )
    }
}

ForgotPassword.navigatorStyle = {
    navBarHidden: false,
    statusBarBlur: false
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    loadingWrapper: {
      flex: 1,
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center'
    },
    wrapper: {
      flex: 1,
      width: '100%',
      height: '100%',
    },
    forgotText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: getHeight(14),
        color: BLACK_PRIMARY,
        marginLeft: getWidth(33), 
        width: getWidth(320)
    },
    descText: {
        color: '#3A3A3C',
        fontFamily: 'Montserrat-Medium',
        fontSize: getHeight(18)
    },
    titleText: {
        fontFamily: 'Montserrat-Medium',
        fontSize: getHeight(24),
        marginTop: getHeight(32),
        marginLeft: getWidth(32),
        marginBottom: getHeight(25)
    },
})

const mapStateToProps = (state) => ({
    login: state.login
})

export default connect(mapStateToProps)(ForgotPassword);