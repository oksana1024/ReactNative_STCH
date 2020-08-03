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
// import MenuPage from '../components/menuPage';
import TopBarPage from '../components/topBarPage';
import {getWidth, getHeight} from '../constants/dynamicSize';
import BaseButton from '../components/baseButton';
import MenuButton from '../components/menuButton';
import Person from '../components/icons/person';
import navigationService from '../navigation/navigationService';
import pages from '../constants/pages';
import {connect} from 'react-redux';
import { GREEN_PRIMARY, PURPLE_MAIN, BLACK_PRIMARY } from '../constants/colors';
import {calcDiffTS} from '../service/utils';
import _ from 'lodash';

const LOGO_IMAGE = require('../assets/images/logo.png');
const WORD_LOGO = require('../assets/images/word-logo.png');
const CHASE_IMAGE = require('../assets/images/bank-chase.png');
const AMERICA_IMAGE = require('../assets/images/bank-america.png');

class TransactionHistory extends Component {
    
    constructor(props) {
        super(props);

        this.historyData = [
          {
            id: '0',
            name: 'Scott',
            time: '1d',
            amount: 2,
          },
          {
            id: '1',
            name: 'Megan',
            time: '3d',
            amount: -3,
          },
          {
            id: '2',
            name: 'John',
            time: '4d',
            amount: -3,
          },
          {
            id: '3',
            name: 'Advith',
            time: '1w',
            amount: -3,
          },
          {
            id: '4',
            name: 'Claire',
            time: '2w',
            amount: 2,
          },
          {
            id: '5',
            name: 'Peter',
            time: '1m',
            amount: -3,
          }
        ]
        this.state = {
          prevPHistory: {},
          pHistory: []
        }
    }
    learnClick = () => {
        navigationService.navigate(pages.LEARN_SUBJECT);
    }

    teachClick = () => {
        navigationService.navigate(pages.TEACH_SUBJECT);
    }
    
    static getDerivedStateFromProps (props, state) {
        console.log("Props Payment History === ", props.pHistory);
        
        if (props.pHistory != null && props.pHistory != state.prevPHistory) {
          let nowTS = Date.now();
          let hisArray = _.map(props.pHistory, item => {
            let a = new Date(item.timestamp);
            let month = a.getMonth() + 1;
            let year = a.getFullYear().toString().substr(2, 2);
            let diff = calcDiffTS(item.timestamp, nowTS);
            let newItem = {
              id: item.historyId,
              name: item.from != undefined ? 'Taught ' + item.userName : 'Learned from ' + item.userName,
              time: month + '/' + a.getDate() + '/' + year,
              amount: item.from != undefined ? item.amount / 100 + 0 : 0 - item.amount / 100,
              timestamp: item.timestamp
            }
            return newItem;
          });
          let sortedArray = _.orderBy(hisArray, ['timestamp'], ['desc']);

          return {
            prevPHistory: props.pHistory,
            pHistory: sortedArray
          }
        }
        return null;
    }

    _renderTitle = () => {
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', paddingLeft: getWidth(10)}}>
                <Image 
                    style={{width: getWidth(191), height: getHeight(28)}}
                    resizeMode={'contain'}
                    source={WORD_LOGO}
                />
            </View>
            
        )
    }

    _renderListItem =(item) => {
      console.log(item.item);
        return (
          <View style={styles.listItem}>
              <View style={{flexDirection: 'row'}}>
                <View style={{justifyContent: 'flex-start', marginRight: getWidth(8)}}>
                  <Person size={getHeight(24)} color={'#FFFFFF'}/>
                </View>
                <View style={{justifyContent: 'flex-start', alignItems: 'flex-start'}}>
                  <Text style={styles.listMain}>
                    {item.item.name}
                  </Text>
                  <Text style={styles.listTime}>
                    {item.item.time}
                  </Text>
                </View>
              </View>
              {
                item.item.amount > 0 ?
                <Text style={styles.plusAmount}>
                  +${item.item.amount}
                </Text>
                :
                <Text style={styles.minusAmount}>
                  -${0 - item.item.amount}
                </Text>
              }
          </View>
        )
    }

    _renderTitle = () =>{
      return (
        <Text style={{flex: 1, alignItems: 'center', textAlign: 'center', fontFamily: 'Montserrat-Medium', fontSize: getHeight(16), color: '#FFFFFF'}}>
          TRANSACTION HISTORY
        </Text>
      )
    }

    render () {
        return (
            <TopBarPage renderTitle={this._renderTitle}>
                <View style={styles.container}>
                    <FlatList 
                      data={this.state.pHistory}
                      renderItem={item => this._renderListItem(item)}
                      keyExtractor={item => item.id}
                      style={{height: 1, width: '100%'}}
                    />
                </View>
            </TopBarPage>
        )
    }
}

TransactionHistory.navigatorStyle = {
    navBarHidden: true,
    statusBarBlur: false
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        paddingTop: getHeight(56)
    },
    logoImage: {
        width: getWidth(291),
        height: getHeight(151),
        marginBottom: getHeight(23),
        
    },
    listMain: {
      fontFamily: 'Montserrat-Medium',
      fontSize: getHeight(18),
      color: '#FFFFFF'
    },
    listTime: {
      fontFamily: 'Montserrat-Medium',
      fontSize: getHeight(12),
      color: '#FFFFFF'
    },
    newListText: {
      fontFamily: 'Montserrat-Medium',
      fontSize: getHeight(18),
      color: GREEN_PRIMARY
    },
    listItem: {
      width: '100%', 
      height: getHeight(67), 
      flexDirection: 'row', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      borderBottomColor: PURPLE_MAIN, 
      borderBottomWidth: 2, 
      backgroundColor: BLACK_PRIMARY,
      paddingLeft: getWidth(30),
      paddingRight: getWidth(40)
    },
    plusAmount: {
      fontFamily: 'Montserrat-Medium',
      fontSize: getHeight(14),
      color: GREEN_PRIMARY
    },
    minusAmount: {
      fontFamily: 'Montserrat-Medium',
      fontSize: getHeight(14),
      color: 'red'
    }
})

const mapStateToProps = (state) => ({
    subjects: state.subject,
    pHistory: state.pHistory,
  })
  
  export default connect(mapStateToProps)(TransactionHistory);