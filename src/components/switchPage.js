import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StatusBar, View, StyleSheet, Text, Platform, TouchableOpacity, Image} from 'react-native';
import {getHeight, getWidth} from '../constants/dynamicSize';
import {PURPLE_MAIN, BLUE_PRIMARY, RED_PRIMARY, BLACK_PRIMARY} from '../constants/colors';
import navigationService from '../navigation/navigationService';
import Page from './basePage';
import NavMenuButton from '../components/navMenuButton';
import Notification from '../components/icons/notification';
import {isIphoneX} from '../service/utils';
import {connect} from 'react-redux';
import Pages from '../constants/pages';
import _ from 'lodash';
import Switch from './switch/index';

const TOPBAR_LOGO = require('../assets/images/topbar-logo.png');

const containerDefault = {
  flex: 1,
  alignItems: 'center',
  width: '100%',
  paddingTop: isIphoneX ? getHeight(30) : getHeight(10),
}

const topViewDefault = {
  height: getHeight(70),
  width: '100%'
}

const forceInsetDefault ={
  top: 'never'
}

class SwitchPage extends Component {

  constructor(props) {
    super (props);

    this.state = {
      notiExist: false,
      prevLearnSession: {},
      prevTeachSession: {}
    }
  }

  static getDerivedStateFromProps (props, state) {
    let learnSessionData = props.learnSession;
    let teachSessionData = props.teachSession;
    if (_.isNil(learnSessionData) && _.isNil(teachSessionData)) 
      return {
        notiExist: false,
        prevLearnSession: learnSessionData,
        prevTeachSession: teachSessionData
      }
    if (state.prevLearnSession == learnSessionData && state.prevTeachSession == teachSessionData)
      return null;
    let filteredLearn = _.filter(learnSessionData, ['acceptance', false]);
    let filteredTeach = _.filter(teachSessionData, ['acceptance', true]);
    let secondTeach = _.filter(filteredTeach, ['confirmed', false]);
    console.log("Filtered Learn =", filteredLearn);
    
    if(!_.isEmpty(filteredLearn) || !_.isEmpty(secondTeach))
      return {
        notiExist: true,
        prevLearnSession: learnSessionData,
        prevTeachSession: teachSessionData
      }
    else
      return {
        notiExist: false,
        prevLearnSession: learnSessionData,
        prevTeachSession: teachSessionData
      }
  }

  toggleMenu = () => {
    navigationService.openDrawer();
  }

  _navigateSession = () => {
    // navigationService.navigate(Pages.SESSION);
  }

  render () {
    const {leftExist, renderTitle, children, backgroundColor, menuBtnColor, customContainer, customeTopView, forceInset, onRightClick, rightExist, notiColor, switchValue, leftSwitch, rightSwitch, switchChange} = this.props
    return (
      <Page forceInset={{...forceInsetDefault, ...forceInset}} backgroundColor={backgroundColor}>
        <View style={{...containerDefault, ...customContainer}}>
          <View style={{...topViewDefault, ...customeTopView}}>
            <View style={{position: 'absolute', bottom: getHeight(10), flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: getHeight(50), width: '100%'}}>
              {
                leftExist == false ?
                <View style={styles.rightBtn}>
                </View>
                :
                this.state.notiExist == false ? 
                <View style={{width: getWidth(40), height: getHeight(40), justifyContent: 'center', alignItems: 'center', marginLeft: getWidth(30)}}>
                  <NavMenuButton
                    buttonColor={menuBtnColor}
                    onClick={this.toggleMenu} 
                  />
                </View>
                :
                <View style={{width: getWidth(40), height: getHeight(40), justifyContent: 'center', alignItems: 'center', marginLeft: getWidth(30)}}>
                  <NavMenuButton
                    buttonColor={menuBtnColor}
                    onClick={this.toggleMenu} 
                  />
                  <View style={{position: 'absolute', bottom: getHeight(25), left: getWidth(25)}}>
                    <Notification size={getHeight(21)} color={notiColor}/>
                  </View>
                </View>
              }
              {
                <View style={styles.centerView}>
                  <View style={styles.centerLeftView}>
                    {
                      switchValue == 'left' ?
                      <Text style={styles.centerBoldText}>
                        {leftSwitch}
                      </Text>
                      :
                      <Text style={styles.centerNormalText}>
                        {leftSwitch}
                      </Text>
                    }
                  </View>
                  
                  <Switch
                    value={switchValue === 'left' ? false : true}
                    onChangeValue={switchChange}
                    activeBackgroundColor={PURPLE_MAIN}
                    inactiveBackgroundColor={PURPLE_MAIN}
                    switchWidth={getWidth(60)}
                    switchHeight={getHeight(30)}
                    buttonWidth={getHeight(20)}
                    buttonHeight={getHeight(20)}
                    buttonBorderRadius={getHeight(10)}
                  />
                  <View style={styles.centerRightView}>
                    {
                      switchValue == 'right' ?
                      <Text style={styles.centerBoldText}>
                        {rightSwitch}
                      </Text>
                      :
                      <Text style={styles.centerNormalText}>
                        {rightSwitch}
                      </Text>
                    }
                  </View>
                </View>
              }
              <View style={styles.rightBtn}>
              </View>
            </View>
          </View>
          {
            children
          }
        </View>
      </Page>
    )
  }
}

SwitchPage.defaultProps = {
  forceInset: {},
  customContainer: {},
  leftExist: true,
  rightText: '',
  renderTitle: null,
  renderRightItem: null,
  children: null,
  backgroundColor: '#FFFFFF',
  menuBtnColor: PURPLE_MAIN,
  // notiExist: false,
  rightExist: false,
  onRightClick: null,
  notiColor: RED_PRIMARY,
  switchValue: 'right',
  leftSwitch: 'Learn',
  rightSwitch: 'Teach',
  switchChange: null
};

SwitchPage.propTypes = {
  forceInset: PropTypes.object,
  customContainer: PropTypes.object,
  leftExist: PropTypes.bool,
  rightText: PropTypes.string,
  renderTitle: PropTypes.func,
  renderRightItem: PropTypes.func,
  children: PropTypes.element,
  backgroundColor: PropTypes.string,
  menuBtnColor: PropTypes.string,
  // notiExist: PropTypes.bool,
  rightExist: PropTypes.bool,
  onRightClick: PropTypes.func,
  notiColor: PropTypes.string,
  switchValue: PropTypes.string,
  leftSwitch: PropTypes.string,
  rightSwitch: PropTypes.string,
  switchChange: PropTypes.func
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingTop: getHeight(80)
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: getHeight(23),
    fontFamily: 'Montserrat-Bold',
    color: '#000000',
  },
  centerView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  centerNormalText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: getHeight(18)
  },
  centerBoldText: {
    fontFamily: 'Montserrat-Bold',
    fontSize: getHeight(18)
  },
  centerLeftView: {
    marginRight: getWidth(10)
  },
  centerRightView: {
    marginLeft: getWidth(10)
  },
  rightTitle: {
    position: 'absolute', 
    right: getWidth(16), 
    top: getHeight(15),
    fontFamily: 'Montserrat-Regular',
    color: '#FFFFFF',
    fontSize: getHeight(18)
  },
  rightBtn: {
    height: getHeight(38),
    width: getWidth(70),
  }
});

const mapStateToProps = (state) => ({
  learnSession: state.ltSession.learn_session,
  teachSession: state.ltSession.teach_session
})

export default connect(mapStateToProps)(SwitchPage);