import React, {Component} from 'react';
import {
    StyleSheet,
    Image,
    ActivityIndicator,
    View,
    TouchableOpacity,
    Text,
    Keyboard
} from 'react-native';
import Page from '../components/basePage';
import SwitchPage from '../components/switchPage';
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

class Login extends Component {

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
            modalVisiable: false,
            activeInput: 'email'
        }
    }
    
    loginClick = () => {
        if (this.state.invalidEmail == true) {
            return;
        }

        if (this.state.email == '') {
            this.setState({emptyEmail: true});
            return;
        }

        if (this.state.password == '') {
            this.setState({emptyPassword: true});
            return;
        }
        this.setState({loading: true});
        auth.signInWithEmailAndPassword(this.state.email, this.state.password).then((value) => {
            this.setState({mismatch: false});
            // firestore.collection('users').doc(value.user.uid).update({
            //     lastLogin: Date.now()
            // }).catch((error) => {
            //     console.log("Firestore Update Error", error);
            // })
        }).catch((error) => {
            console.log("SignIn Error = ", error);
            this.setState({mismatch: true});
        }).finally(() => {
            this.setState({loading: false});
        })
    }

    goBack = () => {
      navigationService.pop();
    }

    _changeEmail = (email) => {
        this.setState({email: email});
        if (email != '') {
            this.setState({emptyEmail: false, mismatch: false});
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
            this.setState({emptyPassword: false, mismatch: false})
        }
    }

    _forgotpasswordClick = () => {
        // this.setState({modalVisiable: true});
        navigationService.navigate(pages.FORGOT_PASSWORD);
    }

    _gotoHome = () => {
        console.log("Go To Home!!!!!", this.props.login.email);
        auth.sendPasswordResetEmail(this.props.login.email).then((value) => {

        })
        navigationService.reset(pages.LOADING);
    }

    _forwardClick = () => {
        // if (this.state.password == '') {
        //     this.setState({emptyPassword: true});
        //     return;
        // }

        // this.setState({loading: true});
        // auth.signInWithEmailAndPassword(this.props.login.email, this.state.password).then((value) => {
        //     this.setState({mismatch: false});
        //     firestore.collection('users').doc(value.user.uid).update({
        //         lastLogin: Date.now()
        //     }).catch((error) => {
        //         console.log("Firestore Update Error", error);
        //     })
        // }).catch((error) => {
        //     console.log("SignIn Error = ", error);
        //     this.setState({mismatch: true});
        // }).finally(() => {
        //     this.setState({loading: false});
        // })
        navigationService.navigate(pages.APP)
    }

    _gotoSignup = () => {
        navigationService.navigate(pages.SIGNUP_SWITCH);
    }

    _getPasswordRef = (ref) => {
        this.passwordInput = ref;
    }

    _emailFocus = () => {
        this.setState({activeInput: 'email'});
    }

    _passwordFocus = () => {
        this.setState({activeInput: 'password'})
    }

    _keyboardDidHide = () => {
        this.setState({activeInput: ''});
    }

    componentDidMount() {
        Keyboard.addListener("keyboardDidHide", this._keyboardDidHide);
        setTimeout(() => {
            this.setState({activeInput: 'email'})
          }, 80);
    }

    componentWillUnmount() {
        Keyboard.removeListener("keyboardDidHide", this._keyboardDidHide);
    }

    render () {
        return (
            <SwitchPage leftExist={false} leftSwitch={'Sign up'} rightSwitch={'Login'} switchValue={'right'} switchChange={this._gotoSignup}>
                {
                    this.state.loading == true ? 
                    <View style={styles.loadingWrapper}>
                        <ActivityIndicator size={'large'} />
                    </View>
                    :
                    <KeyboardAwareScrollView style={styles.container} contentContainerStyle={styles.wrapper}>
                        <View style={{flex: 1}}>
                            <Text style={styles.titleText}>
                                Login
                            </Text>
                            <AuthInput 
                                desc={'Email Address'}
                                wrapperStyle={{marginBottom: getHeight(27)}}
                                descStyle={{marginBottom: getHeight(25)}}
                                onChangeText={this._changeEmail}
                                errorExist={this.state.emptyEmail || this.state.invalidEmail}
                                errorText={this.state.emptyEmail ? 'Required!': 'Invalid Email!'}
                                autoCap={false}
                                autoFocus={true}
                                // returnKeyType={'next'}
                                // onSubmitEditing={() => {this.passwordInput.focus()}}
                                activeInput={this.state.activeInput == 'email' ? true : false}
                                onFocus={this._emailFocus}
                                keyboardType={'email-address'}
                            />
                            <AuthInput 
                                desc={'Password'}
                                pwdType={true}
                                wrapperStyle={{marginBottom: getHeight(16)}}
                                descStyle={{marginBottom: getHeight(25)}}
                                onChangeText={this._changePassword}
                                errorExist={this.state.emptyPassword || this.state.mismatch}
                                errorText={this.state.mismatch == true ? 'Incorrect Password or Email!' : 'Required!'}
                                // getRef={this._getPasswordRef}
                                activeInput={this.state.activeInput == 'password' ? true : false}
                                onFocus={this._passwordFocus}
                            />
                            <TouchableOpacity style={{marginLeft: getWidth(33), width: getWidth(108), flexDirection: 'row'}}
                            onPress={this._forgotpasswordClick}
                            >
                                <View>
                                    <Text style={styles.forgotText}>Forgot Password?</Text>
                                    <View style={{height: 1, backgroundColor: BLACK_PRIMARY, marginTop: -getHeight(2)}}></View>
                                </View>
                                <View style={{flex: 1}}>

                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={{width: '100%', alignItems: 'center'}}>
                            <BaseButton 
                                text={'Login'}
                                onClick={this.loginClick}
                                buttonStyle={{marginBottom: getHeight(18), backgroundColor: PURPLE_MAIN}}
                                textStyle={{color: '#FFFFFF'}}
                            />
                        </View>
                    </KeyboardAwareScrollView>
                }
            </SwitchPage>
        )
    }
}

Login.navigatorStyle = {
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
    logoImage: {
        width: getWidth(291),
        height: getHeight(151),
        marginBottom: getHeight(23)
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
    emailTitle: {
        marginTop: getHeight(24),
        marginLeft: getWidth(32),
        fontFamily: 'Montserrat-Medium',
        fontSize: getHeight(25),
        color: '#FFFFFF'
    },
    emailInputView: {
        marginTop: getHeight(50),
        marginLeft: getWidth(34)
    },
    emailInput: {
        fontFamily: 'Montserrat-Regular',
        fontSize: getHeight(20),
        marginBottom: getHeight(12)
    },
    forwardBtnView: {
        width: '100%', 
        alignItems: 'flex-end',
    },
    forwardBtn: {
        marginRight: getWidth(32),
    },
    forgotText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: getHeight(12),
        color: BLACK_PRIMARY,
    },
    modalWrapper: {
        width: '100%',
        height: '100%',
        alignItems: 'center'
    },
    btnText: {
        color: '#FFFFFF',
        fontFamily: 'Montserrat-Medium',
        fontSize: getHeight(18)
    },
    btnWrapper: {
        width: getWidth(220), 
        height: getHeight(36), 
        backgroundColor: PURPLE_MAIN, 
        marginBottom: getHeight(23),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: getHeight(10)
    },
    modalView: {
        marginTop: getHeight(55), 
        borderRadius: getHeight(10), 
        width: getWidth(244), 
        height: getHeight(262), 
        backgroundColor: '#E5E5E5',
        alignItems: 'center'
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

export default connect(mapStateToProps)(Login);