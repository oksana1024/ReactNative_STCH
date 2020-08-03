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
import Notification from '../components/icons/notification';
import {getHeight, getWidth} from '../constants/dynamicSize';
import {connect} from 'react-redux';
import navigationService from '../navigation/navigationService';
import pages from '../constants/pages';
import {firestore} from '../constants/firebase';
import _ from 'lodash';
import {changeAppBranch} from '../model/actions/branchAC';


class LearnMatches extends Component {

  constructor(props) {
    super(props);

    this.state = {
      sessionData : [],
      prevLearnSession: {},
      loading: false
    }

    this.learnListener = null;
  }

    _gotoHome = () => {
      // navigationService.popToTop();
    }

    _gotoTeachMatches = () => {
      const {dispatch} = this.props;
      
      if(this.props.bank.express == null) {
        navigationService.navigate(pages.BANK_EDIT, {bank: this.props.bank});
      } else {
        dispatch(changeAppBranch('teach'));
        navigationService.navigate(pages.TESESSION_STACK);
      }
      // navigationService.navigate(pages.TESESSION_STACK)
    }

    _gotoSession = (session) => {
      console.log("Session ===== ", session)
      navigationService.push(pages.LESESSION_NEW, {sessionData: session});
    }

    _renderItem = (item) => {
      let oneItem = item.item;
      return (
        <TouchableOpacity 
          style={styles.listItem}
          onPress={() => {this._gotoSession(oneItem)}}
        >
          <View style={{flex: 1}}>
            <Text style={styles.listName}>
              {oneItem.name}
            </Text>
            <Text style={styles.listDesc}>
              {oneItem.time} - {oneItem.problemName}
            </Text>
          </View>
          {
            oneItem.newExist == true ?
            <Notification size={getHeight(18)} color={'#FF0000'}/>
            :
            null
          }
        </TouchableOpacity>
      )
    }

    static getDerivedStateFromProps (props, state) {
      let learnData = props.learnSession;
      // let teachData = props.teachSession;
      if (state.prevLearnSession != learnData) {
        let learnArray = _.map(learnData, (item) => {
          let a = new Date(item.lastUpdate);
          let year = a.getFullYear() - 2000;
          let month = a.getMonth() + 1;
          let date = a.getDate();
          let newItem = {
            id: item.problemId,
            type: 'learn', 
            teacherPhoneNumber: item.teacherPhoneNumber,
            acceptance: item.acceptance,
            name: item.teacherName ? item.teacherName : '',
            userId: item.teacherId,
            problemId: item.problemId,
            subject: item.subject,
            newExist: item.acceptance == false ? true : false,
            lastUpdate: item.lastUpdate,
            time: month + '/' + date + '/' + year,
            problemName: item.problemName ? item.problemName : ''
          }
          
          return newItem;
        });
        
        // let sortedArray = _.orderBy(learnArray, ['newExist', 'lastUpdate'], ['desc', 'desc']);
        let sortedArray = _.orderBy(learnArray, ['lastUpdate'], ['desc']);
        console.log("completedArray Array = ", sortedArray);
        return {
          sessionData : sortedArray,
          prevLearnSession: learnData
        }
      } else {
        return null;
      }
    }

    render () {
        return (
            <SwitchPage leftSwitch={'Learn'} rightSwitch={'Teach'} switchChange={this._gotoTeachMatches} switchValue={'left'}>
                <View style={{flex: 1, width: '100%'}}>
                    <Text
                      style={styles.titleText}
                    >
                      Matches
                    </Text>
                    <FlatList 
                      data={this.state.sessionData}
                      renderItem={this._renderItem}
                      keyExtractor={item => item.id}
                      contentContainerStyle={{}}
                      style={{flex: 1, width: '100%'}}
                    />
                    {
                      this.state.loading == true ?
                      <View style={styles.loadingWrapper}>
                        <ActivityIndicator size={'large'} />
                      </View>
                      :
                      null
                    }
                </View>
            </SwitchPage>
            
        )
    }
};

LearnMatches.navigatorStyle = {
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
      marginTop: getHeight(31),
      marginLeft: getWidth(32),
      marginBottom: getHeight(57),
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
      width: getWidth(308),
      alignSelf: 'center',
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
      color: BLACK_PRIMARY,
      marginBottom: getHeight(5)
    },
    listDesc: {
      fontFamily: 'Montserrat-Medium',
      fontSize: getHeight(14),
      color: BLACK_PRIMARY
    },
    loadingWrapper: {
      flex: 1,
      width: '100%',
      height: '100%',
      position: 'absolute',
      backgroundColor: 'rgba(200,200,200,0.7)',
      justifyContent: 'center',
      alignItems: 'center'
    },
});

const mapStateToProps = (state) => ({
  user: state.user,
  learnSession: state.ltSession.learn_session,
  bank: state.bank,
})

export default connect(mapStateToProps)(LearnMatches);