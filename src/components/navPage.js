import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StatusBar, View, StyleSheet, Text, Platform, TouchableOpacity, Image} from 'react-native';
import {getHeight, getWidth} from '../constants/dynamicSize';
import {PURPLE_MAIN, BLUE_PRIMARY, RED_PRIMARY, BLACK_PRIMARY} from '../constants/colors';
import navigationService from '../navigation/navigationService';
import Page from './basePage';
import NavMenuButton from '../components/navMenuButton';
import Notification from '../components/icons/notification';
import Back from '../components/icons/back';
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
  paddingTop: isIphoneX ? getHeight(30) : 0,
}

const topViewDefault = {
  height: getHeight(70),
  width: '100%'
}

const forceInsetDefault ={
  top: 'never'
}

class NavPage extends Component {

  constructor(props) {
    super (props);
  }

  render () {
    const {leftExist, renderTitle, children, backgroundColor, menuBtnColor, customContainer, customeTopView, onLeftClick, forceInset, rightTime, titleText} = this.props
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
                <TouchableOpacity style={{width: getWidth(90), height: getHeight(50), justifyContent: 'center', paddingLeft: getWidth(10)}} onPress={onLeftClick}>
                  <Back
                    size={getHeight(48)}
                    color={'#000000'} 
                  />
                </TouchableOpacity>
              }
              {
                <View style={styles.centerView}>
                  {
                    renderTitle ? 
                    renderTitle() :
                    <Text style={styles.headerTitle}>
                      {titleText}
                    </Text>
                  }
                </View>
              }
              {
                rightTime ?
                <View style={styles.rightBtn}>
                  <Text style={styles.rightTitle}>
                    {rightTime}
                  </Text>
                </View>
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

NavPage.defaultProps = {
  forceInset: {},
  customContainer: {},
  leftExist: true,
  rightText: '',
  titleText: '',
  renderTitle: null,
  renderRightItem: null,
  children: null,
  backgroundColor: '#FFFFFF',
  menuBtnColor: PURPLE_MAIN,
  notiExist: false,
  rightExist: false,
  onLeftClick: null,
  notiColor: RED_PRIMARY,
  switchValue: 'left',
  leftSwitch: 'Learn',
  rightSwitch: 'Teach',
  switchChange: null
};

NavPage.propTypes = {
  forceInset: PropTypes.object,
  customContainer: PropTypes.object,
  leftExist: PropTypes.bool,
  rightText: PropTypes.string,
  titleText: PropTypes.string,
  renderTitle: PropTypes.func,
  renderRightItem: PropTypes.func,
  children: PropTypes.element,
  backgroundColor: PropTypes.string,
  menuBtnColor: PropTypes.string,
  notiExist: PropTypes.bool,
  rightExist: PropTypes.bool,
  onLeftClick: PropTypes.func,
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
    fontSize: getHeight(24),
    fontFamily: 'Montserrat-Medium',
    color: BLACK_PRIMARY,
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
    fontFamily: 'Montserrat-Medium',
    color: BLACK_PRIMARY,
    fontSize: getHeight(18),
    marginRight: getWidth(10)
  },
  rightBtn: {
    height: getHeight(38),
    width: getWidth(90),
    justifyContent: 'center',
    alignItems: 'center',
  }
});

const mapStateToProps = (state) => ({
})

export default connect(mapStateToProps)(NavPage);