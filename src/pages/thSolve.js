import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ActivityIndicator,
    Image,
    TouchableOpacity,
    Alert,
    TouchableHighlight,
    TextInput,
    Modal,
    AppState
} from 'react-native';
import Page from '../components/basePage';
import MenuPage from '../components/menuPage';
import {getWidth, getHeight} from '../constants/dynamicSize';
import Chat from '../components/icons/chat';
import Star from '../components/icons/star';
import BStar from '../components/icons/bstar';
import Phone from '../components/icons/phone';
import navigationService from '../navigation/navigationService';
import pages from '../constants/pages';
import { BLACK_PRIMARY, GRAY_PRIMARY, PURPLE_MAIN, GREEN_PRIMARY } from '../constants/colors';
import {connect} from 'react-redux';
import _ from 'lodash';
import {auth, firestore} from '../constants/firebase';
import Close from '../components/icons/close';
import {withMappedNavigationParams} from 'react-navigation-props-mapper';
import Notification from '../components/icons/notification';
import TimerComponent from '../components/timeComponent';

const MARK_IMAGE = require('../assets/images/square-logo.png');


@withMappedNavigationParams()
class SOLVESCREEN extends Component {

  constructor(props) {
    super(props);

    this.state={
      modalVisible: false,
      problemUri: '',
      problemData: {},
      subject: '',
      posterName: '',
      posterRate: 0,
      prevPosterId: '',
      displayTimer: '',
      prevProblemId: '',
      phoneNumber: '',
      imageModalVisible: false,
      messageExist: false,
      timerStarted: false,
      forceSessionFinished: false,
    }

    this.timerDuration = 60 * 10;
    this.timerDisplay = '10:00';
    this.myTimer = null;
    this.messageListener = null;
    this.studentSessionListener = null;
  }
    
    learnClick = () => {
        navigationService.navigate(pages.LEARN_SUBJECT);
    }

    singupClick = () => {
        // navigationService.navigate(pages.SIGN_UP);
    }    

    _renderTitle = () => {
      return (
        <TouchableOpacity style={{justifyContent: 'center', alignItems: 'center', flex: 1, paddingRight: getWidth(66)}}
        >
          <Text style={styles.titleText}>
            {this.state.posterName}
          </Text>
          <Text style={styles.titleText}>
            
          </Text>
        </TouchableOpacity>
      )
    }

    _renderRightItem = () => {
      return (
        <View style={{position: 'absolute', right: getWidth(16)}}>
          {
            this.state.timerStarted == true ?
            <TimerComponent 
              until={600}
              onFinish={() => this.timerFinish()}
              size={20}
              timeToShow={['M', 'S']}
              showSeparator={true}
              timeLabels={{m: '', s: ''}}
              digitStyle={{backgroundColor: 'transparent'}}
            />
            : null
          }
        </View>
      )
    }

    _getPosterName = (posterId) => {
      firestore.collection('users').doc(posterId).get().then((posterDoc) => {
        let posterData = posterDoc.data();
          this.setState({posterName: posterData.userName});
      })
    }

    startTimer = (duration, display) => {
        var timer = duration, minutes, seconds;
        // let self = this;
        this.myTimer = setInterval(() => {
          //  console.log("Count Down ////////");
            minutes = parseInt(timer / 60, 10);
            seconds = parseInt(timer % 60, 10);
    
            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;
    
            display = minutes + ":" + seconds;
            this.setState({displayTimer: display});
    
            if (--timer < 0) {
              this.setState({modalVisible: true});
              this.messageListener();
              timer = duration;
              clearInterval(this.myTimer);
              const {sessionData} = this.props;
              firestore.collection('users').doc(auth.currentUser.uid).collection('teach_session').doc(sessionData.subject.toLowerCase() + '-' + sessionData.problemId).update({
                sessionEnded: true
              })
            }
        }, 1000);
    }

    timerFinish = () => {
      this.setState({modalVisible: true, timerStarted: false});
      this.messageListener();
      
      const {sessionData} = this.props;
      firestore.collection('users').doc(auth.currentUser.uid).collection('teach_session').doc(sessionData.subject.toLowerCase() + '-' + sessionData.problemId).update({
        sessionEnded: true
      })
    }

    _finishSession = () => {
      this.setState({modalVisible: false})
      //Save session Result & navigate to Home page
      const {sessionData} = this.props;
      firestore.collection('users').doc(auth.currentUser.uid).collection('teach_session').doc(sessionData.subject.toLowerCase() + '-' + sessionData.problemId).update({
        sessionEnded: true
      })
      let partenerData = sessionData.userData;
      firestore.collection('users').doc(partenerData.userId).update({
        sessionNum: parseInt(partenerData.sessionNum) + 1,
        rating: (partenerData.rating * partenerData.sessionNum + this.state.posterRate)/(partenerData.sessionNum + 1)
      })
      navigationService.reset(pages.LOADING);
    }

    _clickChat =() =>{
      // clearInterval(myTimer);
      navigationService.navigate(pages.CHAT_SCREEN, {subject: this.state.subject, problem: this.state.problemData, prevScreen: 'thSolve', sessionData: this.props.sessionData});
      // this.setState({chatting: true});  
    }

    _handleAppStateChange = (nextAppState) => {
      const {sessionData} = this.props;
      if (nextAppState == 'inactive') {
        console.log("App is closed");
        firestore.collection(sessionData.subject.toLowerCase()).doc(sessionData.problemId).update({
          teacherClosed: Date.now()
        }).then((value) => {
          // this.startTimer(this.timerDuration, this.timerDisplay);
        })
      }
    }

    componentDidMount() {
      // this.startTimer(timerDuration, timerDisplay);
      AppState.addEventListener('change', this._handleAppStateChange);
      const {sessionData} =  this.props;
      this.setState({subject: sessionData.subject});
      firestore.collection('users').doc(sessionData.userId).get().then(doc => {
        this.setState({posterName: doc.data().userName, phoneNumber: doc.data().phoneNumber});
      })
      firestore.collection(sessionData.subject.toLowerCase()).doc(sessionData.problemId).get().then(doc => {
        if (doc.exists) {
          this.setState({problemData: doc.data(), problemUri: doc.data().problemImage});
          this.messageListener = firestore.collection(sessionData.subject.toLowerCase()).doc(sessionData.problemId).collection('messages').onSnapshot(sn => {
            if (sn.docs.length > 0) {
              this.setState({messageExist: false});
              sn.forEach(doc => {
                let messageData = doc.data();
                if (messageData.sentBy != auth.currentUser.uid) {
                  this.setState({messageExist: true})
                }
              })
            }
            else
              this.setState({messageExist: false});
          })  
        }
        
      })

      this.studentSessionListener = firestore.collection('users').doc(sessionData.userId).collection('learn_session').doc(sessionData.subject.toLowerCase() + '-' + sessionData.problemId).onSnapshot((sn) => {
        if (sn.exists) {
          let studentSessionData = sn.data();
          if (studentSessionData.forceFinished != undefined && studentSessionData.forceFinished > 100) {
            // Student finished the session Before time
            this.setState({forceSessionFinished: true});
          }
        }
      })

      firestore.collection(sessionData.subject.toLowerCase()).doc(sessionData.problemId).update({
        sessionStarted: Date.now()
      }).then((value) => {
        // this.startTimer(this.timerDuration, this.timerDisplay);
        firestore.collection('users').doc(sessionData.userId).collection('learn_session').doc(sessionData.subject.toLowerCase() + '-' + sessionData.problemId).update({
          shouldPay: Date.now()
        });
        this.setState({timerStarted: true});
      })
    }

    setModalVisible(visible) {
      this.setState({imageModalVisible: visible});
    }

    componentWillUnmount() {
      this.messageListener();
      AppState.removeEventListener('change', this._handleAppStateChange);
    }

    render () {
      const {sessionData} = this.props;

      return (
        <MenuPage 
          backgroundColor={'#FFFFFF'} menuBtnColor={BLACK_PRIMARY}
          renderTitle={this._renderTitle}
          renderRightItem={this._renderRightItem}
          menuExist={false}
          >
          <Modal
            animationType="slide"
            transparent={false}
            visible={this.state.imageModalVisible}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.');
            }}>
            <View style={{flex: 1, width: '100%'}}>
              <Image style={styles.modalImage} source={{uri: this.state.problemUri}} resizeMode={'contain'}/>
                

                <TouchableHighlight
                  onPress={() => {
                    this.setModalVisible(!this.state.imageModalVisible);
                  }}
                  style={styles.imageCloseBtn}
                  >
                  <Close size={getHeight(36)}/>
                </TouchableHighlight>
              
            </View>
          </Modal>
            <View style={{flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center'}}>
              <TouchableOpacity style={styles.logoImage} onPress={() => {
                    this.setModalVisible(!this.state.imageModalVisible);
                  }}>
                <Image
                    source={{uri: this.state.problemUri}}
                    style={styles.problemImage}
                    resizeMode={'contain'}
                />
              </TouchableOpacity>
              
              {/* <View style={{width: '100%', flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                
                <TextInput style={{width: '80%', fontFamily: 'Montserrat-Bold', fontSize: getHeight(18), backgroundColor: '#E0E0E0', height: getHeight(350)}} multiline/>
              </View> */}
            
            <View style={{width: '100%', height: getHeight(50), justifyContent: 'flex-start', alignItems: 'flex-end', paddingRight: getWidth(30)}}>
              <TouchableOpacity style={{width: getWidth(50), height: getHeight(40), justifyContent: 'center', alignItems: 'center'}} onPress={() => this._clickChat()}>
                <View>
                  <Chat size={getHeight(30)} color={'#000000'} /> 
                </View>
                {
                  this.state.messageExist == true ?
                  <View style={{position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, justifyContent: 'center', alignItems: 'center', paddingBottom: getHeight(35), paddingLeft: getWidth(30)}}>
                    <Notification size={getHeight(21)}/>
                  </View> 
                  :
                  null
                }
              </TouchableOpacity>
              
            </View>
            {
              this.state.modalVisible == true ? 
              <View style={styles.modalContainerView}>
                <View style={styles.modalView}>
                  <View style={styles.modalMark}>
                    <Image style={styles.modalLogoLeft} source={MARK_IMAGE} resizeMode={'contain'} />
                  </View>
                  <View style={styles.modalTitleView}>
                  <Text style={styles.modalTitle}>Rate Your Student</Text>
                  </View>
                  <View style={styles.starView}>
                    <TouchableOpacity onPress={() => {this.setState({posterRate: 1})}}>
                      {
                        this.state.posterRate > 0 ? 
                        <Star width={getWidth(28)} height={getHeight(27)} color={GREEN_PRIMARY} />
                        :
                        <BStar width={getWidth(28)} height={getHeight(27)} color={'#FFFFFF'} stroke={BLACK_PRIMARY} />
                      }
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {this.setState({posterRate: 2})}}>
                      {
                        this.state.posterRate > 1 ? 
                        <Star width={getWidth(28)} height={getHeight(27)} color={GREEN_PRIMARY} />
                        :
                        <BStar width={getWidth(28)} height={getHeight(27)} color={'#FFFFFF'} stroke={BLACK_PRIMARY} />
                      }
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {this.setState({posterRate: 3})}}>
                      {
                        this.state.posterRate > 2 ? 
                        <Star width={getWidth(28)} height={getHeight(27)} color={GREEN_PRIMARY} />
                        :
                        <BStar width={getWidth(28)} height={getHeight(27)} color={'#FFFFFF'} stroke={BLACK_PRIMARY} />
                      }
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {this.setState({posterRate: 4})}}>
                      {
                        this.state.posterRate > 3 ? 
                        <Star width={getWidth(28)} height={getHeight(27)} color={GREEN_PRIMARY} />
                        :
                        <BStar width={getWidth(28)} height={getHeight(27)} color={'#FFFFFF'} stroke={BLACK_PRIMARY} />
                      }
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {this.setState({posterRate: 5})}}>
                      {
                        this.state.posterRate > 4 ? 
                        <Star width={getWidth(28)} height={getHeight(27)} color={GREEN_PRIMARY} />
                        :
                        <BStar width={getWidth(28)} height={getHeight(27)} color={'#FFFFFF'} stroke={BLACK_PRIMARY} />
                      }
                    </TouchableOpacity>
                  </View>
                  
                  <View style={styles.modalTimeView}>
                    <Text style={styles.modalTime}>
                      +$2.00
                    </Text>
                  </View>
                  <View style={{flex: 1}}>
                    
                  </View>
                  <View style={styles.modalBtnView}>
                    <TouchableOpacity style={styles.modalBtn} onPress={() => {this._finishSession()}}>
                      <Text style={styles.modalBtnText}>
                        Home
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              : null
            }
            {
              this.state.forceSessionFinished == true ?
              <View style={styles.modalContainerView}>
                <View style={styles.modalView}>
                  <View style={styles.modalMark}>
                    <Image style={styles.modalLogoLeft} source={MARK_IMAGE} resizeMode={'contain'} />
                  </View>
                  <View style={styles.modalTitleView}>
                    <Text style={styles.modalTitle}>Your Student finished</Text>
                    <Text style={styles.modalTitle}>this session</Text>
                  </View>
                  
                  <View style={{flex: 1}}>
                    
                  </View>
                  <View style={styles.modalBtnView}>
                    <TouchableOpacity style={styles.modalBtn} onPress={() => {this.setState({modalVisible: true, forceSessionFinished: false, timerStarted: false})}}>
                      <Text style={styles.modalBtnText}>
                        OK
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              : null
            }
          </View>
        </MenuPage>
      )  
    }
}

SOLVESCREEN.navigatorStyle = {
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
    logoImage: {
        width: getWidth(291),
        height: getHeight(600),
        marginBottom: getHeight(23),
        
    },
    problemImage: {
      width: getWidth(291),
      height: getHeight(600),
    },
    titleText:{
      fontFamily: 'Montserrat-Regular',
      fontSize: getHeight(16),
      color: BLACK_PRIMARY
    },
    modalView:{
      backgroundColor: PURPLE_MAIN,
      width: getWidth(244),
      height: getHeight(262),
      borderRadius: getHeight(10),
      justifyContent: 'flex-start',
      alignItems: 'center'
    },
    modalLogoLeft:{
      width: getWidth(80),
      height: getHeight(67),
      
    },
    modalLogoRight:{
      width: getWidth(80),
      height: getHeight(67),
      position: 'absolute',
      top: 0,
      right: 0
    },
    starView:{
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: getHeight(5)
    },
    btnView:{
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      height: getHeight(120)
    },
    modalMark: {
      marginTop: getHeight(15),
    },
    modalTitleView:{
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      height: getHeight(36)
    },
    modalTitle: {
      fontFamily: 'Montserrat-Medium',
      fontSize: getHeight(20),
      color: '#FFFFFF'
    },
    phoneNum: {
      fontFamily: 'Montserrat-Regular',
      fontSize: getHeight(18),
      color: BLACK_PRIMARY,
      marginLeft: getWidth(12)
    },
    modalTimeView: {
      width: '100%',
      marginTop: getHeight(9),
      justifyContent: 'center',
      alignItems: 'center'
    },
    modalTime: {
      fontFamily: 'Montserrat-Medium',
      fontSize: getHeight(18),
      color: '#FFFFFF'
    },
    modalBtnView: {
      flex: 1,
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: getHeight(23)
    },
    modalBtn: {
      width: getWidth(220),
      height: getHeight(36),
      backgroundColor: '#FFFFFF',
      borderRadius: getHeight(10),
      justifyContent: 'center',
      alignItems: 'center'
    },
    modalBtnText: {
      fontFamily: 'Montserrat-Medium',
      fontSize: getHeight(18),
      color: BLACK_PRIMARY
    },
    modalContainerView:{
      justifyContent: 'center', 
      alignItems: 'center', 
      backgroundColor: 'rgba(0,0,0,0.4)',
      position: 'absolute',
      top: 0, 
      left: 0,
      right: 0,
      bottom: 0
    },
    imageCloseBtn: {
      position: 'absolute',
      top: getHeight(30),
      left: getWidth(20),
    },
    modalImage: {
      flex: 1,
      width: '100%'
    }
})

const mapStateToProps = (state) => ({
  messages: state.chat,
  session: state.session
})

export default connect(mapStateToProps)(SOLVESCREEN);