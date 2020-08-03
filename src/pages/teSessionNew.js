import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ActivityIndicator,
    TouchableOpacity,
    FlatList
} from 'react-native';
import {BLACK_PRIMARY, PURPLE_MAIN, GRAY_THIRD} from '../constants/colors';
import Page from '../components/basePage';
import NavPage from '../components/navPage';
import BorderButton from '../components/borderButton';
import Vector from '../components/icons/vector';
import BaseButton from '../components/baseButton';
import Star from '../components/icons/star';
import Triangle from '../components/icons/triangle';
import {getHeight, getWidth} from '../constants/dynamicSize';
import {connect} from 'react-redux';
import navigationService from '../navigation/navigationService';
import pages from '../constants/pages';
import { withMappedNavigationParams } from 'react-navigation-props-mapper';
import { auth, firestore } from '../constants/firebase';
import { getAMPM } from '../service/utils';
import PushNotificationIOS from "@react-native-community/push-notification-ios"
var moment = require('moment');


@withMappedNavigationParams()
class TeSessionNew extends Component {

  constructor(props) {
    super(props);

    this.state = {
      rating: '',
      availability: 'Not available!',
      startable: false,
      deletable: false
    }

    this.sessionListener = null;
    this.timeOut = null;
  }

    _gotoSession = (session) => {
      
    }

    _goBack = () => {
      navigationService.pop();
    }

    _selectAvailability = () => {
      navigationService.push(pages.SESSION_AVAILABILITY)
    }

    _enterSession = () => {
      const {sessionData} = this.props;
      const studentId = sessionData.userId;

      if (this.sessionListener != null) {
        this.sessionListener()
      }

      if (sessionData.newExist == true) {
        firestore.collection('users').doc(auth.currentUser.uid).collection('teach_session').doc(sessionData.subject.toLowerCase() + '-' + sessionData.problemId).update({
          confirmed: true,
          lastUpdate: Date.now()
        });
        firestore.collection('users').doc(studentId).collection('learn_session').doc(sessionData.subject.toLowerCase() + '-' + sessionData.problemId).update({
          teacherJoined: true,
          lastUpdate: Date.now()
        }).catch(error => {
          console.log("Student's learn session updating error == ", error);
        });
      } else {
        firestore.collection('users').doc(auth.currentUser.uid).collection('teach_session').doc(sessionData.subject.toLowerCase() + '-' + sessionData.problemId).update({          
          lastUpdate: Date.now()
        });
      }
      
      navigationService.push(pages.TEACH_SESSION, {sessionData: sessionData});
    }

    componentDidMount() {
      const {sessionData} = this.props;
      const studentId = sessionData.userId;

      if (sessionData.newExist == false) {
        this.setState({startable: true});
      }

      if (sessionData.newExist == true && this.props.user.badge > 0) {
        if (Platform.OS == 'ios') {
          // PushNotificationIOS.setApplicationIconBadgeNumber(0);
          PushNotificationIOS.getApplicationIconBadgeNumber((number) => {
            if (number > 0)
            PushNotificationIOS.setApplicationIconBadgeNumber(number - 1);
          })
        }
        firestore.collection('users').doc(auth.currentUser.uid).update({
          badge: this.props.user.badge - 1
        })
      }

      firestore.collection('users').doc(studentId).get().then(doc => {
        let studentData = doc.data();
        this.setState({rating: studentData.rating.toFixed(2)});
      })

      this.sessionListener = firestore.collection('users').doc(auth.currentUser.uid).collection('teach_session').doc(sessionData.subject.toLowerCase() + '-' + sessionData.problemId).onSnapshot((doc) => {
        if (doc.exists) {
          let teachData = doc.data();
          if (teachData.sessionStartingPoint != undefined && teachData.sessionStartingPoint > 0) {
            let diff = teachData.sessionStartingPoint - Date.now();
            if (diff > 0 && this.timeOut != null) {
              clearTimeout(this.timeOut);
              this.setState({startable: false})
            }

            if (diff > 0) {
              this.timeOut = setTimeout(() => {
                this.setState({startable: true});
              }, diff)
            } else {
              this.setState({startable: true});
            }

            if (teachData.sessionStartingValue == 0 && sessionData.newExist == true) {
              this.setState({startable: true});
            }

            if(teachData.confirmed == true && teachData.sessionEnded == true) {
              this.setState({deletable: true});
            } else {
              this.setState({deletable: false});
            }

            //Make Scheduled local notification
            // PushNotificationIOS.cancelLocalNotifications({id: sessionData.problemId});
            // if (teachData.sessionStartingValue != 0 && sessionData.newExist == true) {
            //   let fireDateString = moment(teachData.sessionStartingPoint).subtract(15, 'minutes').format('YYYY-MM-DDTHH:mm:ss.sssZ');
            //   PushNotificationIOS.scheduleLocalNotification({
            //     fireDate: fireDateString,
            //     alertTitle: "Teach Session Time!",
            //     alertBody: `You can start ${sessionData.problemName} session 15 mins later.`,
            //     userInfo: {id: sessionData.problemId}
            //   })
            // }
            

            let startingTime = new Date(teachData.sessionStartingPoint);
            let endTime = new Date(teachData.sessionEndingPoint);
        
            let startingTString = getAMPM(startingTime);
            let endTString = getAMPM(endTime);
            this.setState({availability: startingTString + ' to ' + endTString});
          } else {
            this.setState({deletable: false})
          } 
        }
      })
    }

    componentWillUnmount() {
      if (this.sessionListener != null)
        this.sessionListener();

      if (this.timeOut != null) {
        clearTimeout(this.timeOut);
      }
    }

    _deleteNotification = () => {
      const {sessionData} = this.props;
      
      firestore.collection('users').doc(auth.currentUser.uid).collection('teach_session').doc(sessionData.subject.toLowerCase() + '-' + sessionData.problemId).delete().then(value => {
        navigationService.pop();
        //Clear LTSession, get New Learn Session
      })
    }

    render () {
      const {sessionData} = this.props;
        return (
            <NavPage onLeftClick={this._goBack}>
                <View style={{flex: 1, width: '100%'}}>
                  <View style={{flex: 1}}>
                    <Text
                      style={styles.titleText}
                    >
                      {sessionData.name}
                    </Text>
                    <View style={{flexDirection: 'row', alignItems: 'center', marginLeft: getWidth(32), marginBottom: getHeight(30), width: '100%'}}>
                      <View>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                          <Star width={getWidth(18)} height={getHeight(17)} color ={BLACK_PRIMARY}/>
                          <Text style={styles.ratingText}>
                            {this.state.rating}
                          </Text>
                        </View>
                        <View style={{width: '100%', height: 1, backgroundColor: GRAY_THIRD, marginTop: getHeight(15)}}></View>
                      </View>
                      <View style={{flex: 1}}>
                      </View>
                    </View>
                    <View style={{marginLeft: getWidth(32), marginBottom: getHeight(41)}}>
                      <Text style={styles.descText}>
                        As an MIT or Northwestern University
                      </Text>
                      <Text style={styles.descText}>
                        student, this session is free.
                      </Text>
                    </View>
                    <View style={{marginLeft: getWidth(32), marginBottom: getHeight(28)}}>
                      <Text style={styles.subTitle}>
                        {sessionData.name} is available:
                      </Text>
                    </View>
                    <View
                      style={styles.btnSubject}
                    >
                      <Text style={styles.btnText}>
                        {this.state.availability}
                      </Text>
                    </View>
                    <View style={{marginLeft: getWidth(32), marginBottom: getHeight(41)}}>
                      
                    </View>
                  </View>
                  <BorderButton 
                    text={'Enter session'}
                    onClick={this._enterSession}
                    disable={!this.state.startable}
                    buttonStyle={{marginBottom: getHeight(8), alignSelf: 'center'}}
                  />
                  <BorderButton 
                    text={'Delete match'}
                    onClick={this._deleteNotification}
                    disable={!this.state.deletable}
                    buttonStyle={{marginBottom: getHeight(30), alignSelf: 'center'}}
                  />
                </View>
                
            </NavPage>
            
        )
    }
};

TeSessionNew.navigatorStyle = {
    navBarHidden: true,
    statusBarBlur: false
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    titleText: {
      fontFamily: 'Montserrat-Medium',
      fontSize: getHeight(24),
      marginTop: getHeight(100),
      marginLeft: getWidth(32),
      color: BLACK_PRIMARY
    },
    subTitle: {
      fontFamily: 'Montserrat-Medium',
      fontSize: getHeight(17),
      color: BLACK_PRIMARY,
      marginLeft: getWidth(32),
    },
    descText: {
      fontFamily: 'Montserrat-Medium',
      fontSize: getHeight(14),
      width: getWidth(320),
      color: BLACK_PRIMARY
    },
    listItem: {
      width: getWidth(326),
      height: getHeight(56),
      marginLeft: getWidth(32),
      flexDirection: 'row',
      alignItems: 'center',
      paddingRight: getWidth(30),
      marginBottom: getHeight(16),
      borderColor: GRAY_THIRD,
      borderBottomWidth: 2
    },
    listName: {
      fontFamily: 'Montserrat-Medium',
      fontSize: getHeight(20),
      color: BLACK_PRIMARY
    },
    listDesc: {
      fontFamily: 'Montserrat-Medium',
      fontSize: getHeight(14),
      color: BLACK_PRIMARY
    },
    ratingText: {
      fontFamily: 'Montserrat-Medium',
      fontSize: getHeight(18),
      marginLeft: getWidth(4),
      color: BLACK_PRIMARY
    },
    subTitle: {
      fontFamily: 'Montserrat-Bold',
      fontSize: getHeight(14),
      width: getWidth(320),
      color: BLACK_PRIMARY
    },
    btnSubject: {
      width: getWidth(308),
      height: getHeight(49),
      flexDirection: 'row',
      paddingLeft: getWidth(18),     
      alignItems: 'center',
      alignSelf: 'center',
      borderColor: GRAY_THIRD,
      borderWidth: 1,
      marginBottom: getHeight(22)
    },
    btnText: {
      fontFamily: 'Montserrat-Regular',
      color: BLACK_PRIMARY,
      fontSize: getHeight(20)
    },
});

const mapStateToProps = (state) => ({
  user: state.user
})

export default connect(mapStateToProps)(TeSessionNew);