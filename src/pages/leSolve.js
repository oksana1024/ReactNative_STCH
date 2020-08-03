import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ActivityIndicator,
    Image,
    TouchableOpacity,
    Dimensions,
    Modal,
    TouchableHighlight,
    KeyboardAvoidingView,
    Linking
} from 'react-native';
import MenuPage from '../components/menuPage';
import {getWidth, getHeight} from '../constants/dynamicSize';
import Chat from '../components/icons/chat';
import Star from '../components/icons/star';
import BStar from '../components/icons/bstar';
import navigationService from '../navigation/navigationService';
import pages from '../constants/pages';
import { BLACK_PRIMARY, GREEN_PRIMARY, PURPLE_MAIN } from '../constants/colors';
import {firestore, auth} from '../constants/firebase';
import {updateReadStatus} from '../controller/chat';
import {connect} from 'react-redux';
import Close from '../components/icons/close';
import {withMappedNavigationParams} from 'react-navigation-props-mapper';
import Notification from '../components/icons/notification';
import TimerComponent from '../components/timeComponent';

const LOGO_IMAGE = require('../assets/images/logo.png');
const EXAMPLE_IMAGE = require('../assets/images/example.png');
const MARK_IMAGE = require('../assets/images/square-logo.png');
const SOLUTION_EXAMPLE = require('../assets/images/solution-example.png');

const SCREEN_HEIGHT = Dimensions.get('window').height > Dimensions.get('window').width ? Dimensions.get('window').height : Dimensions.get('window').width;



@withMappedNavigationParams()
class LearnSolve extends Component {

  constructor(props) {
    super(props);

    this.state={
      modalVisible: false,
      problemUri: '',
      problemData: {},
      subject: '',
      teacherName: '',
      teacherRate: 0,
      answer: '',
      chatting: false,
      prevTeacherId: '',
      messages: [
        {
          _id: 1,
          text: 'Hello developer',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            // avatar: 'https://placeimg.com/140/140/any',
          },
        }
      ],
      phoneNumber: '',
      displayTimer: '',
      prevProblemId: '',
      imageModalVisible: false,
      sessionEnded: false,
      messageExist: false,
      timerStarted: false,
      timerStartedAt: 0,
      confirmModalVisible: false
    }

    this.sessionListener = null;
    this.myTimer = null;
    this.timerDuration = 60 * 10;
    this.timerDisplay = '10:00';
    this.messageListener = null;
   
  }
    
    learnClick = () => {
        navigationService.navigate(pages.LEARN_SUBJECT);
    }

    _callTeacher = () => {
      if (this.state.timerStarted == true) {
        let url = `tel:${this.state.phoneNumber}`;
        Linking.canOpenURL(url)
          .then((supported) => {
            this.setState({loading: false});
            if (!supported) {
              console.log("Can't handle phone call url: " + url);
            } else {
              return Linking.openURL(url);
            }
          })
          .catch((err) => {
            console.error('An error occurred to call phone', err)
          });
      }
    }   

    _renderTitle = () => {
      if (this.state.problemData.teacherId !== undefined) {
        return (
          <TouchableOpacity style={{justifyContent: 'center', alignItems: 'center', flex: 1}}
            onPress={() => {this._callTeacher()}}
          >
            <Text style={styles.titleText}>
              {this.state.teacherName}
            </Text>
            {
              this.state.timerStarted == true ?
              <View style={styles.titlePhone}>
                <Text style={styles.titleText}>
                  {this.state.phoneNumber}
                </Text>
              </View>
              
              : null
            }
          </TouchableOpacity>
        )
      }
      else {
        return null;
      }
    }

    _renderRightItem = () => {
      let diff = 0
      if (this.state.timerStartedAt != 0) {
        diff = Math.floor((Date.now() - this.state.timerStartedAt)/1000);
      }
      let display = 600 - diff;
      return (
        <View style={{width: getWidth(50), marginRight: getWidth(33)}}>
          {
            this.state.timerStarted == true ?
            <TimerComponent 
              until={display}
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

    _getTeacherName = (teacherId) => {
      firestore.collection('users').doc(teacherId).get().then((teacherDoc) => {
        let teacherData = teacherDoc.data();
          this.setState({teacherName: teacherData.userName});
      })
    }

    _finishSession = () => {
      this.setState({modalVisible: false})
      //Save session Result & navigate to Home page
      const {sessionData} = this.props;
      firestore.collection('users').doc(auth.currentUser.uid).collection('learn_session').doc(sessionData.subject.toLowerCase() + '-' + sessionData.problemId).update({
        sessionEnded: true
      });
      let partenerData = sessionData.userData;
      firestore.collection('users').doc(partenerData.userId).update({
        sessionNum: parseInt(partenerData.sessionNum) + 1,
        rating: (partenerData.rating * partenerData.sessionNum + this.state.teacherRate)/(partenerData.sessionNum + 1)
      })
      navigationService.reset(pages.LOADING);
    }

    _clickChat =() =>{
      const{dispatch, sessionData} = this.props;
      dispatch(updateReadStatus(sessionData.subject.toLowerCase(), sessionData.problemId));
      navigationService.navigate(pages.CHAT_SCREEN, {subject: this.state.subject, problem: this.state.problemData, prevScreen: 'leSolve', sessionData: this.props.sessionData});
      // this.setState({chatting: true});  
    }

    startTimer = (duration, display) => {
      let timer = duration, minutes, seconds;      
      
        this.myTimer = setInterval(() => {
            minutes = parseInt(timer / 60, 10);
            seconds = parseInt(timer % 60, 10);
    
            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;
    
            display = minutes + ":" + seconds;
            
            this.setState({displayTimer: display});
    
            if (--timer < 0) {
              this.setState({modalVisible: true});
                timer = duration;
              this.sessionListener();
              this.messageListener();
              clearInterval(this.myTimer);
              this.setState({displayTimer: ''});
              //Reset sessionStarted Flag in the firestore
              const {sessionData} = this.props;
              firestore.collection(sessionData.subject.toLowerCase()).doc(sessionData.problemId).update({
                sessionStarted: 0
              })
              firestore.collection('users').doc(auth.currentUser.uid).collection('learn_session').doc(sessionData.subject.toLowerCase() + '-' + sessionData.problemId).update({
                sessionEnded: true
              })
            }
        }, 1000);
      
    }

    timerFinish = () => {
      this.setState({modalVisible: true, timerStarted: false, confirmModalVisible: false});
        // timer = duration;
      this.sessionListener();
      this.messageListener();

      //Reset sessionStarted Flag in the firestore
      const {sessionData} = this.props;
      firestore.collection(sessionData.subject.toLowerCase()).doc(sessionData.problemId).update({
        sessionStarted: 0
      });
      firestore.collection('users').doc(auth.currentUser.uid).collection('learn_session').doc(sessionData.subject.toLowerCase() + '-' + sessionData.problemId).update({
        sessionEnded: true
      });
    }

    static getDerivedStateFromProps (nextprops, nextstate) {
    }

    componentDidUpdate(prevProps, prevState, snapShot) {
      
    }

    

    componentDidMount() {
      // this.startTimer(timerDuration, timerDisplay);
      const {sessionData} = this.props;
      this.setState({subject: sessionData.subject, teacherId: sessionData.userId});
      firestore.collection(sessionData.subject.toLowerCase()).doc(sessionData.problemId).get().then(doc => {
        if (doc.exists) {
          this.setState({
            problemData: doc.data(),
            problemUri: doc.data().problemImage
          })
          this.sessionListener = firestore.collection(sessionData.subject.toLowerCase()).doc(sessionData.problemId).onSnapshot((sn) => {
            let currentProblem = sn.data();
            if (currentProblem.sessionStarted > 100) { // sessionStarted has value of timestamp of teacher start to teach.
              // this.startTimer(this.timerDuration, this.timerDisplay);
              this.setState({timerStarted: true, timerStartedAt: currentProblem.sessionStarted});
            }
          })

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
      firestore.collection('users').doc(sessionData.userId).get().then((doc) => {
        this.setState({
          teacherName: doc.data().userName,
          phoneNumber: doc.data().phoneNumber,
        })
      })
    }



    setModalVisible(visible) {
      this.setState({imageModalVisible: visible});
    }

    componentWillUnmount() {
      this.messageListener();
    }

    _forceFinishSession = () => {
      const {sessionData} = this.props;
      firestore.collection('users').doc(auth.currentUser.uid).collection('learn_session').doc(sessionData.subject.toLowerCase() + '-' + sessionData.problemId).update({
        forceFinished: Date.now()
      });
      this.timerFinish();
    }

    _clickEndSession = () => {
      this.setState({confirmModalVisible: true, timerStarted: true});
    }

    render () {
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
                >
                <View style={{flex: 1, width: '100%'}}>
                  <Image style={styles.modalImage} source={{uri: this.state.problemUri}} resizeMode={'contain'}/>
                    

                    <TouchableHighlight
                      onPress={() => {
                        this.setModalVisible(!this.state.imageModalVisible);
                      }}
                      style={styles.imageCloseBtn}
                      >
                      <Close size={getHeight(20)}/>
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
                  
                  <TextInput style={{width: '80%', fontFamily: 'Montserrat-Bold', fontSize: getHeight(18), backgroundColor: '#E0E0E0', height: getHeight(350)}} multiline value={this.state.answer} editable={false} />
                </View> */}
                {
                  this.state.problemData.teacherId !== undefined ? 
                  <View style={{width: '100%', height: getHeight(40), justifyContent: 'flex-start', alignItems: 'flex-end'}}>
                    {
                      this.state.timerStarted == true ?
                      <View style={{position: 'absolute', left: 0, top: 0, width: '100%', justifyContent: 'center', alignItems: 'center'}}>
                        <TouchableOpacity style={styles.btnEndSession} onPress={() => {this._clickEndSession()}}>
                          <Text style={styles.btnESText}>
                            End Session
                          </Text>
                        </TouchableOpacity>
                      </View>
                      : null
                    }
                    <TouchableOpacity style={{width: getWidth(50), height: getHeight(40), justifyContent: 'center', alignItems: 'center', marginRight: getWidth(30)}} onPress={() => this._clickChat()}>
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
                  : null
                }
                {
                  this.state.confirmModalVisible == true ?
                  <View style={styles.modalContainerView}>
                    <View style={styles.modalView}>
                      <View style={styles.modalMark}>
                        <Image style={styles.modalLogoLeft} source={MARK_IMAGE} resizeMode={'contain'} /> 
                      </View>
                      <View style={styles.modalSessionView}>
                        <Text style={styles.modalTitle}>Are you sure?</Text>
                      </View>
                      
                      <View style={styles.modalBtnPrimary}>
                        <TouchableOpacity style={styles.modalBtn} onPress={() => {this._forceFinishSession()}}>
                          <Text style={styles.modalBtnText}>
                            Yes
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <View style={styles.modalBtnView}>
                        <TouchableOpacity style={styles.modalBtn} onPress={() => {this.setState({confirmModalVisible: false, timerStarted: true})}}>
                          <Text style={styles.modalBtnText}>
                            Cancel
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                  : null
                }
                {
                  this.state.modalVisible == true ? 
                  <View style={styles.modalContainerView}>
                    <View style={styles.modalView}>
                      <View style={styles.modalMark}>
                        <Image style={styles.modalLogoLeft} source={MARK_IMAGE} resizeMode={'contain'} /> 
                      </View>
                      <View style={styles.modalTitleView}>
                        <Text style={styles.modalTitle}>Rate Your Teacher</Text>
                      </View>
                      <View style={styles.starView}>
                        <TouchableOpacity onPress={() => {this.setState({teacherRate: 1})}}>
                          {
                            this.state.teacherRate > 0 ? 
                            <Star width={getWidth(28)} height={getHeight(27)} color={GREEN_PRIMARY} />
                            :
                            <BStar width={getWidth(28)} height={getHeight(27)} color={'#FFFFFF'} stroke={BLACK_PRIMARY} />
                          }
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {this.setState({teacherRate: 2})}}>
                          {
                            this.state.teacherRate > 1 ? 
                            <Star width={getWidth(28)} height={getHeight(27)} color={GREEN_PRIMARY} />
                            :
                            <BStar width={getWidth(28)} height={getHeight(27)} color={'#FFFFFF'} stroke={BLACK_PRIMARY} />
                          }
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {this.setState({teacherRate: 3})}}>
                          {
                            this.state.teacherRate > 2 ? 
                            <Star width={getWidth(28)} height={getHeight(27)} color={GREEN_PRIMARY} />
                            :
                            <BStar width={getWidth(28)} height={getHeight(27)} color={'#FFFFFF'} stroke={BLACK_PRIMARY} />
                          }
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {this.setState({teacherRate: 4})}}>
                          {
                            this.state.teacherRate > 3 ? 
                            <Star width={getWidth(28)} height={getHeight(27)} color={GREEN_PRIMARY} />
                            :
                            <BStar width={getWidth(28)} height={getHeight(27)} color={'#FFFFFF'} stroke={BLACK_PRIMARY} />
                          }
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {this.setState({teacherRate: 5})}}>
                          {
                            this.state.teacherRate > 4 ? 
                            <Star width={getWidth(28)} height={getHeight(27)} color={GREEN_PRIMARY} />
                            :
                            <BStar width={getWidth(28)} height={getHeight(27)} color={'#FFFFFF'} stroke={BLACK_PRIMARY} />
                          }
                        </TouchableOpacity>
                      </View>
                      
                      <View style={styles.modalTimeView}>
                        <Text style={styles.modalTime}>
                          $0.00
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
              </View>
                
          </MenuPage>
        )
    }
}

LearnSolve.navigatorStyle = {
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
    titlePhone:{
      borderColor: BLACK_PRIMARY,
      borderBottomWidth: 1
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
      height: getHeight(67)
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
    modalSessionView: {
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1
    },
    modalTitle: {
      fontFamily: 'Montserrat-Medium',
      fontSize: getHeight(20),
      color: '#FFFFFF'
    },
    phoneNum: {
      fontFamily: 'Montserrat-Medium',
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
    modalBtnPrimary: {
      flex: 1,
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: getHeight(10)
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
      fontFamily: 'Montserrat-Regular',
      fontSize: getHeight(18),
      color: BLACK_PRIMARY
    },
    modalContainerView:{
      justifyContent: 'center', 
      alignItems: 'center', 
      position: 'absolute',
      top: 0, 
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.4)'
    },
    imageCloseBtn: {
      position: 'absolute',
      top: getHeight(40),
      left: getWidth(20),
    },
    modalImage: {
      flex: 1,
      width: '100%'
    },
    btnEndSession: {
      width: getWidth(184),
      height: getHeight(36),
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(58, 58, 60, 0.8)',
      borderRadius: getHeight(5)
    },
    btnESText: {
      color: '#FFFFFF',
      fontSize: getHeight(18),
      fontFamily: 'Montserrat-Medium'
    }
})

const mapStateToProps = (state) => ({
  messages: state.chat,
  session: state.session
})

export default connect(mapStateToProps)(LearnSolve);