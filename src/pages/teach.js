import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ActivityIndicator,
    Image,
    TouchableOpacity,
    Alert,
    FlatList
} from 'react-native';
import SwitchPage from '../components/switchPage';
import {getWidth, getHeight} from '../constants/dynamicSize';
import {BLACK_PRIMARY, PURPLE_MAIN, GRAY_THIRD} from '../constants/colors';
import BaseButton from '../components/baseButton';
import Triangle from '../components/icons/triangle';
import navigationService from '../navigation/navigationService';
import pages from '../constants/pages';
import RadioButton from '../components/radioButton';
import {connect} from 'react-redux';
import _ from 'lodash';
import {firestore} from '../constants/firebase';
import {fetchInitProblem, clearSubjectProblems} from '../controller/problem';
import {changeAppBranch} from '../model/actions/branchAC';

const LOGO_IMAGE = require('../assets/images/logo.png');

class TeachScreen extends Component {

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
      subject: '',
      selecting: false,
      displaySubject: '',
      noProblem: false,
      loading: false
    }
    console.log("Problem Subject === ", props.problem);

  }

  _subjectSelect = (oneItem) => {
    this.setState({subject: oneItem.name.toLowerCase(), displaySubject: oneItem.displayName})
    const {dispatch} = this.props;
    dispatch(clearSubjectProblems(oneItem.name.toLowerCase()));
    dispatch(fetchInitProblem(oneItem.name.toLowerCase()));
  }

  _gotoLearn = () => {
    const {dispatch} = this.props;
    dispatch(changeAppBranch('learn'));
    navigationService.navigate(pages.LEARN_SWITCH)
  }

  _returnBack = () => {
    this.setState({subject: ''});
    navigationService.pop();
  }

  _returnNoPorblem = () => {
    this.setState({selecting: true, subject: '', noProblem: true});
    navigationService.pop();
  }

  _forwardClick = () => {

    if (this.state.subject == '') {
      Alert.alert(
        'YOUR SUBJECT!',
        'Please select your subject.',
        [
          {
            text: 'OK',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel'
          }
        ],
        {cancelable: false}
      )
     return; 
    }

    if(this.props.bank.express == null) {
      Alert.alert(
        'Missing Bank Setup',
        'You did not setup bank to get paid.',
        [
          {
            text: 'OK',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel'
          }
        ],
        {cancelable: false}
      )
     return; 
    }
    
    navigationService.push(pages.CHOOSE_PROBLEM, {subject: this.state.subject, returnBack: () => {
      this._returnBack()
    }, returnNoProblem: () => {
      this._returnNoPorblem()
    }});
  }

  _confirmSubject = () => {
    if (this.state.subject == '') {
      this.setState({selecting: !this.state.selecting})
     return;
    }

    this.setState({loading: true});
    firestore.collection(this.state.subject)
    .where('sessionExist', '==', false)
    .get()
    .then(snapshot => {
      this.setState({loading: false});
      snapshot.forEach((doc) => {
        doc
      })
      if (snapshot.docs.length > 0) {
        this.setState({selecting: !this.state.selecting})
      } else {
        this.setState({noProblem: true})
      }
    })
      
  }

  _renderSubjects = (item) => {
    let oneItem = item.item;

    return (
      <TouchableOpacity 
        style={styles.selectionItem}
        onPress={()=> {this._subjectSelect(oneItem)}}
      >
          <Text style={{fontFamily: 'Montserrat-Medium', fontSize: getHeight(20), color: BLACK_PRIMARY}}>
            {oneItem.displayName}
          </Text>
          <RadioButton 
            isSelected={this.state.subject == oneItem.name.toLowerCase() ? true : false}
            onPress={()=> {this._subjectSelect(oneItem)}}
            size={getHeight(11)}
          />
      </TouchableOpacity>
    )
  }

    render () {
      const {subjects} = this.props;
      return (
        <SwitchPage leftSwitch={'Learn'} rightSwitch={'Teach'} switchValue={'right'} switchChange={this._gotoLearn}>
        {
          this.state.selecting == false ?
          
            <View style={{flex: 1, width: '100%'}}>
              <View style={{flex: 1}}>
                <Text
                  style={styles.titleText}
                >
                  Subject
                </Text>
                <TouchableOpacity
                  style={styles.btnSubject}
                  onPress={() => {
                    this.setState({selecting: !this.state.selecting})
                  }}
                >
                  <Text style={styles.btnText}>
                    {this.state.subject != '' ? this.state.displaySubject : 'Subject'}
                  </Text>
                  <Triangle width={getHeight(16)} height={getHeight(16)} color={PURPLE_MAIN} />
                </TouchableOpacity>
                <Text style={styles.subTitle}>
                  Solve the problem fully before
                </Text>
                <Text style={styles.subTitle}>
                  selecting it to teach.
                </Text>
                <Text style={styles.descText}>
                  It may help to write out some notes for your student in advance. Images can be shared in the tutoring session.
                </Text>
              </View>
              <BaseButton 
                  text={'Continue'}
                  onClick={this._forwardClick}
                  buttonStyle={{marginBottom: getHeight(30), backgroundColor: PURPLE_MAIN, alignSelf: 'center'}}
                  textStyle={{color: '#FFFFFF'}}
              />
            </View>
          
          :
          <View style={{flex: 1, width: '100%'}}>
            <View style={styles.selectionHeader}>
              <Text style={{fontFamily: 'Montserrat-Medium', fontSize: getHeight(24), color: BLACK_PRIMARY}}>
                Select Subject
              </Text>
              <TouchableOpacity onPress={this._confirmSubject}>
                <Text style={{fontFamily: 'Montserrat-Medium', fontSize: getHeight(18), color: PURPLE_MAIN}}>
                  Save
                </Text>
              </TouchableOpacity>
            </View>
            {
              this.state.noProblem == true ?
              <View style={styles.nopView}>
                <Text style={styles.nopText}>
                  There are no more problems left in that subject. Check back or choose another subject.
                </Text>
              </View>
              :
              <View style={{height: getHeight(75)}}>
              </View>
            }
            
            <FlatList 
              data={subjects.subject}
              renderItem={this._renderSubjects}
              keyExtractor={item => item.name}
              contentContainerStyle={{flex: 1, width: '100%'}}
              style={{flex: 1, width: '100%'}}
            />
            {
              this.state.loading == true ?
              <View style={{position: 'absolute', top: 0, left: 0, bottom: 0, right: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(200, 200, 200, 0.8)'}}>
                <ActivityIndicator size={'large'} />
              </View>
              : null
            }
          </View>
        }
        </SwitchPage>
      )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    titleText: {
      fontFamily: 'Montserrat-Medium',
      fontSize: getHeight(24),
      marginTop: getHeight(31),
      marginLeft: getWidth(32),
      marginBottom: getHeight(25),
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
      fontSize: getHeight(15),
      marginTop: getHeight(43),
      width: getWidth(302),
      alignSelf: 'center',
      color: BLACK_PRIMARY
    },
    editPart: {
      flex:1,
      height: '100%',
      width: '100%',
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
      marginBottom: getHeight(63)
    },
    problemName: {
      height: getHeight(42), 
      width: getWidth(308),
      alignSelf: 'center',
      borderColor: BLACK_PRIMARY, 
      borderBottomWidth: 1, 
      color: BLACK_PRIMARY, 
      fontFamily:  'Montserrat-Regular', 
      fontSize: getHeight(18), 
      paddingLeft: getWidth(10),
    },
    btnText: {
      fontFamily: 'Montserrat-Bold',
      color: PURPLE_MAIN,
      fontSize: getHeight(17)
    },
    photoBtn: {
      width: getWidth(308),
      height: getHeight(37),
      justifyContent: 'space-between',
      paddingHorizontal: getWidth(7),
      alignSelf: 'center',
      flexDirection: 'row',
      alignItems: 'center'
    },
    selectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      paddingHorizontal: getWidth(33),
      alignSelf: 'center',
      marginTop: getHeight(33),
    },
    selectionItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: getWidth(305),
      height: getHeight(70),
      borderBottomWidth: 2,
      borderColor: GRAY_THIRD,
      alignSelf: 'center',
      alignItems: 'center',
    },
    nopView: {
      marginLeft: getWidth(32),
      width: getWidth(305),
      marginTop: getHeight(13),
      marginBottom: getHeight(29)
    },
    nopText: {
      fontFamily:  'Montserrat-Regular', 
      fontSize: getHeight(14),
      color: BLACK_PRIMARY
    }
})

const mapStateToProps = (state) => ({
  subjects: state.subject,
  problem: state.problem,
  bank: state.bank
})

export default connect(mapStateToProps)(TeachScreen);