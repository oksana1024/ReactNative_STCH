import React, {Component} from 'react';
import {
    StyleSheet,
    Alert,
    TouchableOpacity,
    View,
    Text,
    ScrollView,
    Keyboard
} from 'react-native';
import SwitchPage from '../components/switchPage';
import NavPage from '../components/navPage';
import {getWidth, getHeight} from '../constants/dynamicSize';
import BaseButton from '../components/baseButton';
import AuthInput from '../components/authInput';
import navigationService from '../navigation/navigationService';
import pages from '../constants/pages';
import {validateEmail} from '../service/utils';
import {connect} from 'react-redux';
import {signupUserInfo} from '../model/actions/signupAC';
import { BLACK_PRIMARY, PURPLE_MAIN } from '../constants/colors';
import { KeyboardAwareView } from 'react-native-keyboard-aware-view';
import {auth, firestore} from '../constants/firebase';
import { withMappedNavigationParams } from 'react-navigation-props-mapper';
import store from '../model/store';
import _ from 'lodash';
import {fetchUser} from '../model/actions/userAC';

@withMappedNavigationParams()
class Signup extends Component {

  constructor(props) {
    super(props);

    this.state ={
      userName: '',
      email: props.user.email ? props.user.email : '',
      password: '',
      passwordConfirm: '',
      errorEmail: false,
      passwordDismatch: false,
      country: '',
      phoneNumber: props.user.phoneNumber ? props.user.phoneNumber : '',
      emptyPhoneNumber: false,
      errorPhoneNumber: false,
      weekPassword: false,
      firstName: props.user.firstName ? props.user.firstName : '',
      lastName: props.user.lastName ? props.user.lastName : '',
      emptyFirstName: false,
      emptyLastName: false,
      emptyEmail: false,
      emptyCountry: false,
      emptyPassword: false,
      emptyPasswordConfirm: false,
      offerSend: false,
      skipPayment: false,
      loading: false,
      activeInput: '',
      emailDuplicated: false
    }
  }
    
    goForward = () => {
      if (this.state.firstName == '') {
        this.setState({emptyFirstName: true});
        return;
      }

      if (this.state.lastName == '') {
        this.setState({emptyLastName: true});
        return;
      }

      if (this.state.errorEmail) {
        return;
      }

      if (this.state.email == '') {
        this.setState({emptyEmail: true});
        return;
      }

      if (this.state.phoneNumber == '') {
        this.setState({emptyPhoneNumber: true});
        return;
      }

      // if (this.state.password == '') {
      //   this.setState({emptyPassword: true});
      //   return;
      // }

      // if (this.state.passwordConfirm == '') {
      //   this.setState({emptyPasswordConfirm: true});
      //   return;
      // }

      // if (this.state.password.length < 8) {
      //   this.setState({weekPassword: true});
      //   return;
      // }

      this.setState({loading: true})
      firestore.collection('users').doc(auth.currentUser.uid).update({
        phoneNumber: this.state.phoneNumber,
        userName: this.state.firstName + ' ' + this.state.lastName,
        firstName: this.state.firstName,
        lastName: this.state.lastName
      }).then((value) => {
        this.setState({loading: false});
        
        store.dispatch(fetchUser({
          phoneNumber: this.state.phoneNumber,
          userName: this.state.firstName + ' ' + this.state.lastName,
          firstName: this.state.firstName,
          lastName: this.state.lastName,
          email: this.props.user.email
        }));
        console.log("Update is Finished! ", value);
        navigationService.pop();
      }).catch(error => {
        this.setState({loading: false});
        console.log("Update is Failed: ", error);
      });

      // this.setState({loading: true});
      // let xhr = new XMLHttpRequest();
      // xhr.open('GET', `https://us-central1-socrateach-65b77.cloudfunctions.net/proto/checkEmailDuplicate/${this.state.email}`);
      // xhr.send();

      // xhr.onload = () => {
      //     this.setState({loading: false});
      //     if (xhr.status == 200) {
      //         let responseData = JSON.parse(xhr.response);
      //         if (responseData['result'] == true) {
      //             console.log("User Exist!!!");
      //             this.setState({emailDuplicated: true, errorText: 'Email Duplicated!'});
      //         } else {
      //             this.setState({emailDuplicated: false, errorText: ''});
      //             console.log("User not Exist!!!");
      //             // const {dispatch} = this.props;
      //             // dispatch(signupUserInfo({
      //             //   firstName: this.state.firstName,
      //             //   lastName: this.state.lastName,
      //             //   email: this.state.email,
      //             //   phoneNumber: this.state.phoneNumber,
      //             // }));

      //             // navigationService.navigate(pages.BANK, {
      //             //   email: this.state.email,
      //             //   password: this.state.password,
      //             // });
      //             this.setState({loading: true})
      //             firestore.collection('users').doc(auth.currentUser.uid).update({
      //               phoneNumber: this.state.phoneNumber,
      //               userName: this.state.firstName + ' ' + this.state.lastName,
      //               firstName: this.state.firstName,
      //               lastName: this.state.lastName
      //             }).then((value) => {
      //               this.setState({loading: false});
      //               console.log("Update is Finished! ", value);
      //               navigationService.pop();
      //             }).catch(error => {
      //               this.setState({loading: false});
      //               console.log("Update is Failed: ", error);
      //             });
      //             // auth.currentUser.updateEmail(this.state.email).then((value) => {
      //             //   firestore.collection('users').doc(auth.currentUser.uid).update({
      //             //     phoneNumber: this.state.phoneNumber,
      //             //     userName: this.state.firstName + ' ' + this.state.lastName,
      //             //     email: this.state.email,
      //             //     firstName: this.state.firstName,
      //             //     lastName: this.state.lastName
      //             //   }).then((value) => {
      //             //     this.setState({loading: false});
      //             //     console.log("Update is Finished! ", value);
      //             //     navigationService.pop();
      //             //   }).catch(error => {
      //             //     this.setState({loading: false});
      //             //     console.log("Update is Failed: ", error);
      //             //   });
      //             // }).catch(error => {
      //             //   this.setState({loading: false});
      //             //   console.log("Firebase Current User Email Change Failed: ", error);
      //             //   Alert.alert(
      //             //     'Update Failed!',
      //             //     error,
      //             //     [
      //             //       {
      //             //         text: 'OK',
      //             //         onPress: () => console.log('Cancel Pressed'),
      //             //         style: 'cancel'
      //             //       }
      //             //     ],
      //             //     {cancelable: false}
      //             //   )
                    
      //             // });
      //         }
      //     }
      // }
    }

    goBack = () => {
      navigationService.pop();
    }

    _changeFirstName = (text) => {
      
      if (text != '') {
        this.setState({emptyFirstName: false});
      }
      
      this.setState({firstName: text}); 
    }

    _firstNameFocus = () => {
      this.setState({activeInput: 'firstName'});
    }

    _changeLastName = (text) => {
      if (text != '') {
        this.setState({emptyLastName: false});
      }

      this.setState({lastName: text});
    }

    _lastNameFocus = () => {
      this.setState({activeInput: 'lastName'});
    }

    _changeEmail = (email) => {
      this.setState({email: email});
      
      if (email != '') {
        this.setState({emptyEmail: false, emailDuplicated: false});
      }

      if (!validateEmail(email)) {
        this.setState({errorEmail: true});
      } else {
        this.setState({errorEmail: false});
      }
    }

    _emailFocus = () => {
      this.setState({activeInput: 'email'});
    }

    _changeCountry = (country) => {
      if (country != '') {
        this.setState({emptyCountry: false});
      }
      this.setState({country: country});
    }

    _changePassword = (password) => {
      if (password != '') {
        this.setState({emptyPassword: false});
      }
      this.setState({password: password });
      if (this.state.passwordConfirm != '' && this.state.passwordConfirm != password) {
        this.setState({passwordDismatch: true});
      } 
      if (this.state.passwordConfirm != '' && this.state.passwordConfirm == password) {
        this.setState({passwordDismatch: false});
      }
    }

    _passwordFocus = () => {
      this.setState({activeInput: 'password'});
    }

    _changePasswordConfirm = (password) => {
      this.setState({passwordConfirm: password});
      if (password != '') {
        this.setState({emptyPasswordConfirm: false});
      }
      if (this.state.password != password) {
        this.setState({passwordDismatch: true})
      } else {
        this.setState({passwordDismatch: false})
      }
      
    }

    _passwordConfirmFocus = () => {
      this.setState({activeInput: 'passwordConfirm'});
    }

    _changePhoneNumber = (number) => {
      this.setState({phoneNumber: number});
      if (number != '') {
        this.setState({emptyPhoneNumber: false});
      }
    }

    _phoneFocus = () => {
      this.setState({activeInput: 'phone'});
    }

    _changeOfferSend = () => {
      this.setState({offerSend: !this.state.offerSend});
    }

    _changeSkipPayment = () => {
      this.setState({skipPayment: !this.state.skipPayment});
    }

    _gotoLogin = () => {
      navigationService.navigate(pages.SIGNIN_SWITCH);
    }

    _getFirstNameRef = (ref) => {
      this.firstNameInput = ref;
    }

    _getLastNameRef = (ref) => {
      this.lastNameInput = ref;
    }

    _getEmailRef = (ref) => {
      this.emailInput = ref;
    }

    _getPhoneRef = (ref) => {
      this.phoneInput = ref;
    }

    _getPasswordRef = (ref) => {
      this.passwordInput = ref;
    }

    _getPasswordConfirmRef = (ref) => {
      this.passwordConfirmInput = ref;
    }

    _keyboardDidHide = () => {
      this.setState({activeInput: ''});
    }

    componentDidMount() {
      Keyboard.addListener("keyboardDidHide", this._keyboardDidHide);
      setTimeout(() => {
        this.refs.Scroll_Reference.scrollTo({animated: false}, 0);
        this.setState({activeInput: 'firstName'})
      }, 100);
    }

    componentWillUnmount() {
      Keyboard.removeListener("keyboardDidHide", this._keyboardDidHide);
    }

    static getDerivedStateFromProps (props, state) {
      
    }

    _goBack = () => {
      navigationService.pop();
    }

    render () {
      let passwordErroText = '';
      if (this.state.emptyPassword == true) {
        passwordErroText = 'Required!';
      }
      if (this.state.passwordDismatch == true) {
        passwordErroText = 'Password Mismatch';
      }

      if (this.state.weekPassword == true) {
        passwordErroText = 'Your password should be at least 8 characters!'
      }

      let emailErrorText = '';
      if (this.state.errorEmail == true) {
        emailErrorText = 'Invalid Email!';
      }

      if (this.state.emptyEmail == true) {
        emailErrorText = 'Required!';
      }

      if (this.state.emailDuplicated == true) {
        emailErrorText = 'Email Duplicated!'
      }
        return (
            <NavPage onLeftClick={this._goBack}>
              <KeyboardAwareView animation={true} style={{width: '100%'}}>
                <ScrollView
                  ref='Scroll_Reference'
                  style={{flex: 1, width: '100%'}}
                >
                  <Text style={styles.titleText}>
                    Change your info
                  </Text>
                  <AuthInput 
                      desc={'First Name'}
                      wrapperStyle={{marginBottom: getHeight(27)}}
                      descStyle={{marginBottom: getHeight(25)}}
                      onChangeText={this._changeFirstName}
                      errorExist={this.state.emptyFirstName}
                      errorText={'Required!'}
                      autoCap={true}
                      autoFocus={true}
                      returnKeyType={'next'}
                      getRef={this._getFirstNameRef}
                      onSubmitEditing={() => {this.lastNameInput.focus()}}
                      activeInput={this.state.activeInput == 'firstName' ? true : false}
                      onFocus={this._firstNameFocus}
                      defaultValue={this.props.user.firstName}
                  />
                  <AuthInput 
                      desc={'Last Name'}
                      wrapperStyle={{marginBottom: getHeight(27)}}
                      descStyle={{marginBottom: getHeight(25)}}
                      onChangeText={this._changeLastName}
                      errorExist={this.state.emptyLastName}
                      errorText={'Required!'}
                      autoCap={true}
                      returnKeyType={'next'}
                      getRef={this._getLastNameRef}
                      onSubmitEditing={() => {this.phoneInput.focus()}}
                      activeInput={this.state.activeInput == 'lastName' ? true : false}
                      onFocus={this._lastNameFocus}
                      defaultValue={this.props.user.lastName}
                  />
                  <AuthInput 
                      desc={'Email Address'}
                      wrapperStyle={{marginBottom: getHeight(27)}}
                      descStyle={{marginBottom: getHeight(25)}}
                      onChangeText={this._changeEmail}
                      errorExist={this.state.emptyEmail || this.state.errorEmail || this.state.emailDuplicated}
                      errorText={emailErrorText}
                      autoCap={false}
                      getRef={this._getEmailRef}
                      keyboardType={'email-address'}
                      returnKeyType={'next'}
                      onSubmitEditing={() => {this.phoneInput.focus()}}
                      activeInput={this.state.activeInput == 'email' ? true : false}
                      onFocus={this._emailFocus}
                      defaultValue={this.props.user.email}
                      disabled={true}
                  />
                  <AuthInput
                      desc={'Phone Number'}
                      placeholder={'6301231234'}
                      wrapperStyle={{marginBottom: getHeight(27)}}
                      descStyle={{marginBottom: getHeight(25)}}
                      onChangeText={this._changePhoneNumber}
                      errorExist={this.state.emptyPhoneNumber}
                      errorText={'Required!'}
                      getRef={this._getPhoneRef}
                      returnKeyType={'next'}
                      onSubmitEditing={() => {this.passwordInput.focus()}}
                      activeInput={this.state.activeInput == 'phone' ? true : false}
                      onFocus={this._phoneFocus}
                      defaultValue={this.props.user.phoneNumber}
                  />
                  {/* <AuthInput 
                      desc={'Password'}
                      pwdType={true}
                      wrapperStyle={{marginBottom: getHeight(27)}}
                      descStyle={{marginBottom: getHeight(25)}}
                      onChangeText={this._changePassword}
                      errorExist={this.state.emptyPassword || this.state.passwordDismatch || this.state.weekPassword}
                      errorText={passwordErroText}
                      getRef={this._getPasswordRef}
                      returnKeyType={'next'}
                      onSubmitEditing={() => {this.passwordConfirmInput.focus()}}
                      activeInput={this.state.activeInput == 'password' ? true : false}
                      onFocus={this._passwordFocus}
                  />
                  <AuthInput 
                      desc={'Confirm password'}
                      pwdType={true}
                      wrapperStyle={{marginBottom: getHeight(27)}}
                      descStyle={{marginBottom: getHeight(25)}}
                      onChangeText={this._changePasswordConfirm}
                      errorExist={this.state.emptyPasswordConfirm}
                      errorText={'Required!'}
                      returnKeyType={'default'}
                      getRef={this._getPasswordConfirmRef}
                      activeInput={this.state.activeInput == 'passwordConfirm' ? true : false}
                      onFocus={this._passwordConfirmFocus}
                  /> */}
                  {/* <View style={styles.descView1}>
                    <Text style={styles.descText}>
                        We'll send you policy updates, special offers, and marketing promotions via e-mail.
                    </Text>
                  </View>
                  
                  <View style={styles.descView2}>
                    <Text style={styles.descText2}>
                      I don't want discount offers from SocraTeach
                    </Text>
                    <View>
                      <Switch 
                        value={this.state.offerSend}
                        onChangeValue={this._changeOfferSend}
                        activeBackgroundColor={PURPLE_MAIN}
                        inactiveBackgroundColor={BLACK_PRIMARY}
                        switchWidth={getWidth(25)}
                        switchHeight={getHeight(14)}
                        buttonWidth={getHeight(8)}
                        buttonHeight={getHeight(8)}
                        buttonBorderRadius={getHeight(4)}
                      />
                    </View>
                  </View>
                  <View style={styles.descView2}>
                    <Text style={styles.descText2}>
                    If you are an MIT or Northwestern University student, please check this box to skip payment section.
                    </Text>
                    <View>
                      <Switch 
                        value={this.state.skipPayment}
                        onChangeValue={this._changeSkipPayment}
                        activeBackgroundColor={PURPLE_MAIN}
                        inactiveBackgroundColor={BLACK_PRIMARY}
                        switchWidth={getWidth(25)}
                        switchHeight={getHeight(14)}
                        buttonWidth={getHeight(8)}
                        buttonHeight={getHeight(8)}
                        buttonBorderRadius={getHeight(4)}
                      />
                    </View>
                  </View>
                  <View style={styles.descView1}>
                    <Text style={styles.descText}>
                      By selecting Agree and continue below,  I agree to SocraTeach’s Privacy Policy.
                    </Text>
                  </View> */}
                  <View style={{width: '100%', justifyContent: 'center', alignItems: 'center'}}>
                    <BaseButton 
                      text={'Save'}
                      onClick={this.goForward}
                      buttonStyle={{marginBottom: getHeight(35), marginTop: getHeight(10), backgroundColor: PURPLE_MAIN}}
                      textStyle={{color: '#FFFFFF'}}
                      loading={this.state.loading}
                    />
                  </View>
                </ScrollView>
                </KeyboardAwareView>
            </NavPage>
        )
    }
}

Signup.navigatorStyle = {
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
    
    
  },
  logoImage: {
      width: getWidth(291),
      height: getHeight(151),
      marginBottom: getHeight(23),
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
  titleText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: getHeight(24),
    marginTop: getHeight(32),
    marginLeft: getWidth(32),
    marginBottom: getHeight(25)
  },
  descText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: getHeight(14),
  },
  descText2: {
    fontFamily: 'Montserrat-Regular',
    fontSize: getHeight(14),
    width: getWidth(246)
  },
  descView1: {
    marginLeft: getWidth(35),
    marginRight: getWidth(20),
    marginBottom: getHeight(15)
  },
  descView2: {
    width: '100%',
    paddingLeft: getWidth(35),
    paddingRight: getWidth(35),
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: getHeight(15)
  }
})

const mapStateToProps = (state) => ({
  user: state.user
})

export default connect(mapStateToProps)(Signup);