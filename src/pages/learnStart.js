import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ActivityIndicator,
    TouchableOpacity,
    Image,
    FlatList
} from 'react-native';
import {BLACK_PRIMARY, PURPLE_MAIN, GREEN_PRIMARY, GRAY_SECONDARY} from '../constants/colors';
import Page from '../components/basePage';
import {getHeight, getWidth} from '../constants/dynamicSize';
import {connect} from 'react-redux';
import BaseButton from '../components/baseButton';
import navigationService from '../navigation/navigationService';
import Pages from '../constants/pages';
import Star from '../components/icons/star';
import BStar from '../components/icons/bstar';
import {firestore, auth} from '../constants/firebase';
import Alert from '../components/icons/alert';
import {withMappedNavigationParams} from 'react-navigation-props-mapper';
import {getMyLiveLearnSession, getMyLiveTeachSession, clearMyLTSession} from '../controller/ltsession';
import _ from 'lodash';
import pages from '../constants/pages';

const ICON_LOGO = require('../assets/images/icon-logo.png');
const VISA_IMAGE = require('../assets/images/visa.png');
const MASTER_IMAGE = require('../assets/images/master.png');
const AMEX_IMAGE = require('../assets/images/americanexpress.png');
const JCB_IMAGE = require('../assets/images/jcb.png');
const DISCOVER_IMAGE = require('../assets/images/discover.png');
const DINERS_IMAGE = require('../assets/images/diners-club.png');

@withMappedNavigationParams()
class LearnStart extends Component {

  constructor(props) {
    super(props);

    this.state= {
      problemData: {},
      modalVisible: false,
      paymentData: [],
      prevPayments: null,
      currentImage: '',
      currentNumber: '',
      warningVisible: false,
      firstPayment: {}
    }
  }

  componentDidMount() {
    console.log("Navigation Params =", this.props.sessionData);
    const {sessionData} = this.props;
    firestore.collection(sessionData.subject.toLowerCase()).doc(sessionData.problemId).get().then(doc => {
      this.setState({problemData: doc.data()});
    })
  }

  _gotoPayments = () => {
    // navigationService.navigate(Pages.PAYMENTS);
    if (this.state.paymentData.length == 0) {
      this.setState({warningVisible: true});
      return;
    }
    this.setState({modalVisible: true})
  }

  _addPayment = () => {
    this.setState({warningVisible: false});
    navigationService.navigate(pages.PAYMENTS);
  }

  _goLearn = () => {
    const {sessionData, user, dispatch} = this.props;
    /** Commented By Me Because students will learn freely. His stripe account will pay to the teachers */
    // if (this.state.paymentData.length == 0) {
    //   this.setState({warningVisible: true});
    //   return;
    // }
    firestore.collection('users').doc(auth.currentUser.uid).collection('learn_session').doc(sessionData.subject.toLowerCase() + '-' + sessionData.problemId).update({
      acceptance: true,
      lastUpdate: Date.now()
    });
    navigationService.navigate(Pages.LEARN_SOLVE, {sessionData: this.props.sessionData});
  }

  _cancelLearn = () => {
    // navigationService.reset(pages.LOADING);
    const {sessionData, user, dispatch} = this.props;
    
    firestore.collection('users').doc(auth.currentUser.uid).collection('learn_session').doc(sessionData.subject.toLowerCase() + '-' + sessionData.problemId).delete().then((value) => {
      dispatch(clearMyLTSession());
      dispatch(getMyLiveLearnSession());
      dispatch(getMyLiveTeachSession());
    });
    firestore.collection(sessionData.subject.toLowerCase()).doc(sessionData.problemId).update({
      sessionExist: false
    })
    navigationService.navigate(Pages.SESSION);
  }

  static getDerivedStateFromProps (props, state) {
    console.log("Payments Array = ", props.payment);
      if (props.payment != null && props.payment != state.prevPayments) {
        
        let paymentArray = _.map(props.payment, item => {
          let Brand = item.card.brand;
          let newItem = {
            id: item.cardId,
            name: Brand,
            card_name: Brand.charAt(0).toUpperCase() + Brand.slice(1) + ', ' + item.card.last4,
            number: item.card.last4,
            newItem: false
          }
          return newItem;
        })

        let firstData = paymentArray[0];
        let imageValue = '';
        switch(firstData.name) {
          case 'visa':
            imageValue = VISA_IMAGE;
            break;
          case 'mastercard':
            imageValue = MASTER_IMAGE;
            break;
          case 'amex':
            imageValue = AMEX_IMAGE;
            break;
          case 'discover':
            imageValue = DISCOVER_IMAGE;
            break;
          case 'diners':
            imageValue = DINERS_IMAGE;
            break;
          case 'jcb':
            imageValue = JCB_IMAGE;
            break;
        }
        
        return {
          paymentData: paymentArray,
          prevPayments: props.payment,
          currentImage: imageValue,
          currentNumber: firstData.number,
          firstPayment: firstData
        }
      } 
        return null;
      
      
  }

  _renderListItem =(item) => {
      switch (item.item.name) {
        case 'visa':
          return (
            <TouchableOpacity style={styles.listItem} onPress={() => this._editPayment(item.item)}>
                <Image style={{width: getWidth(24), height: getHeight(16), marginLeft: getWidth(24), marginRight: getWidth(16)}}
                  resizeMode={'contain'} source={VISA_IMAGE}
                />
                <Text style={styles.listText}>
                  {'Visa, ' + item.item.number}
                </Text>
            </TouchableOpacity>
          )
        case 'mastercard': 
          return (
            <TouchableOpacity style={styles.listItem} onPress={() => this._editPayment(item.item)}>
                <Image style={{width: getWidth(24), height: getHeight(16), marginLeft: getWidth(24), marginRight: getWidth(16)}}
                  resizeMode={'contain'} source={MASTER_IMAGE}
                />
                <Text style={styles.listText}>
                  {'Mastercard, ' + item.item.number}
                </Text>
            </TouchableOpacity>
          )
        case 'amex':
          return (
            <TouchableOpacity style={styles.listItem} onPress={() => this._editPayment(item.item)}>
                <Image style={{width: getWidth(24), height: getHeight(30), marginLeft: getWidth(24), marginRight: getWidth(16)}}
                  resizeMode={'contain'} source={AMEX_IMAGE}
                />
                <Text style={styles.listText}>
                  {'American Express, ' + item.item.number}
                </Text>
            </TouchableOpacity>
          )
        case 'discover': 
          return (
            <TouchableOpacity style={styles.listItem} onPress={() => this._editPayment(item.item)}>
                <Image style={{width: getWidth(20), height: getHeight(24), marginLeft: getWidth(24), marginRight: getWidth(16)}}
                  resizeMode={'contain'} source={DISCOVER_IMAGE}
                />
                <Text style={styles.listText}>
                  {'Discover, ' + item.item.number}
                </Text>
            </TouchableOpacity>
          )
        case 'diners':
          return (
            <TouchableOpacity style={styles.listItem} onPress={() => this._editPayment(item.item)}>
                <Image style={{width: getWidth(20), height: getHeight(24), marginLeft: getWidth(24), marginRight: getWidth(16)}}
                  resizeMode={'contain'} source={DINERS_IMAGE}
                />
                <Text style={styles.listText}>
                  {'Diners Club, ' + item.item.number}
                </Text>
            </TouchableOpacity>
          )
        case 'jcb':
          return (
            <TouchableOpacity style={styles.listItem} onPress={() => this._editPayment(item.item)}>
                <Image style={{width: getWidth(20), height: getHeight(24), marginLeft: getWidth(24), marginRight: getWidth(16)}}
                  resizeMode={'contain'} source={JCB_IMAGE}
                />
                <Text style={styles.listText}>
                  {'JCB, ' + item.item.number}
                </Text>
            </TouchableOpacity>
          )
      }
  }

  _editPayment = (paymentMethod) => {
    firestore.collection('users').doc(auth.currentUser.uid).update({
      default_paymentMethod: paymentMethod.id
    }).then((value) => {
      this.setState({modalVisible: false, currentNumber: paymentMethod.number});
      switch (paymentMethod.name) {
        case 'visa':
          this.setState({currentImage: VISA_IMAGE});
          break;
        case 'mastercard':
          this.setState({currentImage: MASTER_IMAGE});
          break;
        case 'amex': 
          this.setState({currentImage: AMEX_IMAGE});
          break;
        case 'discover':
          this.setState({currentImage: DISCOVER_IMAGE});
          break;
        case 'diners':
          this.setState({currentImage: DINERS_IMAGE});
          break;
        case 'jcb':
          this.setState({currentImage: JCB_IMAGE});
          break;
        default:
          this.setState({currentImage: DINERS_IMAGE});
          break;
      }
    }).catch(() => {
      this.setState({modalVisible: false});
    })
  }

  componentDidMount() {
    firestore.collection('users').doc(auth.currentUser.uid).update({
      default_paymentMethod: this.state.firstPayment.id
    }).then((value) => {
      
      switch (this.state.firstPayment.name) {
        case 'visa':
          this.setState({currentImage: VISA_IMAGE});
          break;
        case 'mastercard':
          this.setState({currentImage: MASTER_IMAGE});
          break;
        case 'amex': 
          this.setState({currentImage: AMEX_IMAGE});
          break;
        case 'discover':
          this.setState({currentImage: DISCOVER_IMAGE});
          break;
        case 'diners':
          this.setState({currentImage: DINERS_IMAGE});
          break;
        case 'jcb':
          this.setState({currentImage: JCB_IMAGE});
          break;
        default:
          this.setState({currentImage: DINERS_IMAGE});
          break;
      }
    }).catch(() => {
    })
  }

  render () {
    const {sessionData} = this.props;
    console.log("Learn Start sessionData = ", sessionData);
    let userRating = sessionData.userData.rating ? sessionData.userData.rating : 0;
      return (
          <Page>
              <View style={styles.container} >
                <Image style={{width: getWidth(155), height: getHeight(82)}} resizeMode={'contain'} source={ICON_LOGO}/>
                <View style={styles.modal}>
                  <View style={{flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={styles.bodyText}>{this.props.sessionData.name}</Text>
                    <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                      {
                        userRating > 0 ?
                        <Star width={getWidth(28)} height={getHeight(27)} color ={PURPLE_MAIN}/>
                        :
                        <BStar width={getWidth(28)} height={getHeight(27)} color={'#FFFFFF'} stroke={BLACK_PRIMARY} />
                      }
                      {
                        userRating > 1 ?
                        <Star width={getWidth(28)} height={getHeight(27)} color ={PURPLE_MAIN}/>
                        :
                        <BStar width={getWidth(28)} height={getHeight(27)} color={'#FFFFFF'} stroke={BLACK_PRIMARY} />  
                      }
                      {
                        userRating > 2 ?
                        <Star width={getWidth(28)} height={getHeight(27)} color ={PURPLE_MAIN}/>
                        :
                        <BStar width={getWidth(28)} height={getHeight(27)} color={'#FFFFFF'} stroke={BLACK_PRIMARY} />  
                      }
                      {
                        userRating > 3 ?
                        <Star width={getWidth(28)} height={getHeight(27)} color ={PURPLE_MAIN}/>
                        :
                        <BStar width={getWidth(28)} height={getHeight(27)} color={'#FFFFFF'} stroke={BLACK_PRIMARY} />  
                      }
                      {
                        userRating > 4 ?
                        <Star width={getWidth(28)} height={getHeight(27)} color ={PURPLE_MAIN}/>
                        :
                        <BStar width={getWidth(28)} height={getHeight(27)} color={'#FFFFFF'} stroke={BLACK_PRIMARY} />  
                      }
                    </View>
                    <Text style={styles.bodySecText}>
                      {this.props.sessionData.phoneNumber}
                    </Text>
                    {/* <Text style={styles.bodyThirdText}>
                      $0.00
                    </Text> */}
                  </View>
                  {/* <TouchableOpacity style={styles.btnBody}
                  onPress={this._gotoPayments}
                  >
                    <Text style={styles.btnText}>Home</Text>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      {
                        
                      }
                      <Image style={{width: getWidth(24), height: getHeight(15.87)}} source={this.state.currentImage}/>
                    <Text style={styles.btnText}>{this.state.currentNumber}</Text>
                    </View>
                    <Text style={styles.btnText}>
                      Change
                    </Text>
                  </TouchableOpacity> */}
                </View>
                <BaseButton 
                  text={'LEARN'}
                  onClick={this._goLearn}
                  buttonStyle={{marginTop: getHeight(113)}}
                />
                <BaseButton 
                  text={'CANCEL'}
                  onClick={this._cancelLearn}
                  buttonStyle={{marginTop: getHeight(22)}}
                />
              </View>
              {
                this.state.modalVisible == true ?
                <View style={{position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, marginVertical: getHeight(100), marginHorizontal: getWidth(30), justifyContent: 'center', alginItems: 'center', backgroundColor: BLACK_PRIMARY, borderRadius: getHeight(10), paddingVertical: getHeight(10)}}>
                  <FlatList 
                      data={this.state.paymentData}
                      renderItem={item => this._renderListItem(item)}
                      keyExtractor={item => item.id}
                      contentContainerStyle={{flex: 1, width: '100%'}}
                      style={{flex: 1, width: '100%'}}
                    />
                </View>
                : null
              }

              {
                  this.state.warningVisible == true ?
                  <View style={{flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}}>
                      <View style={{width: getWidth(244), height: getHeight(262), backgroundColor: GRAY_SECONDARY, borderRadius: getHeight(10), alignItems: 'center'}}>
                      <View style={{flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center'}}>
                          <Alert width={getWidth(44)} height={getHeight(38)} color={PURPLE_MAIN} />
                          <Text style={{color: '#FFFFFF', fontFamily: 'Montserrat-Medium', fontSize: getHeight(18), marginTop: getHeight(29)}}>
                          Please add the payment
                          </Text>
                          <Text style={{color: '#FFFFFF', fontFamily: 'Montserrat-Medium', fontSize: getHeight(18)}}>
                          method to learn.
                          </Text>
                      </View>
                      <TouchableOpacity style={{width: getWidth(220), height: getHeight(36), backgroundColor: '#FFFFFF', borderRadius: getHeight(10), marginBottom: getHeight(23), justifyContent: 'center', alignItems: 'center'}}
                      onPress={() =>{this._addPayment()}}
                      >
                          <Text style={{color: PURPLE_MAIN, fontFamily: 'Montserrat-Medium', fontSize: getHeight(17)}}>OK</Text>
                      </TouchableOpacity>
                      </View>

                  </View>
                  : null
                }
          </Page>
          
      )
  }
};

LearnStart.navigatorStyle = {
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
        color: '#FFFFFF',
        fontFamily: 'Montserrat-Bold',
    },
    modal: {
      width: getWidth(244),
      height: getHeight(262),
      backgroundColor: '#FFFFFF',
      alignItems: 'center',
      borderRadius: getHeight(10),
      marginTop: getHeight(42)
    },
    btnText: {
      fontFamily: 'Montserrat-Medium',
      color: '#FFFFFF',
      fontSize: getHeight(18),
      marginLeft: getWidth(8)
    },
    bodyText: {
      fontFamily: 'Montserrat-Medium',
      fontSize: getHeight(20),
      color: BLACK_PRIMARY
    },
    bodySecText: {
      fontFamily: 'Montserrat-Medium',
      fontSize: getHeight(15),
      color: BLACK_PRIMARY,
      height: getHeight(20),
      paddingVertical: 0,
      marginTop: getHeight(5)
    },
    bodyThirdText: {
      fontFamily: 'Montserrat-Medium',
      fontSize: getHeight(18),
      color: BLACK_PRIMARY
    },
    btnBody: {
      width: getWidth(220), 
      height: getHeight(36), 
      borderRadius: getHeight(10), 
      backgroundColor: BLACK_PRIMARY, 
      justifyContent: 'space-between',
      alignItems: 'center', 
      flexDirection: 'row',
      paddingLeft: getWidth(13),
      paddingRight: getWidth(25),
      marginBottom: getHeight(23)
    },
    listText: {
      fontFamily: 'Montserrat-Medium',
      fontSize: getHeight(18),
      color: '#FFFFFF'
    },
    newListText: {
      fontFamily: 'Montserrat-Medium',
      fontSize: getHeight(18),
      color: GREEN_PRIMARY
    },
    listItem: {
      width: '100%', 
      height: getHeight(40), 
      flexDirection: 'row', 
      alignItems: 'center', 
      borderBottomColor: PURPLE_MAIN, 
      borderBottomWidth: 2, 
      backgroundColor: BLACK_PRIMARY
    }
});

const mapStateToProps = (state) => ({
  user: state.user,
  payment: state.payment
})

export default connect(mapStateToProps)(LearnStart);