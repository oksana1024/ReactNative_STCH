import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StatusBar, View, StyleSheet, Text, Platform, TouchableOpacity, Image} from 'react-native';
import {getHeight, getWidth} from '../constants/dynamicSize';
import {PURPLE_MAIN, BLUE_PRIMARY} from '../constants/colors';
import navigationService from '../navigation/navigationService';
import Page from './basePage';
import NavMenuButton from '../components/navMenuButton';
import Notification from '../components/icons/notification';
import {isIphoneX} from '../service/utils';
import {connect} from 'react-redux';
import Pages from '../constants/pages';
import _ from 'lodash';

const TOPBAR_LOGO = require('../assets/images/topbar-logo.png');

const containerDefault = {
  flex: 1,
  alignItems: 'center',
  width: '100%',
  paddingTop: isIphoneX ? getHeight(30) : 0,
}

const topViewDefault = {
  height: getHeight(150),
  borderRadius: getHeight(10),
  marginTop: -getHeight(50),
  backgroundColor: BLUE_PRIMARY,
  width: '100%'
}

const forceInsetDefault ={
  top: 'never'
}

class TopBarPage extends Component {

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
    navigationService.navigate(Pages.SESSION);
  }

  render () {
    const {titleText, renderTitle, children, backgroundColor, menuBtnColor, customContainer, customeTopView, notiExist, forceInset, onRightClick, rightExist} = this.props
    return (
      <Page forceInset={{...forceInsetDefault, ...forceInset}} backgroundColor={backgroundColor}>
        
        <View style={{...containerDefault, ...customContainer}}>
          <View style={{...topViewDefault, ...customeTopView}}>
            <View style={{position: 'absolute', bottom: getHeight(20), flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: getHeight(50), width: '100%'}}>
              <NavMenuButton buttonStyle={{marginLeft: getWidth(29)}}
                buttonColor={menuBtnColor}
                onClick={this.toggleMenu} 
              />
              {
                renderTitle ? 
                renderTitle() :
                <Text style={styles.headerTitle}>
                  {titleText}
                </Text>
              }
              {
                rightExist == true ?
                <TouchableOpacity style={styles.rightBtn} onPress={this._navigateSession}>
                  {
                    this.state.notiExist == true ? 
                    <View style={{width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center'}}>
                      <Image style={{width: getWidth(50), height: getHeight(37.68), position: 'absolute', left: 0, bottom: 0}} source={TOPBAR_LOGO} resizeMode={'contain'}/>
                      <View style={{position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, justifyContent: 'center', alignItems: 'center', paddingBottom: getHeight(35), paddingLeft: getWidth(35)}}>
                        <Notification size={getHeight(21)}/>
                      </View>
                    </View>
                    :
                    <Image style={{width: getWidth(50), height: getHeight(37.68), position: 'absolute', left: 0, bottom: 0}} source={TOPBAR_LOGO} resizeMode={'contain'}/>
                  }
                </TouchableOpacity>
                : 
                <View style={styles.rightBtn}>

                </View>
              }
              
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

TopBarPage.defaultProps = {
  forceInset: {},
  customContainer: {},
  titleText: '',
  rightText: '',
  renderTitle: null,
  renderRightItem: null,
  children: null,
  backgroundColor: PURPLE_MAIN,
  menuBtnColor: '#FFFFFF',
  notiExist: false,
  rightExist: false,
  onRightClick: null
};

TopBarPage.propTypes = {
  forceInset: PropTypes.object,
  customContainer: PropTypes.object,
  titleText: PropTypes.string,
  rightText: PropTypes.string,
  renderTitle: PropTypes.func,
  renderRightItem: PropTypes.func,
  children: PropTypes.element,
  backgroundColor: PropTypes.string,
  menuBtnColor: PropTypes.string,
  notiExist: PropTypes.bool,
  rightExist: PropTypes.bool,
  onRightClick: PropTypes.func
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
    color: '#FFFFFF',
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
    marginRight: getWidth(19),
    height: getHeight(38),
    width: getWidth(60),
    justifyContent: 'center',
    alignItems: 'center'
  }
});

const mapStateToProps = (state) => ({
  learnSession: state.ltSession.learn_session,
  teachSession: state.ltSession.teach_session
})

export default connect(mapStateToProps)(TopBarPage);