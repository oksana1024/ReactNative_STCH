import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ActivityIndicator,
    Image,
    TouchableOpacity,
    Modal
} from 'react-native';
import NavPage from '../components/navPage';
import {getWidth, getHeight} from '../constants/dynamicSize';
import {BLACK_PRIMARY, GRAY_SECONDARY, PURPLE_MAIN} from '../constants/colors';
import Alert from '../components/icons/alert';
import Aback from '../components/icons/aback';
import navigationService from '../navigation/navigationService';
import pages from '../constants/pages';
import Swiper from '../components/Swiper/index';
import {connect} from 'react-redux';
import _ from 'lodash';
import {fetchInitProblem, clearSubjectProblems, fetchMoreProblems} from '../controller/problem';
import {selectProblem} from '../controller/teach';
import {auth} from '../constants/firebase';
import {updateSession, clearSession} from '../model/actions/sessionAC';
import { withMappedNavigationParams} from 'react-navigation-props-mapper';
import ImageModal from 'react-native-image-modal';

@withMappedNavigationParams()
class ChooseProblem extends Component {

  constructor(props) {
    super(props);
    
    this.state={
      modalOpened: false,
      subjectArray: [
        {
          iconName: 'algebra',
          name: 'Algebra'
        },
        {
          iconName: 'physics',
          name: 'Physics'
        },
        {
          iconName: 'geometry',
          name: 'Geometry'
        },
        {
          iconName: 'chemistry',
          name: 'Chemistry'
        }
      ],
      cards: [],
      cardLength: 0,
      swipedAllCards: false,
      swipeDirection: '',
      cardIndex: 0,
      subject: '',
      newSubjectCards: false,
      modalVisible: true,
      prevProblems: {},
      swippedCards: 0,
      zoomModalVisible: false,
      checkedProblemImage: '',
      textVisible: false,
      endModalVisible: false,
    }
  }
  
  renderCard = (card, index) => {
    return (
      <View style={{width: '100%', height: getHeight(577), backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', borderRadius: getHeight(10)}}>
        {
          card != undefined ? 
          // <Image style={{width: '100%', height: '100%', borderRadius: getHeight(10)}} resizeMode={'contain'} source={{uri: card['problemImage']}} onLoad={() => {this._loadFirstImage(index)}}/>
          // <TransformableImage
          //   image={{source: { uri: card['problemImage'] }}}
          //   style={{width: '100%', height: '100%', borderRadius: getHeight(10)}}
          //   onLoad={()=>{this._loadFirstImage(index)}} 
          // />
          <ImageModal
            resizeMode="contain"
            style={{
              width: getWidth(340),
              height: getHeight(575),
              borderRadius: getHeight(10)
            }}
            swipeToDismiss={false}
            source={{
              uri: card['problemImage'],
            }}
            onLoad={() => {this._loadFirstImage(index)}}
          />
          : 
          null
        }
      </View>
    )
  };

  _loadFirstImage = (index) => {
    if (index == 0) {
      const {dispatch} = this.props;
      console.log("Fetch More Problems After first Image Loading ", this.props.subject);
      dispatch(fetchMoreProblems(this.props.subject.toLowerCase()));
    }
  }

  onSwiped = (type) => {
    this.setState({newSubjectCards: false});
    let currentSwipped = this.state.swippedCards;
    currentSwipped++;
    const {dispatch} = this.props;
    console.log(`on swiped ${currentSwipped}`);
    // if (this.state.cardLength > 3 && currentSwipped == this.state.cardLength - 3 ) {
      dispatch(fetchMoreProblems(this.props.subject.toLowerCase()));
    // }
    // if (this.state.cardLength < 3) {
      // dispatch(fetchMoreProblems(this.props.subject.toLowerCase()));
    // }
    this.setState({swippedCards: currentSwipped});
  }

  onSwipedAllCards = () => {
    this.setState({
      swipedAllCards: true,
      endModalVisible: true
    });
    this.props.returnNoProblem();
  };

  swipeLeft = () => {
    this.swiper.swipeLeft()
  };

  static getDerivedStateFromProps (props, state) {
    // const problems = props.problem;
    let problems = _.get(props.problem, 'problems', {});
    if (problems != state.prevProblems) {
      //Change into Array
      let arrayProblems = _.map(problems, (item) => {
        return item;
      });
      let filteredArray = _.filter(arrayProblems, function(item) {
        return item.posterId != auth.currentUser.uid
      });
      let sortedArray = _.orderBy(filteredArray, ['updateTime'], 'desc');
      
      //Only 1 problem should be loaded at first. When first problem is uploaded by this user, app should check next problems
      if (sortedArray.length == 0) {
        props.dispatch(fetchMoreProblems(props.subject.toLowerCase()));
      }
      if (state.cardLength == 0 && sortedArray.length != 0) {
        let newArray = [];
        newArray.push(sortedArray[0]);
        return {
          // modalVisible: sortedArray.length == 0 ? false : true,
          cards: newArray,
          prevProblems: problems,
          cardLength: 1
        }
      } else {
        return {
          // modalVisible: sortedArray.length == 0 ? false : true,
          cards: sortedArray,
          prevProblems: problems,
          cardLength: sortedArray.length
        }
      }
    } else {
      return null;
    }
  }

  _subjectSelect = (subject) => {
    this.setState({subject: subject, newSubjectCards: true});
    const {dispatch} = this.props;
    dispatch(clearSubjectProblems(subject.toLowerCase()));
    dispatch(fetchInitProblem(subject.toLowerCase()));
  }

  _swipeSelect = (index) => {
    const {cards, subject} = this.state;
    const {dispatch} = this.props;

    if (index != undefined && index != null) {
      selectProblem(this.props.subject.toLowerCase(), cards[index]);
      // let problemData = cards[index];
      // dispatch(clearSession());
      // dispatch(updateSession('teach_session', subject, problemData.problemId, cards[index]));
      // navigationService.navigate(pages.NOTI_STUDENT);
    }
  }

  _checkProblem = (index) => {
    console.log("Card Tapped! =", this.state.cards[index]);
    let checkedProblem = this.state.cards[index];
    this.setState({checkedProblemImage: checkedProblem['problemImage'], zoomModalVisible: true});
  }

  _removeZoomModal = () => {
    this.setState({zoomModalVisible: false});
  }

  _goBack = () => {
    // const {dispatch} = this.props;
    // dispatch(clearSubjectProblems(this.state.subject.toLowerCase()));
    // dispatch(fetchInitProblem(this.state.subject.toLowerCase()));
    // navigationService.pop();
    this.props.returnBack();
  }

  render () {
    const {subjects} = this.props;
    return (
        <NavPage onLeftClick={this._goBack}>
          {/* <Modal
            visible={this.state.zoomModalVisible} transparent={true}
          >
            {
              this._renderZoomModalContent()
            }
          </Modal> */}
          <View style={styles.workingPart}>
            <View style={{flex: 1, width: '100%', marginTop: getHeight(60)}}>
              {
                this.state.cards.length != 0 ?
                <Swiper
                  ref={swiper => {
                    this.swiper = swiper
                  }}
                  onSwiped={() => this.onSwiped('general')}
                  onSwipedLeft={() => this.onSwiped('left')}
                  onSwipedRight={this._swipeSelect}
                  onSwipedTop={() => this.onSwiped('top')}
                  onSwipedBottom={() => this.onSwiped('bottom')}
                  onTapCard={()=> {}}
                  cards={this.state.cards}
                  cardLength={this.state.cardLength}
                  cardIndex={this.state.cardIndex}
                  cardVerticalMargin={0}
                  renderCard={this.renderCard}
                  onSwipedAll={this.onSwipedAllCards}
                  stackSize={3}
                  stackSeparation={15}
                  useViewOverflow={true}
                  disableBottomSwipe={true}
                  disableTopSwipe={true}
                  newSubjectCards={this.state.newSubjectCards}
                  containerStyle={{justifyContent: 'center', alignItems: 'center', flex: 1, width: '100%'}}
                  overlayLabels={{
                    bottom: {
                      title: 'BLEAH',
                      style: {
                        label: {
                          backgroundColor: 'black',
                          borderColor: 'black',
                          color: 'white',
                          borderWidth: 1
                        },
                        wrapper: {
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }
                      }
                    },
                    left: {
                      title: 'Nope',
                      style: {
                        label: {
                          backgroundColor: 'black',
                          borderColor: 'black',
                          color: 'white',
                          borderWidth: 1
                        },
                        wrapper: {
                          flexDirection: 'column',
                          alignItems: 'flex-end',
                          justifyContent: 'flex-start',
                          marginTop: 30,
                          marginLeft: -80
                        }
                      }
                    },
                    right: {
                      title: 'Teach',
                      style: {
                        label: {
                          backgroundColor: 'black',
                          borderColor: 'black',
                          color: 'white',
                          borderWidth: 1
                        },
                        wrapper: {
                          flexDirection: 'column',
                          alignItems: 'flex-start',
                          justifyContent: 'flex-start',
                          marginTop: 30,
                          marginLeft: 30
                        }
                      }
                    },
                    top: {
                      title: 'SKIP',
                      style: {
                        label: {
                          backgroundColor: 'black',
                          borderColor: 'black',
                          color: 'white',
                          borderWidth: 1
                        },
                        wrapper: {
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }
                      }
                    }
                  }}
                  animateOverlayLabelsOpacity
                  animateCardOpacity
                >
                  <TouchableOpacity onPress={() => this.swiper.swipeBack()} title='Swipe Back' />
                </Swiper>
                : 
                <View style={{flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}}>
                  
                </View>
              }
            </View> 
            {/* {
              this.state.zoomModalVisible == true ?
              <View style={{flex: 1, width: '100%', zIndex: 10, position: 'absolute', left: 0, top: 0, bottom: 0, right: 0, backgroundColor: PURPLE_MAIN}}>
                <Image style={{position: 'absolute', left: 0, top: 0, width: '100%', height: '100%'}} resizeMode={'contain'} source={{uri: this.state.checkedProblemImage}}/>
                <View style={{marginTop: getHeight(35), width: '100%'}}>
                  <TouchableOpacity style={{marginLeft: getWidth(20)}} onPress={() => this._removeZoomModal()}>
                    <Aback size={getHeight(28)} color={'#FFFFFF'}/>
                  </TouchableOpacity>
                </View>
              </View>
              : null
            } */}
          </View>
          {/* {
              this.state.endModalVisible == true ?
              <View style={{flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}}>
                <View style={{width: getWidth(244), height: getHeight(262), backgroundColor: GRAY_SECONDARY, borderRadius: getHeight(10), alignItems: 'center'}}>
                  <View style={{flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center'}}>
                    <Alert width={getWidth(44)} height={getHeight(38)} color={PURPLE_MAIN} />
                    <Text style={{color: '#FFFFFF', fontFamily: 'Montserrat-Medium', fontSize: getHeight(18), marginTop: getHeight(15)}}>
                      There are no more
                    </Text>
                    <Text style={{color: '#FFFFFF', fontFamily: 'Montserrat-Medium', fontSize: getHeight(18)}}>
                      recently uploaded
                    </Text>
                    <Text style={{color: '#FFFFFF', fontFamily: 'Montserrat-Medium', fontSize: getHeight(18)}}>
                      problems in this
                    </Text>
                    <Text style={{color: '#FFFFFF', fontFamily: 'Montserrat-Medium', fontSize: getHeight(18)}}>
                      subject
                    </Text>
                  </View>
                  <TouchableOpacity style={{width: getWidth(220), height: getHeight(36), backgroundColor: '#FFFFFF', borderRadius: getHeight(10), marginBottom: getHeight(23), justifyContent: 'center', alignItems: 'center'}}
                  onPress={() =>{this._goBack()}}
                  >
                    <Text style={{color: PURPLE_MAIN, fontFamily: 'Montserrat-Medium', fontSize: getHeight(17)}}>OK</Text>
                  </TouchableOpacity>
                </View>

              </View>
              : null
            } */}
        </NavPage>
    )
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        paddingTop: getHeight(80)
    },
    headerTitle: {
      width: '100%',
      textAlign: 'center',
      fontSize: getHeight(24),
      fontFamily: 'Montserrat-Regular',
      color: '#FFFFFF',
      position: 'absolute',
      top: getHeight(20)
    },
    workingPart: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      // backgroundColor: '#f3f3f3'
    },
    title: {
      width: '100%',
      fontFamily: 'Montserrat-Medium',
      color: '#FFFFFF',
      marginTop: getHeight(11),
      fontSize: getHeight(25),
      textAlign: 'center'
    },
    dropDescText: {
      color: '#FFFFFF',
      fontFamily: 'Montserrat-Regular',
      fontSize: getHeight(18),
      marginBottom: getHeight(8)
    },
    modalPart: {
      alignSelf: 'flex-start', 
      marginLeft: getWidth(31)
    },
    belowPart: {
      flex: 1,
      width: '100%',
      justifyContent: 'flex-end'
    },
    blackPart: {
      width: '100%',
      height: getHeight(338),
      backgroundColor: BLACK_PRIMARY,
      alignItems: 'center'
    },
    uploadText: {
      color: '#FFFFFF',
      fontFamily: 'Montserrat-Bold',
      fontSize: getHeight(48),
      width: '100%',
      marginTop: getHeight(33),
      paddingLeft: getWidth(34),
      marginBottom: getHeight(40)
    },
    mListItem: {
      flexDirection: 'row',
      width: '100%',
      paddingLeft: getWidth(19),
      alignItems: 'center',
      height: getHeight(30)
    },
    modalListText: {
      fontFamily: 'Montserrat-Regular',
      fontSize: getHeight(16),
      color: '#FFFFFF',
      marginLeft: getWidth(21)
    },
    card: {
      flex: 1,
      borderRadius: 4,
      borderWidth: 2,
      borderColor: '#E8E8E8',
      justifyContent: 'center',
      backgroundColor: 'white'
    },
    text: {
      textAlign: 'center',
      fontSize: 50,
      backgroundColor: 'transparent'
    },
    done: {
      textAlign: 'center',
      fontSize: 30,
      color: 'white',
      backgroundColor: 'transparent'
    },
    bottomText: {
      fontFamily: 'Montserrat-Medium',
      fontSize: getHeight(14),
      color: '#FFFFFF',
      marginBottom: getHeight(30),
      width: '100%',
      textAlign: 'center'
    }
})

const mapStateToProps = (state) => ({
  subjects: state.subject,
  problem: state.problem
})

export default connect(mapStateToProps)(ChooseProblem);