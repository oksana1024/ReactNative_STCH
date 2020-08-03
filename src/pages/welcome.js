import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ActivityIndicator,
    Image,
    TouchableOpacity,
    Animated,
    TextInput
} from 'react-native';
import Page from '../components/basePage';
import {getWidth, getHeight} from '../constants/dynamicSize';
import BaseButton from '../components/baseButton';
import AuthInput from '../components/authInput';
import navigationService from '../navigation/navigationService';
import pages from '../constants/pages';
import { BLACK_PRIMARY } from '../constants/colors';
import {functions} from '../constants/firebase';
import {validateEmail} from '../service/utils';
import {connect} from 'react-redux';
import {loginUserInfo} from '../model/actions/loginAC';
import {signupUserInfo} from '../model/actions/signupAC';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-community/async-storage';

const LOGO_IMAGE = require('../assets/images/icon-logo.png');
const BACK_BUTTON = require('../assets/images/back-button.png');
const FORWARD_BUTTON = require('../assets/images/forward-button.png');

class Welcome extends Component {

    constructor(props) {
        super(props);

        this.state = {
            height: new Animated.Value(getHeight(279)),
            emailInputable: false,
            switchValue: new Animated.Value(0),
            errorEmail: false,
            emptyEmail: false,
            email: '',
            loading: false,
            errorText: '',
            loginStep: false,
            emailDuplicated: false
        }
    }
    
    loginClick = () => {
        navigationService.navigate(pages.SIGN_IN);
    }

    singupClick = () => {
        navigationService.navigate(pages.SIGN_UP);
    }

    _loginAnimate = () => {
        this.setState({loginStep: true});
        this._startAnimate();
    }

    _signupAnimate = () => {
        this.setState({loginStep: false});
        this._startAnimate();
    }

    _startAnimate = () => {
        Animated.timing(
            this.state.height, 
            {
                toValue: getHeight(812),
                duration: 700,
            }
        ).start();
        setTimeout(() => {
            this.setState({emailInputable: true});
            Animated.timing(
                this.state.switchValue,
                {
                    toValue: 1,
                    duration: 100
                }
            ).start(() => {
                console.log(this.state.switchValue);
            });
        }, 580)
    }

    _clickBackBtn = () => {
        this.setState({height: new Animated.Value(getHeight(279)), emailInputable: false})
    }

    _changeEmail = (email) => {
        this.setState({email: email});
        
        if (email != '') {
          this.setState({emptyEmail: false, errorText: ''});
        }
  
        if (!validateEmail(email)) {
          this.setState({errorEmail: true, errorText: 'Invalid Email!'});
        } else {
          this.setState({errorEmail: false, errorText: ''});
        }
    }
    
    _forwardClick = () => {
        if (this.state.email == '') {
            this.setState({emptyEmail: true, errorText: 'Required!'});
            return;
        }

        if (this.state.emptyEmail == true || this.state.errorEmail == true) {
            return;
        }

        if (this.state.loginStep == true) {
            const {dispatch} = this.props;
            dispatch(loginUserInfo({
                email: this.state.email
            }));
            navigationService.navigate(pages.SIGN_IN);
        } else {
            this.setState({loading: true});
            let xhr = new XMLHttpRequest();
            xhr.open('GET', `https://us-central1-socrateach-65b77.cloudfunctions.net/proto/checkEmailDuplicate/${this.state.email}`);
            xhr.send();

            xhr.onload = () => {
                this.setState({loading: false});
                if (xhr.status == 200) {
                    let responseData = JSON.parse(xhr.response);
                    const {dispatch} = this.props;
                    if (responseData['result'] == true) {
                        console.log("User Exist!!!");
                        this.setState({emailDuplicated: true, errorText: 'Email Duplicated!'});
                    } else {
                        this.setState({emailDuplicated: false, errorText: ''});
                        console.log("User not Exist!!!");
                        dispatch(signupUserInfo({
                            email: this.state.email
                        }))
                        navigationService.navigate(pages.SIGN_UP);
                    }
                }
            }
        }

        
        
    }

    componentDidMount() {
        AsyncStorage.setItem('SocraTeach', 'appInstalled');
    }

    render () {

        return (
            <Page forceInset={{bottom: 'never'}}>
                <View style={styles.container} >
                    <View style={styles.logoView}>
                        <Image
                            source={LOGO_IMAGE}
                            style={styles.logoImage}
                            resizeMode={'contain'}
                        />
                    </View>
                    <View style={styles.btnView}>
                        
                    </View>
                    {
                        this.state.emailInputable == false ? 
                        <Animated.View style={{alignItems: 'center', position: 'absolute', bottom: 0, 
            backgroundColor: BLACK_PRIMARY, width: '100%',  height: this.state.height}}>
                            <Text style={styles.goBtn}>
                                Login
                            </Text>
                            <TouchableOpacity onPress={() => this._loginAnimate()}>
                                <Text style={styles.emailBtn}>
                                    Enter email address
                                </Text>
                                <View style={styles.underLine}></View>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.signBtn} onPress={() => this._signupAnimate()}>
                                <Text style={styles.signText}>
                                    Sign Up
                                </Text>
                                <View style={styles.signLine}></View>
                            </TouchableOpacity>
                        </Animated.View> 
                        :
                        <KeyboardAwareScrollView style={{width: '100%', position: 'absolute', bottom: 0, height: getHeight(812)}} contentContainerStyle={{backgroundColor: BLACK_PRIMARY, width: '100%', height: '100%'}}>
                            <TouchableOpacity style={styles.backBtnView} onPress={this._clickBackBtn}>
                                <Image style={styles.backBtnImage} resizeMode={'contain'} source={BACK_BUTTON}/>
                            </TouchableOpacity>
                            
                            <AuthInput 
                                desc={'Email Address'}
                                wrapperStyle={{marginBottom: getHeight(45)}}
                                descStyle={{marginBottom: getHeight(20)}}
                                onChangeText={this._changeEmail}
                                errorExist={this.state.errorEmail || this.state.emptyEmail || this.state.emailDuplicated}
                                errorText={this.state.errorText}
                                keyboardType={'email-address'}
                                autoFocus={this.state.emailInputable}
                            />
                            <View style={styles.forwardBtnView}>
                                <TouchableOpacity style={styles.forwardBtn} onPress={this._forwardClick}>
                                    <Image style={styles.backBtnImage} resizeMode={'contain'} source={FORWARD_BUTTON}/>
                                </TouchableOpacity>
                            </View>
                            {
                                this.state.loading == true ? 
                                <View style={{position: 'absolute', left: 0, top: 0, bottom: 0, right: 0, backgroundColor: 'rgba(255, 255, 255, 0.3)', justifyContent: 'center', alignItems: 'center'}}>
                                    <ActivityIndicator size={'large'} />
                                </View> : null
                            }
                        </KeyboardAwareScrollView>
                    }
                                      
                </View>
            </Page>
        )
    }
}

Welcome.navigatorStyle = {
    navBarHidden: true,
    statusBarBlur: false
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    logoView: {
        justifyContent: 'center',
        alignItems: 'center',
        height: getHeight(533),
    },
    logoImage: {
        width: getWidth(272),
        height: getHeight(144),
    },
    btnView: {
        height: getHeight(279),
        alignItems: 'center'
    },
    movingView: {
        height: getHeight(279),
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
        backgroundColor: BLACK_PRIMARY,
        width: '100%',       
    },
    goBtn: {
        marginTop: getHeight(57),
        alignItems: 'center',
        fontFamily: 'Montserrat-Medium',
        fontSize: getHeight(30),
        color: '#FFFFFF',
        width: getWidth(273),
        marginBottom: getHeight(30),
    },
    emailBtn: {
        color: 'rgba(229, 229, 229, 0.23)',
        fontFamily: 'Montserrat-Medium',
        fontSize: getHeight(20),
        width: getWidth(273),
        height: getHeight(35)
    },
    underLine: {
        height: 2,
        backgroundColor: 'rgba(88, 86, 214, 0.76)',
        width: getWidth(267)
    },
    signBtn: {
        marginTop: getHeight(25),
        height: getHeight(35)
    },
    signText: {
        color: 'rgba(229, 229, 229, 0.23)',
        fontFamily: 'Montserrat-Medium',
        fontSize: getHeight(20),
    },
    signLine: {
        height: 2,
        backgroundColor: 'rgba(88, 86, 214, 0.76)',
        marginTop: -getHeight(4)
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
    }
})

const mapStateToProps = (state) => ({
})

export default connect(mapStateToProps)(Welcome);