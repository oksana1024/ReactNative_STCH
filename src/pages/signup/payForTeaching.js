import React, {Component} from 'react';
import {
    StyleSheet,
    Image,
    View,
    Text
} from 'react-native';
import Page from '../../components/basePage';
import {getWidth, getHeight} from '../../constants/dynamicSize';
import BaseButton from '../../components/baseButton';
import BaseInput from '../../components/baseInput';
import NavButton from '../../components/navButton';
import ProfileOption from '../../components/profileOption';
import ProfileNote1 from '../../components/profileNote1';
import ProfileNote2 from '../../components/profileNote2';
import navigationService from '../../navigation/navigationService';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {PURPLE_SECOND} from '../../constants/colors';
import pages from '../../constants/pages';
import {connect} from 'react-redux';
import {signupTechInfo} from '../../model/actions/signupAC';

const LOGO_IMAGE = require('../../assets/images/logo.png');

class PayTeaching extends Component {

  constructor(props) {
    super(props);

    this.state = {
      checked: false,
      onProfile: false,
      depositBank: false,
      techSkipped: false
    }
  }
    
    goForward = () => {
      const {dispatch} = this.props;
      if (this.state.checked == false) {
        return;
      }
      dispatch(signupTechInfo({
        onProfile: this.state.onProfile,
        depositBank: !this.state.onProfile,
        techPaySkipped: false
      }));
      navigationService.navigate(pages.PAY_LEARNING);
    }

    goBack = () => {
      navigationService.pop();
    }

    checkFirst = () => {
      this.setState({onProfile: !this.state.onProfile, checked: true});
    }

    goSkip = () => {
      // this.setState({techSkipped: true});
      const {dispatch} = this.props;
      dispatch(signupTechInfo({
        techPaySkipped: true
      }))
      navigationService.navigate(pages.PAY_LEARNING);
    }

    render () {
        return (
            <Page>
                <KeyboardAwareScrollView style={styles.container} contentContainerStyle={styles.wrapper}>
                    <NavButton 
                      iconName={'md-arrow-back'} 
                      buttonStyle={{position: 'absolute', left: getWidth(16), top: getHeight(15)}}
                      onClick={this.goBack}
                    />
                    <Image
                        source={LOGO_IMAGE}
                        style={styles.logoImage}
                        resizeMode={'contain'}
                    />
                    <Text
                      style={styles.primaryDesc} 
                    >
                      Get Paid for Teaching
                    </Text>
                    <Text
                      style={styles.secondaryDesc} 
                    >
                      Select
                    </Text>
                    <View
                      style={styles.optionContainer}
                    >
                      <ProfileOption
                        text={'Earning accumulate on your profile'}
                        checked={this.state.onProfile && this.state.checked}
                        onClick={this.checkFirst}
                      />
                      <ProfileOption
                        text={'Direct Deposit into your bank account'}
                        checked={!this.state.onProfile && this.state.checked}
                        onClick={this.checkFirst}
                      />
                    </View>
                    <ProfileNote1
                      text={'You can always deposit earnings on your profile into your bank at a later time.'}
                      customStyle={{marginBottom: getHeight(19)}}
                    />
                    <ProfileNote2
                      text1={'Skip this section for learning only!'}
                      text2={'You can decide to teach later!'}
                      customStyle={{marginBottom: getHeight(43)}}
                    />
                    
                    <BaseButton 
                        text={'SKIP'}
                        onClick={this.goSkip}
                        buttonStyle={{marginBottom: getHeight(22)}}
                    />
                    <BaseButton 
                        text={'CONTINUE'}
                        onClick={this.goForward}
                    />
                </KeyboardAwareScrollView>
            </Page>
        )
    }
}

PayTeaching.navigatorStyle = {
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
      marginBottom: getHeight(16),
    },
    primaryDesc: {
      fontFamily: 'Montserrat-Bold',
      fontSize: getHeight(24),
      color: '#FFFFFF',
      marginBottom: getHeight(38)
    },
    secondaryDesc: {
      fontFamily: 'Montserrat-Bold',
      fontSize: getHeight(18),
      color: '#FFFFFF',
      width: '100%',
      paddingLeft: getWidth(32),
      marginBottom: getHeight(10)
    },
    optionContainer: {
      width: getWidth(346),
      height: getHeight(124),
      backgroundColor: PURPLE_SECOND,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 7,
      },
      shadowOpacity: 0.41,
      shadowRadius: 9.11,
      elevation: 14,
      borderRadius: getHeight(10),
      justifyContent: 'space-evenly',
      alignItems: 'center',
      marginBottom: getHeight(20.57)
    }
})

const mapStateToProps = (state) => ({
  signupInfo: state.signupInfo
});

export default connect(mapStateToProps)(PayTeaching)