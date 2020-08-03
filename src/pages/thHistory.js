import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ActivityIndicator,
    Image,
    FlatList,
    TouchableOpacity
} from 'react-native';
import Page from '../components/basePage';
import MenuPage from '../components/menuPage';
import {getWidth, getHeight} from '../constants/dynamicSize';
import BaseButton from '../components/baseButton';
import MenuButton from '../components/menuButton';
import navigationService from '../navigation/navigationService';
import pages from '../constants/pages';
import {connect} from 'react-redux';
import _ from 'lodash';
import { BLACK_PRIMARY } from '../constants/colors';
import {updateSession, clearSession} from '../model/actions/sessionAC';

const LOGO_IMAGE = require('../assets/images/logo.png');

class TeachHistory extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
          teachList: [],
          userName: ''
        }
    }
    
    static getDerivedStateFromProps (props, state) {
      let problems = _.get(props.problem, 'problems', []);
      let newProblems = _.map(problems, item => {
        let subject = item.subject;
        const newSubject = subject.charAt(0).toUpperCase() + subject.slice(1);
        item.subject = newSubject;
        return item;
      })
      // console.log(props.problem);
        return {
          teachList: newProblems,
          userName: props.user.userName
        }
    }

    _renderItem = (item, index) => {
      return (
        <View style={styles.listItem}>
          <View style={styles.itemHeader}>
            <Text style={styles.listSubject}>
              {item.subject}
            </Text>
            {/* <Text style={styles.listPoster}>
              {item.userName}
            </Text> */}
          </View>
          <Image source={{uri: item.problemImage}} resizeMode={'cover'} style={{width: '100%'}} />
        </View>
      )
    }

    _moveSolvePage = (item) => {
      const {dispatch} = this.props;
      dispatch(clearSession());
      dispatch(updateSession('teach_session', item.subject.toLowerCase(), item.problemId, item));
      // console.log("Teach Problem Select =======", item.subject, item.problemId);
      navigationService.navigate(pages.TEACH_SOLVE, {subject: item.subject.toLowerCase(), problem: item});
    }

    render () {
        return (
          <MenuPage titleText={'TEACH HISTORY'}>
              <View style={styles.container}>
                <FlatList
                  style={{width: '100%'}}
                  extraData={this.state}
                  data={this.state.teachList}
                  renderItem={({ item, index }) =>
                  <TouchableOpacity style={styles.listItem} key={item.key} 
                    onPress={() => this._moveSolvePage(item)}
                  >
                    <View style={styles.itemWrapper}>
                      <View style={styles.itemHeader}>
                        <Text style={styles.listSubject}>
                          {item.subject}
                        </Text>
                        <Text style={styles.listPoster}>
                          {item.userName}
                        </Text>
                      </View>
                      <Image source={{uri: item.problemImage}} resizeMode={'contain'} style={{width: '100%', height: getHeight(200), borderRadius: getHeight(10)}} />
                    </View>
                  </TouchableOpacity>}
                  keyExtractor={(index) => index.toString()}
                />
              </View>
          </MenuPage>
        )
    }
}

TeachHistory.navigatorStyle = {
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
      height: getHeight(151),
      marginBottom: getHeight(23),
      
  },
  teachList:{
    flex: 1,
    width: '80%',
  },
  listItem: {
    width: '100%',
    backgroundColor: 'transparent',
    padding: getWidth(10),
  },
  listSubject: {
    fontFamily: 'Montserrat-Regular',
    fontSize: getHeight(16),
    color: '#FFFFFF',
  },
  listPoster: {
    fontFamily: 'Montserrat-Regular',
    fontSize: getHeight(16),
    color: '#FFFFFF',
    flex: 1
  },
  itemHeader: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: getHeight(10),
  },
  itemWrapper: {
    width: '100%',
    backgroundColor: BLACK_PRIMARY,
    borderRadius: getHeight(10),
    padding: getHeight(10)
  }
})

const mapStateToProps = (state) => ({
    subjects: state.subject,
    problem: state.myTeach,
    user: state.user
  })
  
  export default connect(mapStateToProps)(TeachHistory);