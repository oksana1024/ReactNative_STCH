import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ActivityIndicator,
    Image,
    TouchableOpacity,
    FlatList,
    Platform
} from 'react-native';
import Page from '../components/basePage';
// import MenuPage from '../components/menuPage';
import TopBarPage from '../components/topBarPage';
import SwitchPage from '../components/switchPage';
import {getWidth, getHeight} from '../constants/dynamicSize';
import navigationService from '../navigation/navigationService';
import Pages from '../constants/pages';
import SessionListItem from '../components/sessionListItem';
import {connect} from 'react-redux';
import Person from '../components/icons/person';
import {firestore, auth} from '../constants/firebase';
import { BLACK_SECONDARY, BLACK_PRIMARY, PURPLE_MAIN, GREEN_PRIMARY } from '../constants/colors';
import _ from 'lodash';
import PushNotificationIOS from "@react-native-community/push-notification-ios"



const LOGO_IMAGE = require('../assets/images/logo.png');
const WORD_LOGO = require('../assets/images/word-logo.png');

class Session extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
          sessionData : [],
          prevLearnSession: {},
          prevTeachSession: {}
        }

        this.learnListener = null;
        this.teachListener = null;
    }

    static getDerivedStateFromProps (props, state) {
      // let learnData = props.learnSession;
      // let teachData = props.teachSession;
      // if (state.prevLearnSession != learnData || state.prevTeachSession != teachData) {
      //   let learnArray = _.map(learnData, (item) => {
      //     let newItem = {
      //       id: item.problemId,
      //       type: 'learn', 
      //       teacherPhoneNumber: item.teacherPhoneNumber,
      //       acceptance: item.acceptance,
      //       name: item.teacherName ? item.teacherName : '',
      //       userId: item.teacherId,
      //       problemId: item.problemId,
      //       subject: item.subject,
      //       newExist: item.acceptance == false ? true : false,
      //       lastUpdate: item.lastUpdate,
      //       problemName: item.problemName ? item.problemName : ''
      //     }
          
      //     return newItem;
      //   });
        
  
      //   let filteredTeach = _.filter(teachData, {'acceptance': true});
  
      //   let teachArray = _.map(filteredTeach, (item) => {
      //     let newItem = {
      //       id: item.problemId,
      //       type: 'teach',
      //       subject: item.subject,
      //       acceptance: item.acceptance,
      //       confirmed: item.confirmed,
      //       lastUpdate: item.lastUpdate,
      //       newExist: item.confirmed == false ? true: false,
      //       userId: item.posterId,
      //       name: item.posterName ? item.posterName : '',
      //       problemId: item.problemId,
      //       problemName: item.problemName ? item.problemName : ''
      //     }
          
      //     return newItem
      //   })
      //   let totalArray = _.concat(learnArray, teachArray);
      //   let sortedArray = _.orderBy(totalArray, ['newExist', 'lastUpdate'], ['desc', 'desc']);
        
      //   // let completedArray = _.map(sortedArray, async item => {
      //   //   let userDoc = await firestore.collection('users').doc(item.userId).get();
      //   //   let name = userDoc.data().userName;
      //   //   let newItem = {
      //   //     ...item,
      //   //     name: name
      //   //   }
      //   //   // console.log("New Item = ", newItem);
      //   //   return newItem;
      //   // });
      //   // for (item of sortedArray) {
      //   //   let userDoc = await firestore.collection('users').doc(item.userId).get();
      //   //   item.name = userDoc.data().userName;
      //   // }
      //   console.log("completedArray Array = ", sortedArray);
      //   return {
      //     sessionData : sortedArray,
      //     prevLearnSession: learnData,
      //     prevTeachSession: teachData
      //   }
      // } else {
      //   return null;
      // }
    }

    _renderItem = (item) => {
      
      let oneItem = item.item;
      let newSubject = '';
      if (oneItem.subject !== 'cs') {
        newSubject = oneItem.subject.charAt(0).toUpperCase() + oneItem.subject.slice(1);
      } else {
        newSubject = oneItem.subject.toUpperCase();
      }
      
      const learnStyle={
        backgroundColor: BLACK_SECONDARY
      }
      const teachStyle = {
        backgroundColor: BLACK_PRIMARY
      }
      if (oneItem.newExist == true) {
        return (
          <TouchableOpacity style={styles.listItem} onPress={() => this._navigateForward(oneItem)}>
                <View style={{flexDirection: 'row'}}>
                  <View style={{justifyContent: 'flex-start', marginRight: getWidth(8)}}>
                    <Person size={getHeight(24)} color={'#FFFFFF'}/>
                  </View>
                  <View style={{justifyContent: 'flex-start', alignItems: 'flex-start'}}>
                    <Text style={styles.listMain}>
                      {oneItem.name}
                    </Text>
                    <Text style={styles.listTime}>
                      {newSubject}
                    </Text>
                  </View>
                </View>
                <Text style={styles.minusAmount}>
                  {oneItem.problemName}
                </Text>
                {
                  oneItem.type == 'learn' ?
                  <Text style={styles.plusAmount}>
                    LEARN
                  </Text>
                  :
                  <Text style={styles.plusAmount}>
                    TEACH
                  </Text>
                }
            </TouchableOpacity>
        )
      } else {
        return (
          // <SessionListItem
          //   itemStyle={oneItem.type == 'learn' ? learnStyle : teachStyle} 
          //   subject={newSubject}
          //   name={oneItem.name}
          //   newExist={oneItem.newExist}
          //   sessionType={oneItem.type}
          //   onClick={() => this._navigateForward(oneItem)}
          // />
          <TouchableOpacity style={styles.listItem} onPress={() => this._navigateForward(oneItem)}>
                <View style={{flexDirection: 'row'}}>
                  <View style={{justifyContent: 'flex-start', marginRight: getWidth(8)}}>
                    <Person size={getHeight(24)} color={'#FFFFFF'}/>
                  </View>
                  <View style={{justifyContent: 'flex-start', alignItems: 'flex-start'}}>
                    <Text style={styles.listMain}>
                      {oneItem.name}
                    </Text>
                    <Text style={styles.listTime}>
                      {newSubject}
                    </Text>
                  </View>
                </View>
                <Text style={styles.minusAmount}>
                  {oneItem.problemName}
                </Text>
                {
                  oneItem.type == 'learn' ?
                  <Text style={styles.minusAmount}>
                    LEARN
                  </Text>
                  :
                  <Text style={styles.minusAmount}>
                    TEACH
                  </Text>
                }
            </TouchableOpacity>
        )
      }
      
    }

    _navigateForward = async (sessionItem) => {
      console.log(sessionItem);
      let userDoc = await firestore.collection('users').doc(sessionItem.userId).get();
      let newSessionItem = {
        ...sessionItem,
        userData: userDoc.data()
      }
      if (sessionItem.type == 'learn') {
        if (sessionItem.newExist == true) {
          navigationService.navigate(Pages.LEARN_START, {sessionData: newSessionItem});
        } 
      } 
      if (sessionItem.type == 'teach') {
        if (sessionItem.newExist == true) {
          firestore.collection('users').doc(this.props.user.userId).collection('teach_session').doc(sessionItem.subject + '-' + sessionItem.problemId).update({
            confirmed: true,
            lastUpdate: Date.now()
          });
          navigationService.navigate(Pages.TEACH_START, {sessionData: newSessionItem});
        } 
      } 
      
    }

    async componentDidMount() {
      this.setState({loading: true});
      if (Platform.OS == 'ios') {
        PushNotificationIOS.setApplicationIconBadgeNumber(0);
      }
      
      firestore.collection('users').doc(auth.currentUser.uid).update({
        badge: 0
      })
      let stateArray = this.state.sessionData;
      let newArray = []
      for (const item of stateArray) {
        let userDoc = await firestore.collection('users').doc(item.userId).get();
        console.log("Notification User Id = ", item.userId);
        if (userDoc.exists) {
          let newItem = {
            ...item,
            name: userDoc.data().userName,
            phoneNumber: userDoc.data().phoneNumber,
            rating: userDoc.data().rating
            // userData: userDoc.data()
          };
          newArray.push(newItem);
        } else {
          newArray.push(item);
        }
      }

      this.setState({sessionData: newArray, loading: false});
    }

    async componentDidUpdate(prevProps, prevState) {
      let stateArray = this.state.sessionData;
      let newArray= [];
      let learnData = this.props.learnSession;
      let teachData = this.props.teachSession;
      if (prevState.prevLearnSession != learnData || prevState.prevTeachSession != teachData) {
        this.setState({loading: true})
        for (const item of stateArray) {
          let userDoc = await firestore.collection('users').doc(item.userId).get();
          if (userDoc.exists) {
            let newItem = {
              ...item,
              name: userDoc.data().userName,
              phoneNumber: userDoc.data().phoneNumber,
              rating: userDoc.data().rating
            };
            newArray.push(newItem);
          } else { //Already Deleted Users
            newArray.push(item);
          }
        }
        this.setState({sessionData: newArray, loading: false});
      }
      
    }

    render () {
      
        return (
          
            <TopBarPage renderTitle={this._renderTitle} titleText={'NOTIFICATIONS'} rightExist={true}>
                <View style={styles.container}>
                    <FlatList 
                      data={this.state.sessionData}
                      renderItem={this._renderItem}
                      keyExtractor={item => item.id}
                      contentContainerStyle={{flex: 1, width: '100%'}}
                      style={{flex: 1, width: '100%'}}
                    />
                </View>
                {
                  this.state.loading == true ?
                  <View style={styles.loadingWrapper}>
                    <ActivityIndicator />
                  </View>
                  : null
                }
            </TopBarPage>
        )
    }
}

Session.navigatorStyle = {
    navBarHidden: true,
    statusBarBlur: false
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        paddingTop: getHeight(56)
    },
    logoImage: {
        width: getWidth(291),
        height: getHeight(151),
        marginBottom: getHeight(23),
        
    },
    listMain: {
      fontFamily: 'Montserrat-Medium',
      fontSize: getHeight(18),
      color: '#FFFFFF'
    },
    listTime: {
      fontFamily: 'Montserrat-Medium',
      fontSize: getHeight(12),
      color: '#FFFFFF'
    },
    newListText: {
      fontFamily: 'Montserrat-Medium',
      fontSize: getHeight(18),
      color: GREEN_PRIMARY
    },
    listItem: {
      width: '100%', 
      height: getHeight(67), 
      flexDirection: 'row', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      borderBottomColor: PURPLE_MAIN, 
      borderBottomWidth: 2, 
      backgroundColor: BLACK_PRIMARY,
      paddingLeft: getWidth(30),
      paddingRight: getWidth(40)
    },
    plusAmount: {
      fontFamily: 'Montserrat-Medium',
      fontSize: getHeight(14),
      color: GREEN_PRIMARY
    },
    minusAmount: {
      fontFamily: 'Montserrat-Medium',
      fontSize: getHeight(14),
      color: 'white'
    },
    loadingWrapper: {
      position: 'absolute',
      justifyContent: 'center',
      alignItems: 'center',
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.4)'
    }
})

const mapStateToProps = (state) => ({
    user: state.user,
    learnSession: state.ltSession.learn_session,
    teachSession: state.ltSession.teach_session
  })
  
  export default connect(mapStateToProps)(Session);