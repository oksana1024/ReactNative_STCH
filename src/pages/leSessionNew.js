import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ActivityIndicator,
    TouchableOpacity,
    Linking
} from 'react-native';
import {BLACK_PRIMARY, PURPLE_MAIN, GRAY_THIRD} from '../constants/colors';
// import Page from '../components/basePage';
import NavPage from '../components/navPage';
import BorderButton from '../components/borderButton';
// import Vector from '../components/icons/vector';
import BaseButton from '../components/baseButton';
import Star from '../components/icons/star';
import Triangle from '../components/icons/triangle';
import {getHeight, getWidth} from '../constants/dynamicSize';
import {connect} from 'react-redux';
import navigationService from '../navigation/navigationService';
import pages from '../constants/pages';
import {firestore, auth} from '../constants/firebase';
import { withMappedNavigationParams } from 'react-navigation-props-mapper';
import { getAMPM } from '../service/utils';
import PushNotificationIOS from "@react-native-community/push-notification-ios"
var moment = require('moment');

@withMappedNavigationParams()
class LeSessionNew extends Component {

  constructor(props) {
    super(props);

    this.state = {
      rating: '',
      availability: '',
      startable: false,
      changable: false,
      sessionBtnText: 'Not Available',
      startingValue: 0,
      sessionDuration: 1,
      deletable: true
    }

    this.sessionListener = null;
  }

    _gotoSession = (session) => {
      
    }

    _goBack = () => {
      navigationService.pop();
    }

    _selectAvailability = () => {
      navigationService.push(pages.SESSION_AVAILABILITY, {avaSet: (starting, duration) => {this._setSessionParam(starting, duration)}, startingValue: this.state.startingValue, sessionDuration: this.state.sessionDuration})
    }

    _setSessionParam = (starting, duration) => {
      this.setState({startingValue: starting, sessionDuration: duration});
      let startingPoint = Date.now() + starting * 1000 * 3600;
      let endPoint = Date.now() + (starting + duration) * 1000 * 3600;
      let startingTime = new Date(startingPoint);
      let endTime = new Date(endPoint);
      
      let startingTString = getAMPM(startingTime);
      let endTString = getAMPM(endTime);

      const {sessionData}  = this.props;

      //Scheduled Local Notification Before 15 mins for user's reminding
      // PushNotificationIOS.cancelLocalNotifications({id: sessionData.problemId}); 
      // if (starting != 0) {
      //   let fireDateString = moment().add(starting, 'hours').subtract(15, 'minutes').format('YYYY-MM-DDTHH:mm:ss.sssZ');
      //   PushNotificationIOS.scheduleLocalNotification({
      //     fireDate: fireDateString,
      //     alertTitle: "Learn Session Time!",
      //     alertBody: `You can start ${sessionData.problemName} session 15 mins later.`,
      //     userInfo: {id: sessionData.problemId}
      //   })
      // }

      // console.log("TESTESTSTESTSETESTSETSETESTSETEST");
      //For my learn session
      firestore.collection('users').doc(auth.currentUser.uid).collection('learn_session').doc(sessionData.subject.toLowerCase() + '-' + sessionData.problemId).update({
        sessionStartingPoint: startingPoint,
        sessionEndingPoint: endPoint,
        sessionStartingValue: starting,
        sessionDuration: duration,
        acceptance: true,
        lastUpdate: Date.now()
      })

      //For teacher's teach session
      firestore.collection('users').doc(sessionData.userId).collection('teach_session').doc(sessionData.subject.toLowerCase() + '-' + sessionData.problemId).update({
        sessionStartingPoint: startingPoint,
        sessionEndingPoint: endPoint,
        sessionStartingValue: starting,
        sessionDuration: duration,
      })

      // if (starting == 0) {
      //   this.setState({startable: true});
      // } else {
      //   this.setState({startable: false});
      // }

      this.setState({availability: startingTString + ' to ' + endTString});
      navigationService.pop();
    }

    _enterSession = () => {
      const {sessionData}  = this.props;
      if (this.sessionListener != null) {
        this.sessionListener()
      }
      // if (sessionData.newExist == true) { // New Session is started fully
      //   firestore.collection('users').doc(auth.currentUser.uid).collection('learn_session').doc(sessionData.subject.toLowerCase() + '-' + sessionData.problemId).update({
      //     joined: true,
      //     shouldPay: Date.now(),
      //     lastUpdate: Date.now()
      //   }).then(value => {
      //     navigationService.push(pages.LEARN_SESSION, {sessionData: sessionData});
      //   })
      // } else {
        firestore.collection('users').doc(auth.currentUser.uid).collection('learn_session').doc(sessionData.subject.toLowerCase() + '-' + sessionData.problemId).update({
          joined: true,
          lastUpdate: Date.now()
        }).then(value => {
          
        })
        navigationService.push(pages.LEARN_SESSION, {sessionData: sessionData});
      // }
      
    }

    _deleteNotification = () => {
      const {sessionData} = this.props;
      if (sessionData.newExist == true) {
        firestore.collection('users').doc(auth.currentUser.uid).collection('learn_session').doc(sessionData.subject.toLowerCase() + '-' + sessionData.problemId).delete().then(value => {
          navigationService.pop();
          //Clear LTSession, get New Learn Session
        })
        firestore.collection(sessionData.subject.toLowerCase()).doc(sessionData.problemId).update({
          sessionExist: false,
          teacherId: ''
        })
      } else {
        firestore.collection('users').doc(auth.currentUser.uid).collection('learn_session').doc(sessionData.subject.toLowerCase() + '-' + sessionData.problemId).delete().then(value => {
          firestore.collection('users').doc(sessionData.userId).collection('teach_session').doc(sessionData.subject.toLowerCase() + '-' + sessionData.problemId).delete();
          navigationService.pop();
          //Clear LTSession, get New Learn Session
        })
      }
    }

    componentDidMount() {
      const {sessionData}  = this.props;
      const teacherId = sessionData.userId;
      console.log("Teacher ID ==== ", sessionData.userId);

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
        }).catch(error =>{
          console.log("Updating Error === ", auth.currentUser.uid);
        })
      }

      firestore.collection('users').doc(teacherId).get().then((doc) => {
        let teacherData = doc.data();
        this.setState({rating: teacherData.rating.toFixed(2)});
      });

      this.sessionListener = firestore.collection('users').doc(auth.currentUser.uid).collection('learn_session').doc(sessionData.subject.toLowerCase() + '-' + sessionData.problemId).onSnapshot((doc) => {
        if (doc.exists) {
          let learnData = doc.data();
          if (learnData.sessionStartingValue != undefined && learnData.sessionDuration != undefined) {
            this.setState({startingValue: learnData.sessionStartingValue, sessionDuration: learnData.sessionDuration});
          }

          
          if (learnData.joined == true || learnData.teacherJoined == true) {
            this.setState({changable: false})
          } else {
            this.setState({changable: true})
          }

          if (learnData.sessionStartingPoint != undefined && learnData.sessionStartingPoint > 0) {
            // let diff = Date.now() - learnData.sessionStartingPoint;
            // if (diff / 1000 / 60 < 15) {
            //   this.setState({startable: true})
            // }

            let startingTime = new Date(learnData.sessionStartingPoint);
            let endTime = new Date(learnData.sessionEndingPoint);
        
            let startingTString = getAMPM(startingTime);
            let endTString = getAMPM(endTime);
            this.setState({availability: startingTString + ' to ' + endTString});
          }

          console.log("LearnData === ", learnData);

          if (learnData.teacherJoined == true) {
            this.setState({startable: true, sessionBtnText: 'Enter session'});

            if (learnData.teacherRated == false) {
              this.setState({deletable: false}); //If teaching request is accepted and teacher don't rate the student, student can not delete the session
            } else {
              this.setState({deletable: true});
            }
          } else {
            if (learnData.sessionStartingPoint === undefined || learnData.sessionStartingPoint == 0) {
              this.setState({deletable: true});
            } else {
              this.setState({deletable: false});
            }
          }
          
        }
        
        
      })
    }

    componentWillUnmount () {
      if (this.sessionListener != null) {
        this.sessionListener()
      }
    }

    render () {
      // console.log("Props.sessionData === ", this.props.sessionData)
        return (
            <NavPage onLeftClick={this._goBack}>
                <View style={{flex: 1, width: '100%'}}>
                  <View style={{flex: 1}}>
                    <Text
                      style={styles.titleText}
                    >
                      {this.props.sessionData.name}
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
                        What time are you available to learn today?
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={styles.btnSubject}
                      onPress={() => {
                        this._selectAvailability()
                      }}
                      disabled={!this.state.changable}
                    >
                      {
                        this.state.changable == true ?
                        <Text style={styles.btnText}>
                          {
                            this.state.availability == '' ?
                            'Select availability'
                            :
                            this.state.availability
                          }
                        </Text>
                        :
                        <Text style={[styles.btnText, {color: GRAY_THIRD}]}>
                            {
                              this.state.availability == '' ?
                              'Select availability'
                              :
                              this.state.availability
                            }
                        </Text>
                      }
                      {
                        this.state.changable == true ?
                        <Triangle width={getHeight(16)} height={getHeight(16)} color={PURPLE_MAIN} />
                        :
                        <Triangle width={getHeight(16)} height={getHeight(16)} color={GRAY_THIRD} />
                      }
                    </TouchableOpacity>
                    <View style={{marginLeft: getWidth(32), marginBottom: getHeight(41)}}>
                      <Text style={styles.descText}>
                        Once your teacher has entered the session during the time you are available, you can enter and begin the session.
                      </Text>
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

LeSessionNew.navigatorStyle = {
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
      justifyContent: 'space-between',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: PURPLE_MAIN,
      alignSelf: 'center',
      paddingLeft: getWidth(8),
      paddingRight: getWidth(11),
      marginBottom: getHeight(22)
    },
    btnText: {
      fontFamily: 'Montserrat-Regular',
      color: BLACK_PRIMARY,
      fontSize: getHeight(17)
    },
});

const mapStateToProps = (state) => ({
  user: state.user
})

export default connect(mapStateToProps)(LeSessionNew);