import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ActivityIndicator,
    Platform,
    Image,
    TouchableOpacity,
    BackHandler   
} from 'react-native';
import Page from '../components/basePage';
// import MenuPage from '../components/menuPage';
import TopBarPage from '../components/topBarPage';
import SwitchPage from '../components/switchPage';
import {getWidth, getHeight} from '../constants/dynamicSize';
import {notifications, firebase} from '../constants/firebase';
import BaseButton from '../components/baseButton';
import MenuButton from '../components/menuButton';
import Alert from '../components/icons/alert';
import navigationService from '../navigation/navigationService';
import pages from '../constants/pages';
import {connect} from 'react-redux';
import {fetchInitProblem} from '../controller/problem';
import {getMyInitTeachList, clearMyTeachList} from '../controller/teach';
import {getMyInitLearnList, clearMyLearnList} from '../controller/learn';
import {getExpressAccount, fetchBalance} from '../controller/user';
import {getMyLiveLearnSession, getMyLiveTeachSession, clearMyLTSession} from '../controller/ltsession';
import PushNotificationIOS from "@react-native-community/push-notification-ios"
import {GRAY_SECONDARY, PURPLE_MAIN} from '../constants/colors';
import Notification from 'react-native-android-local-notification';
import Switch from '../components/switch/index';
import AuthInput from '../components/authInput';

const LOGO_IMAGE = require('../assets/images/logo.png');
const WORD_LOGO = require('../assets/images/word-logo.png');

class TestScreen extends Component {
    constructor(props) {
        super(props);
        this.notificationOpenListener = null;
        this.notificationListener =  null;
        this.state = {
            modalVisible: false,
            leWarnVisible: false,
            switchOneValue: false,
        }

        const channel = new firebase.notifications.Android.Channel('test-channel', 'Test Channel', firebase.notifications.Android.Importance.Max).setDescription('SocraTeach Test Channel');

        notifications.android.createChannel(channel);
    }
    learnClick = () => {
        navigationService.navigate(pages.LEARN_SUBJECT);       
    }

    teachClick = () => {
        console.log("Home Express Props = ", this.props.bank.express);
        if (this.props.bank.express == null) {
            this.setState({modalVisible: true});
            
        } else {
            navigationService.navigate(pages.TEACH_SUBJECT);
        }
        
    }
    
    static getDerivedStateFromProps (props, state) {
        return null;
    }

    _renderTitle = () => {
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', paddingLeft: getWidth(10)}}>
                <Image 
                    style={{width: getWidth(191), height: getHeight(28)}}
                    resizeMode={'contain'}
                    source={WORD_LOGO}
                />
            </View>
            
        )
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressed);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressed);
    }

    onBackButtonPressed() {
        return true;
    }

    toggleSwitch = () => {
      console.log("Switch Toggled!!!");
    }

    render () {
        return (
            <SwitchPage notiExist={true} titleText={'Test'} switchChange={this.toggleSwitch}>
              <AuthInput 
                  desc={'Password'}
                  wrapperStyle={{marginBottom: getHeight(27)}}
                  descStyle={{marginBottom: getHeight(15)}}
                  onChangeText={this._changePassword}
                  errorExist={true}
                  errorText={'Error'}
                  activeInput={true}
              />
            </SwitchPage>
        )
    }
}

TestScreen.navigatorStyle = {
    navBarHidden: true,
    statusBarBlur: false
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        
    },
    logoImage: {
        width: getWidth(291),
        height: getHeight(151),
        marginBottom: getHeight(23),
        
    }
})

const mapStateToProps = (state) => ({
    subjects: state.subject,
    user: state.user,
    payment: state.payment,
    bank: state.bank
  })
  
  export default connect(mapStateToProps)(TestScreen);