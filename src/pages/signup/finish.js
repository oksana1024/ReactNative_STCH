import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ActivityIndicator,
    Image
} from 'react-native';
import Page from '../../components/basePage';
import {getWidth, getHeight} from '../../constants/dynamicSize';
import BaseButton from '../../components/baseButton';
import navigationService from '../../navigation/navigationService';
import pages from '../../constants/pages';
import ProfileNote2 from '../../components/profileNote2';
import NavButton from '../../components/navButton';
import {connect} from 'react-redux';
import {auth, firestore} from '../../constants/firebase';

const WORD_LOGO = require('../../assets/images/word-logo.png');
const LOGO_IMAGE = require('../../assets/images/logo.png');
const HAT_IMAGE = require('../../assets/images/hat.png')

class Finish extends Component {

  constructor(props) {
    super(props);

    let signupInfo = props.signupInfo;
    console.log("SignupInfo = ", signupInfo);
    this.state = {
      name: signupInfo.userName,
      loading: false
    }
  }

  goForward = () => {
    const {signupInfo} = this.props;
    this.setState({loading: true});
    auth.createUserWithEmailAndPassword(signupInfo.email, signupInfo.password).then((result) => {
      console.log("Signup Result = ", result);
      firestore.collection('users').doc(result.user.uid).set({
        country: signupInfo.country,
        email: signupInfo.email,
        userName: signupInfo.userName,
        stripeToken: signupInfo.stripeToken,
        learnPay: signupInfo.learnPay,
        teachPay: signupInfo.teachPay,
        lastLogin: Date.now()
      })
    }).finally(() => {
      this.setState({loading: false});
    })
    // navigationService.navigate(pages.APP);
    // navigationService.popToTop();
  }

  goBack = () => {
    navigationService.pop();
  }
    
  render () {
      return (
          <Page>
            {
              this.state.loading == true ? 
              <View style={styles.container}>
                <ActivityIndicator size={'large'} />
              </View>
              :
              <View style={styles.container} >
                  <NavButton 
                    iconName={'md-arrow-back'} 
                    buttonStyle={{position: 'absolute', left: getWidth(16), top: getHeight(15)}}
                    onClick={this.goBack}
                  />
                  <Image
                    source={WORD_LOGO}
                    style={styles.wordImage}
                    resizeMode={'contain'}
                  />
                  <Image
                    source={HAT_IMAGE}
                    style={styles.hatImage}
                  />
                  <Text
                    style={styles.title}
                  >
                    Congratulations, {this.state.name}!
                  </Text>
                  <ProfileNote2 
                    text1={'Use your teaching earnings'}
                    text2={'for learning sessions!'}
                    customStyle={{width: '100%', justifyContent: 'center', marginBottom: getHeight(61)}}
                  />
                  <Image
                    source={LOGO_IMAGE}
                    style={styles.logoImage}
                    resizeMode={'contain'}
                  />
                  <Text
                    style={styles.label}
                  >
                    Start Learning and Teaching
                  </Text>
                  <BaseButton 
                    text={'BECOME A SOPHIST'}
                    onClick={this.goForward}
                  />
              </View>
            }
          </Page>
      )
  }
}

Finish.navigatorStyle = {
    navBarHidden: true,
    statusBarBlur: false
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%'
    },
    wordImage: {
      width: getWidth(244),
      height: getHeight(36),
      marginBottom: getHeight(47),
    },
    hatImage: {
      width: getWidth(44),
      height: getHeight(36),
      marginBottom: getHeight(6),
    },
    title: {
      fontSize: getHeight(24),
      fontFamily: 'Montserrat-Bold',
      marginBottom: getHeight(18),
      color: '#FFFFFF'
    },
    logoImage: {
      width: getWidth(291),
      height: getHeight(151),
      marginBottom: getHeight(127),
    },
    label: {
      fontSize: getHeight(20),
      fontFamily: 'Montserrat-Bold',
      marginBottom: getHeight(20),
      color: '#FFFFFF'
    }
})

const mapStateToProps = (state) => ({
  signupInfo: state.signupInfo
});

export default connect(mapStateToProps)(Finish)