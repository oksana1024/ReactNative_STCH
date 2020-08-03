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
import SwitchPage from '../components/switchPage';
import Vector from '../components/icons/vector';
import BaseButton from '../components/baseButton';
import Star from '../components/icons/star';
import Triangle from '../components/icons/triangle';
import Chat from '../components/icons/chat';
import Notification from '../components/icons/notification';
import {getHeight, getWidth} from '../constants/dynamicSize';
import {connect} from 'react-redux';
import navigationService from '../navigation/navigationService';
import pages from '../constants/pages';
import {auth, firestore} from '../constants/firebase';
import {withMappedNavigationParams} from 'react-navigation-props-mapper';
import ImageModal from 'react-native-image-modal';

@withMappedNavigationParams()
class TeSession extends Component {

  constructor(props) {
    super(props);

    this.unreadListener = null;
    this.studentSessionListener = null;

    this.state = {
      timer: '',
      problemImage: '',
      cancelable: false,
      unread: 0,
      endable: true
    }
  }

    _gotoSession = (session) => {
      
    }

    _goBack = () => {
      navigationService.popToTop();
    }

    _selectAvailability = () => {
      // navigationService.push(pages.SESSION_AVAILABILITY)
    }

    componentDidMount() {
      const {sessionData} = this.props;
      firestore.collection(sessionData.subject.toLowerCase()).doc(sessionData.problemId).get().then(doc => {
        if (doc.exists) {
          let problemData = doc.data();
          this.setState({problemImage: problemData.problemImage});
          console.log("sessionTime === ", problemData.sessionTime)
          // if (problemData.sessionTime) {
          //   this.setState({timer: problemData.sessionTime});
          // }
        }
      })

      // firestore.collection('users').doc(auth.currentUser.uid).collection('teach_session').doc(sessionData.subject.toLowerCase() + '-' + sessionData.problemId).get().then(doc => {
      //   if (doc.exists) {
      //     if (doc.data().sessionEnded == undefined || doc.data().sessionEnded == false) {
      //       this.setState({endable: true});
      //     } else {
      //       this.setState({endable: false});
      //     }
      //   }
      // })
      this.studentSessionListener  = firestore.collection('users').doc(sessionData.userId).collection('learn_session').doc(sessionData.subject.toLowerCase() + '-' + sessionData.problemId).onSnapshot(doc => {
        if (doc.exists && doc.data().sessionEnded == true) {
          
          firestore.collection('users').doc(auth.currentUser.uid).collection('teach_session').doc(sessionData.subject.toLowerCase() + '-' + sessionData.problemId).update({
            sessionEnded: true
          });
          if (doc.data().teacherRated == false) {
            navigationService.push(pages.TESESSION_END, {sessionData: sessionData});
          }
        }
      })

      //Count Message Unread
      this.unreadListener = firestore.collection(sessionData.subject.toLowerCase()).doc(sessionData.problemId).collection('unread').doc(auth.currentUser.uid).onSnapshot(doc => {
        if (doc.exists) {
          this.setState({unread: doc.data().number});
        }
      });
    }

    componentWillUnmount() {

      if (this.unreadListener != null) {
        this.unreadListener();
      }

      if (this.studentSessionListener != null) {
        this.studentSessionListener();
      }
    }

    _clickEndSession = () => {
      this.setState({cancelable: true});
    }

    _clickCancel = () => {
      this.setState({cancelable: false});
    }

    _clickConfirm = () => {
      const {sessionData} = this.props;
      firestore.collection('users').doc(auth.currentUser.uid).collection('teach_session').doc(sessionData.subject.toLowerCase() + '-' + sessionData.problemId).update({
        sessionEnded: true
      });
      navigationService.push(pages.TESESSION_END, {sessionData: sessionData});
    }

    _clickChat = () => {
      const {sessionData} = this.props;
      navigationService.navigate(pages.CHAT_SCREEN, {sessionData: sessionData, unread: this.state.unread, prev: 'teach_session'});
    }

    render () {
      const {sessionData} = this.props;
        return (
            <NavPage onLeftClick={this._goBack} titleText={sessionData.name} rightTime={''}>
                <View style={{flex: 1, width: '100%', alignItems: 'center'}}>
                  <View style={{height: getHeight(580), width: getWidth(340), justifyContent: 'center', alignItems: 'center'}}>
                    <ImageModal
                      resizeMode="contain"
                      style={{
                        width: getWidth(340),
                        height: getHeight(580),
                        borderRadius: getHeight(10),
                        alignSelf: 'center'
                      }}
                      swipeToDismiss={false}
                      source={{
                        uri: this.state.problemImage,
                      }}
                    />
                  </View>
                  <View style={styles.belowPart}>
                    {
                      this.state.cancelable == true ?
                      <TouchableOpacity style={styles.btnEndSession} onPress={() => {this._clickConfirm()}}>
                        <Text style={styles.btnESText}>
                          Confirm
                        </Text>
                      </TouchableOpacity>
                      : 
                      null
                    }
                  </View>
                  <View style={styles.lastRow}>
                    {/* {
                      this.state.endable == true ?
                      <View style={{position: 'absolute', left: 0, top: 0, width: '100%', justifyContent: 'center', alignItems: 'center'}}>
                        {
                          this.state.cancelable == false ?
                          <TouchableOpacity style={styles.btnEndSession} onPress={() => {this._clickEndSession()}}>
                            <Text style={styles.btnESText}>
                              End Session
                            </Text>
                          </TouchableOpacity>
                          :
                          <TouchableOpacity style={styles.btnEndSession} onPress={() => {this._clickCancel()}}>
                            <Text style={styles.btnESText}>
                              Cancel
                            </Text>
                          </TouchableOpacity>
                        }
                      </View>
                      : null
                    } */}
                      
                      <TouchableOpacity style={{width: getWidth(50), height: getHeight(40), justifyContent: 'center', alignItems: 'center', marginRight: getWidth(30)}} onPress={() => this._clickChat()}>
                        <View>
                          <Chat size={getHeight(30)} color={PURPLE_MAIN} /> 
                        </View>
                        {
                        this.state.unread > 0 ?
                          <View style={{position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, justifyContent: 'center', alignItems: 'center', paddingBottom: getHeight(35), paddingLeft: getWidth(30)}}>
                            <Notification size={getHeight(21)} color={'red'}/>
                          </View>
                          : null
                        } 
                      </TouchableOpacity>
                  </View>
                </View>
            </NavPage>
            
        )
    }
};

TeSession.navigatorStyle = {
    navBarHidden: true,
    statusBarBlur: false
};

const styles = StyleSheet.create({
  titleText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: getHeight(16),
    color: BLACK_PRIMARY
  },
  btnEndSession: {
    width: getWidth(184),
    height: getHeight(36),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: getHeight(5)
  },
  btnESText: {
    color: BLACK_PRIMARY,
    fontSize: getHeight(18),
    fontFamily: 'Montserrat-Medium'
  },
  belowPart: {
    width: '100%',
    height: getHeight(60),
    justifyContent: 'space-evenly',
    alignItems: 'center'
  },
  lastRow: {
    width: '100%', 
    height: getHeight(40), 
    justifyContent: 'flex-start', 
    alignItems: 'flex-end',
    marginBottom: getHeight(20)
  }
});

const mapStateToProps = (state) => ({
})

export default connect(mapStateToProps)(TeSession);