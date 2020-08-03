import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ActivityIndicator,
    BackHandler
} from 'react-native';
import {PURPLE_MAIN, BLACK_PRIMARY} from '../constants/colors';
import Page from '../components/basePage';
import {getHeight} from '../constants/dynamicSize';
import {notifications, firestore, auth, message} from '../constants/firebase';
import {connect} from 'react-redux';
import {getExpressAccount, fetchBalance} from '../controller/user';
import navigationService from '../navigation/navigationService';
import pages from '../constants/pages';
import PushNotificationIOS from "@react-native-community/push-notification-ios"
import {getMyLiveLearnSession, getMyLiveTeachSession, clearMyLTSession} from '../controller/ltsession';
import { fetchUser } from '../model/actions/userAC';

class ContentLoading extends Component {

  constructor(props) {
    super(props);

    this.notificationOpenListener = null;
    this.notificationListener =  null;

    // const channel = new firebase.notifications.Android.Channel('test-channel', 'Test Channel', firebase.notifications.Android.Importance.Max).setDescription('SocraTeach Test Channel');

    // notifications.android.createChannel(channel);
  }

  async requestAndRegisterFCMToken() {
    const enabled = await message.hasPermission();
    if (!enabled) {
      await message.requestPermission();
    } 
    let fcmToken = await message.getToken();
    if(fcmToken && fcmToken != "") {
      firestore.collection('users').doc(auth.currentUser.uid).update({
        fcmToken: fcmToken
      }).then((value) => {
        console.log("FCM TOKEN ========= ", fcmToken);
      })
    }
  }

    componentDidMount() {
        const {dispatch} = this.props;
        console.log("ContentLoading User Redux ==== ", this.props.user);
        dispatch(getExpressAccount());
        dispatch(fetchBalance());
        dispatch(clearMyLTSession());
        dispatch(getMyLiveLearnSession());
        dispatch(getMyLiveTeachSession());

        if (Platform.OS == 'ios') {
          PushNotificationIOS.setApplicationIconBadgeNumber(0);
        }
        
        firestore.collection('users').doc(auth.currentUser.uid).update({
          badge: 0
        })

        this.requestAndRegisterFCMToken();

        this.notificationOpenListener = notifications.onNotificationOpened((notificationOpen) => {
          console.log("Notification Opened ", notificationOpen.notification);
          // Get the action triggered by the notification being opened
          const action = notificationOpen.action;
          // Get information about the notification that was opened
          const notification = notificationOpen.notification;
        });

        this.notificationListener = notifications.onNotification((notification) => {
          console.log("Notification Received ", notification.body);
          console.log("Notification Received ", notification.title);
          if (Platform.OS == 'ios') {
              PushNotificationIOS.presentLocalNotification({
                  alertBody: notification.body,
                  alertTitle: notification.title,  
              })
          } else {

              // const localNotification = new firebase.notifications.Notification({
              //     sound: 'default',
              //     show_in_foreground: true,
              //   })
              //   .setNotificationId(notification.notificationId)
              //   .setTitle(notification.title)
              // //   .setSubtitle(notification.subtitle)
              //   .setBody(notification.body)
              // //   .setData(notification.data)
              //   .android.setChannelId('test-channel') // e.g. the id you chose above
              //   .android.setSmallIcon('ic_app_icon') // create this icon in Android Studio
              //   .android.setColor('#000000') // you can set a color here
              //   .android.setPriority(firebase.notifications.Android.Priority.High);
              
              
              // notifications
              //   .displayNotification(localNotification)
              //   .catch(err => console.error("Notification Display Error: ", err));
          }
          
        })

        BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressed);


        if (this.props.branch == 'learn') {
          navigationService.navigate(pages.LEARN_SWITCH);
        }
        else if (this.props.branch == 'teach') {
          if(this.props.bank.express == null) {
            navigationService.navigate(pages.BANK_EDIT, {bank: this.props.bank});
          } else {
            navigationService.navigate(pages.TEACH_SWITCH);
          }
        } else {
          navigationService.navigate(pages.LEARN_SWITCH);
        }
          
    }

    componentWillUnmount() {
      this.notificationOpenListener();
      this.notificationListener();

      BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressed);
    }

    render () {
        return (
            <Page>
                <View style={styles.container} >
                    <Text style={styles.loadText}>Loading...</Text>
                    <ActivityIndicator size={'large'} />
                </View>
            </Page>
            
        )
    }
};

ContentLoading.navigatorStyle = {
    navBarHidden: true,
    statusBarBlur: false
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    loadText: {
        paddingBottom: getHeight(10),
        color: BLACK_PRIMARY,
        fontFamily: 'Montserrat-Bold',
    }
});

const mapStateToProps = (state) => ({
  branch: state.branch.branch,
  user: state.user,
  bank: state.bank,
})

export default connect(mapStateToProps)(ContentLoading);