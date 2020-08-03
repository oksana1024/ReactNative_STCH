import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StatusBar, View, StyleSheet, Text, Platform, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-navigation';
import {getHeight, getWidth} from '../constants/dynamicSize';
import {PURPLE_MAIN} from '../constants/colors';
import navigationService from '../navigation/navigationService';
import Page from './basePage';
import MenuButton from '../components/menuButton';
import NavMenuButton from '../components/navMenuButton';
import {isIphoneX} from '../service/utils';

const containerDefault = {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%'
}

const headerDefault = {
  height: getHeight(40),
  width: '100%',
  justifyContent: 'flex-start',
  flexDirection: 'row',
  marginTop: isIphoneX ? 0 : getHeight(20),
}

export default class MenuPage extends Component {

  toggleMenu = () => {
    navigationService.openDrawer();
  }

  render () {
    const {forceInset, titleText, rightText, renderTitle, renderRightItem, children, backgroundColor, menuBtnColor, customContainer, customHeaderBar, menuExist} = this.props
    return (
      <Page forceInset={forceInset} backgroundColor={backgroundColor}>
        <View style={{...containerDefault, ...customContainer}}>
          <View style={{...headerDefault, ...customHeaderBar}}>
            {
              menuExist == true ?
              <NavMenuButton buttonStyle={{marginLeft: getWidth(30)}}
                        buttonColor={menuBtnColor}
                        onClick={this.toggleMenu} 
              />
              :
              <View style={{marginLeft: getWidth(50)}}></View>
            }
            {
              renderTitle ? 
              renderTitle() :
              <Text style={styles.headerTitle}>
                {titleText}
              </Text>
            }
            {
              renderRightItem ?
              renderRightItem() :
              <Text style={styles.rightTitle}>
                {rightText}
              </Text>
            }
          </View>
          
          
          
          {
            children
          }
        </View>
      </Page>
    )
  }
}

MenuPage.defaultProps = {
  forceInset: {},
  customContainer: {},
  titleText: '',
  rightText: '',
  renderTitle: null,
  renderRightItem: null,
  children: null,
  backgroundColor: PURPLE_MAIN,
  menuBtnColor: '#FFFFFF',
  customHeaderBar: {},
  menuExist: true
};

MenuPage.propTypes = {
  forceInset: PropTypes.object,
  customContainer: PropTypes.object,
  titleText: PropTypes.string,
  rightText: PropTypes.string,
  renderTitle: PropTypes.func,
  renderRightItem: PropTypes.func,
  children: PropTypes.element,
  backgroundColor: PropTypes.string,
  menuBtnColor: PropTypes.string,
  customHeaderBar: PropTypes.object,
  menuExist: PropTypes.bool
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
    fontFamily: 'Montserrat-Regular',
    color: '#FFFFFF',
  },
  rightTitle: {
    position: 'absolute', 
    right: getWidth(16), 
    top: getHeight(15),
    fontFamily: 'Montserrat-Regular',
    color: '#FFFFFF',
    fontSize: getHeight(18)
  }
});