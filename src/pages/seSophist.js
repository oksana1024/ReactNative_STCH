import React, {Component} from 'react';
import {
    StyleSheet,
    Image,
    View,
    Text,
    TouchableOpacity
} from 'react-native';
import Page from '../components/basePage';
import {getWidth, getHeight} from '../constants/dynamicSize';
import BaseButton from '../components/baseButton';
import BaseInput from '../components/baseInput';
import NavButton from '../components/navButton';
import Hat from '../components/icons/hat';
import Star from '../components/icons/star';
import pages from '../constants/pages';
import navigationService from '../navigation/navigationService';
import { BLACK_PRIMARY, GRAY_PRIMARY } from '../constants/colors';

const LOGO_IMAGE = require('../assets/images/logo.png');
const WORD_LOGO = require('../assets/images/word-logo.png');
const MARK_IMAGE = require('../assets/images/square-logo.png');

export default class Final extends Component {

  constructor(props) {
    super(props)
    
    this.state={
      modalVisible: true
    }
  }
    
  goForward = () => {
    navigationService.navigate(pages.CHOOSE_SOPHIST);
  }    

  goBack = () => {
    navigationService.pop();
  }

  render () {
      return (
          <Page>
            <View style={styles.container}>
              <View style={styles.headView}>
                <Image width={getWidth(244)} height={getHeight(36)} source={WORD_LOGO} />  
              </View>
              <View style={styles.mainView}>
                <View style={styles.modalView}>
                  <Image style={styles.modalMark} source={MARK_IMAGE} resizeMode={'contain'} />
                  <View style={styles.modalTitleView}>
                    <Text style={styles.modalTitle}>Finding Your Sophist</Text>
                  </View>
                  <Hat width={getWidth(86)} height={getHeight(84)} color={BLACK_PRIMARY} />
                  <View style={styles.modalTimeView}>
                    <Text style={styles.modalTime}>
                      0:28
                    </Text>
                  </View>
                  <View style={styles.modalBtnView}>
                    <TouchableOpacity style={styles.modalBtn}>
                      <Text style={styles.modalBtnText}>
                        Cancel
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <View style={styles.btnView}>
                <BaseButton 
                    text={'LEARN'}
                    onClick={this.goForward}
                />
              </View>
            </View>
          </Page>
          
      )
  }
}

Final.navigatorStyle = {
    navBarHidden: false,
    statusBarBlur: false
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center'
  },
  headView: {
    height: getHeight(100),
    justifyContent: 'flex-end',
    alignItems: 'center'
  }, 
  mainView: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView:{
    backgroundColor: '#FFFFFF',
    width: getWidth(244),
    height: getHeight(262),
    borderRadius: getHeight(10),
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  btnView:{
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    height: getHeight(120)
  },
  modalMark: {
    marginTop: -getHeight(41),
    marginBottom: -getHeight(31),
    width: getWidth(160),
    height: getHeight(120)
  },
  modalTitleView:{
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    height: getHeight(36)
  },
  modalTitle: {
    fontFamily: 'Montserrat-Regular',
    fontSize: getHeight(20),
    color: BLACK_PRIMARY
  },
  modalTimeView: {
    width: '100%',
    marginTop: getHeight(9),
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalTime: {
    fontFamily: 'Montserrat-Regular',
    fontSize: getHeight(18),
    color: BLACK_PRIMARY
  },
  modalBtnView: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalBtn: {
    width: getWidth(220),
    height: getHeight(36),
    backgroundColor: GRAY_PRIMARY,
    borderRadius: getHeight(10),
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalBtnText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: getHeight(18),
    color: '#FFFFFF'
  }
})