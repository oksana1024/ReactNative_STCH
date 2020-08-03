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
import {changeAppBranch} from '../model/actions/branchAC';
import _ from 'lodash';


class TeachMatches extends Component {

  constructor(props) {
    super(props);

    this.state = {
      sessionData : [],
      prevTeachSession: {},
    }
  }

    componentDidMount() {
        
    }

    _gotoHome = () => {
      // navigationService.popToTop();
    }

    _gotoLearnMatches = () => {
      const {dispatch} = this.props;
      dispatch(changeAppBranch('learn'));
      navigationService.navigate(pages.LESESSION_STACK)
    }

    _gotoSession = (session) => {
      navigationService.push(pages.TESESSION_NEW, {sessionData: session});
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
      let teachData = props.teachSession;
      // let teachData = props.teachSession;
      if (state.prevTeachSession != teachData) {
        let teachArray = _.map(teachData, (item) => {
          let a = new Date(item.lastUpdate);
          let year = a.getFullYear() - 2000;
          let month = a.getMonth() + 1;
          let date = a.getDate();
          let newItem = {
            id: item.problemId,
            type: 'teach', 
            subject: item.subject,
            acceptance: item.acceptance,
            confirmed: item.confirmed,
            name: item.posterName ? item.posterName : '',
            userId: item.posterId,
            problemId: item.problemId,
            newExist: item.confirmed == false ? true : false,
            lastUpdate: item.lastUpdate,
            time: month + '/' + date + '/' + year,
            problemName: item.problemName ? item.problemName : ''
          }
          
          return newItem;
        });
        
        // let sortedArray = _.orderBy(teachArray, ['newExist', 'lastUpdate'], ['desc', 'desc']);
        let sortedArray = _.orderBy(teachArray, ['lastUpdate'], ['desc'])
        console.log("completedArray Array = ", sortedArray);
        return {
          sessionData : sortedArray,
          prevTeachSession: teachData
        }
      } else {
        return null;
      }
    }

    render () {
        return (
            <SwitchPage leftSwitch={'Learn'} rightSwitch={'Teach'} switchValue={'right'} switchChange={this._gotoLearnMatches}>
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
                </View>
            </SwitchPage>
            
        )
    }
};

TeachMatches.navigatorStyle = {
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
    }
});

const mapStateToProps = (state) => ({
  user: state.user,
  teachSession: state.ltSession.teach_session,
})

export default connect(mapStateToProps)(TeachMatches);