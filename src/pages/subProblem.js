import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ActivityIndicator,
    TouchableOpacity
} from 'react-native';
import {BLACK_PRIMARY, PURPLE_MAIN} from '../constants/colors';
import Page from '../components/basePage';
import NavPage from '../components/navPage';
import SwitchPage from '../components/switchPage';
import Vector from '../components/icons/vector';
import BaseButton from '../components/baseButton';
import {getHeight, getWidth} from '../constants/dynamicSize';
import {connect} from 'react-redux';
import navigationService from '../navigation/navigationService';
import pages from '../constants/pages';


class Loading extends Component {

    componentDidMount() {
        
    }

    _gotoHome = () => {
      // navigationService.popToTop();
    }

    _gotoTeach = () => {
      navigationService.navigate(pages.TEACH_SWITCH)
    }

    _homeClick = () => {
      navigationService.navigate(pages.LOADING);
    }

    render () {
        return (
            <SwitchPage leftSwitch={'Learn'} rightSwitch={'Teach'} switchChange={this._gotoTeach} switchValue={'left'}>
                <View style={{flex: 1, width: '100%'}}>
                  <View style={{flex: 1}}>
                    <Text
                      style={styles.titleText}
                    >
                      Problem submittted.
                    </Text>
                    <Text style={styles.subTitle}>
                      You'll get the notification when a 
                    </Text>
                    <Text style={styles.subTitle}>
                      teacher is ready to help.
                    </Text>
                    <Text style={styles.descText}>
                      If you need help on more than one problem you can continue submitting more problems
                    </Text>
                  </View>
                  <BaseButton 
                      text={'Home'}
                      onClick={this._homeClick}
                      buttonStyle={{marginBottom: getHeight(30), backgroundColor: PURPLE_MAIN, alignSelf: 'center'}}
                      textStyle={{color: '#FFFFFF'}}
                  />
                </View>
            </SwitchPage>
            
        )
    }
};

Loading.navigatorStyle = {
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
      marginBottom: getHeight(25),
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
});

const mapStateToProps = (state) => ({
})

export default connect(mapStateToProps)(Loading);