import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ActivityIndicator,
    TouchableOpacity,
    Alert
} from 'react-native';
import {BLACK_PRIMARY, PURPLE_MAIN, GRAY_THIRD, GRAY_SECONDARY} from '../constants/colors';
import Page from '../components/basePage';
import NavPage from '../components/navPage';
import SwitchPage from '../components/switchPage';
import Vector from '../components/icons/vector';
import BaseButton from '../components/baseButton';
import Star from '../components/icons/star';
import Triangle from '../components/icons/triangle';
import RadioButton from '../components/radioButton';
import {getHeight, getWidth} from '../constants/dynamicSize';
import {connect} from 'react-redux';
import navigationService from '../navigation/navigationService';
import pages from '../constants/pages';
import { withMappedNavigationParams } from 'react-navigation-props-mapper';
import {auth, firestore} from '../constants/firebase';
import {getExpressAccount, fetchBalance} from '../controller/user';

@withMappedNavigationParams()
class LeSessionEnd extends Component {

  constructor(props) {
    super(props);

    this.state = {
      teacherRating: 0,
      loading: false,
      parterEnded: false
    }
  }


  _goBack = () => {
    if (this.state.teacherRating == 0) {
      Alert.alert(
        'Rate your Teacher!',
        '',
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
    if (this.state.loading != true){
      navigationService.popToTop();
    }
    
  }

  _saveResult = () => {
    const {sessionData, dispatch} = this.props;
    if (this.state.teacherRating == 0) {
      return;
    }

    this.setState({loading: true});
    firestore.collection('users').doc(sessionData.userId).get().then(doc => {
      let partnerData = doc.data();
      console.log("PartnerData SessionNum === ", (parseFloat(partnerData.rating) * parseInt(partnerData.sessionNum) + parseInt(this.state.teacherRating))/(parseInt(partnerData.sessionNum)+ 1));
      firestore.collection('users').doc(sessionData.userId).update({
        sessionNum: parseInt(partnerData.sessionNum) + 1,
        rating: (parseFloat(partnerData.rating) * parseInt(partnerData.sessionNum) + parseInt(this.state.teacherRating))/(parseInt(partnerData.sessionNum)+ 1)
      }).then(value => {
        this.setState({loading: false});
        dispatch(getExpressAccount());
        dispatch(fetchBalance());
        navigationService.popToTop();
      })
    });

    firestore.collection('users').doc(auth.currentUser.uid).collection('learn_session').doc(sessionData.subject.toLowerCase() + '-' + sessionData.problemId).update({
      sessionEnded: true
    });

    firestore.collection('users').doc(sessionData.userId).collection('teach_session').doc(sessionData.subject.toLowerCase() + '-' + sessionData.problemId).get().then(doc => {
      if (doc.exists) {
        if (doc.data().sessionEnded == true) {
          this.setState({parterEnded: true});
        }
      }
    })
  }

  componentDidMount() {
    console.log("")
  }

  render () {
    const {sessionData} = this.props;
    return (
        <NavPage onLeftClick={this._goBack}>
            <View style={{flex: 1, width: '100%'}}>
              {/* <Text style={styles.topText}>
                {
                this.state.parterEnded == true ?
                  `${sessionData.name} ended the tutoring session.`
                  : null
                }
              </Text> */}
              <View style={styles.selectionHeader}>
                <Text style={{fontFamily: 'Montserrat-Medium', fontSize: getHeight(24), color: BLACK_PRIMARY}}>
                  Was {sessionData.name} Helpful?
                </Text>
              </View>
              <TouchableOpacity style={styles.selectionItem}
                onPress={()=> {this.setState({teacherRating: 5})}}
              >
                  <Text style={{fontFamily: 'Montserrat-Medium', fontSize: getHeight(20), color: BLACK_PRIMARY}}>
                    5 - Superb
                  </Text>
                  <RadioButton 
                    isSelected={this.state.teacherRating == 5 ? true : false}
                    onPress={()=> {this.setState({teacherRating: 5})}}
                    size={getHeight(11)}
                  />
              </TouchableOpacity>
              <TouchableOpacity style={styles.selectionItem}
                onPress={()=> {this.setState({teacherRating: 4})}}
              >
                  <Text style={{fontFamily: 'Montserrat-Medium', fontSize: getHeight(20), color: BLACK_PRIMARY}}>
                    4 - Good
                  </Text>
                  <RadioButton 
                    isSelected={this.state.teacherRating == 4 ? true : false}
                    onPress={()=> {this.setState({teacherRating: 4})}}
                    size={getHeight(11)}
                  />
              </TouchableOpacity>
              <TouchableOpacity style={styles.selectionItem}
                onPress={()=> {this.setState({teacherRating: 3})}}
              >
                  <Text style={{fontFamily: 'Montserrat-Medium', fontSize: getHeight(20), color: BLACK_PRIMARY}}>
                    3 - Average
                  </Text>
                  <RadioButton 
                    isSelected={this.state.teacherRating == 3 ? true : false}
                    onPress={()=> {this.setState({teacherRating: 3})}}
                    size={getHeight(11)}
                  />
              </TouchableOpacity>
              <View style={styles.selectionItem}
                onPress={()=> {this.setState({teacherRating: 2})}}
              >
                  <Text style={{fontFamily: 'Montserrat-Medium', fontSize: getHeight(20), color: BLACK_PRIMARY}}>
                    2 - Not helpful
                  </Text>
                  <RadioButton 
                    isSelected={this.state.teacherRating == 2 ? true : false}
                    onPress={()=> {this.setState({teacherRating: 2})}}
                    size={getHeight(11)}
                  />
              </View>
              <TouchableOpacity style={styles.selectionItem}
                onPress={()=> {this.setState({teacherRating: 1})}}
              >
                  <Text style={{fontFamily: 'Montserrat-Medium', fontSize: getHeight(20), color: BLACK_PRIMARY}}>
                    1 - Report this teacher
                  </Text>
                  <RadioButton 
                    isSelected={this.state.teacherRating == 1 ? true : false}
                    onPress={()=> {this.setState({teacherRating: 1})}}
                    size={getHeight(11)}
                  />
              </TouchableOpacity>
              <BaseButton 
                text={'Done'}
                onClick={this._saveResult}
                buttonStyle={{marginTop: getHeight(30), backgroundColor: '#FFFFFF', alignSelf: 'center'}}
                textStyle={{color: PURPLE_MAIN}}
              />
              {
                this.state.loading == true ?
                <View style={{position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(180, 180, 180, 0.6)'}}>
                  <ActivityIndicator size={'large'}/>
                </View>
                : null
              }
            </View>
        </NavPage>
        
    )
  }
};

LeSessionEnd.navigatorStyle = {
    navBarHidden: true,
    statusBarBlur: false
};

const styles = StyleSheet.create({
  topText: {
    marginTop: getHeight(55), 
    marginBottom: getHeight(22), 
    marginLeft: getWidth(32),
    fontFamily: 'Montserrat-Medium',
    fontSize: getHeight(14),
    color: BLACK_PRIMARY
  },
  selectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: getWidth(33),
    alignSelf: 'center',
    marginBottom: getHeight(57),
    marginTop: getHeight(20)
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
  }
});

const mapStateToProps = (state) => ({
})

export default connect(mapStateToProps)(LeSessionEnd);