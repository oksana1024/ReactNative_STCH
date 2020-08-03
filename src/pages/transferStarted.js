import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ActivityIndicator,
    TouchableOpacity,
    Image
} from 'react-native';
import {BLACK_PRIMARY, PURPLE_MAIN} from '../constants/colors';
import Page from '../components/basePage';
import {getHeight, getWidth} from '../constants/dynamicSize';
import {connect} from 'react-redux';
import navigationService from '../navigation/navigationService';
import pages from '../constants/pages';
import Checked from '../components/icons/checked';

const ICON_LOGO = require('../assets/images/icon-logo.png');


class TransferStart extends Component {

    componentDidMount() {
        
    }

    _gotoHome = () => {
      navigationService.reset(pages.LOADING);
    }   

    render () {
        return (
            <Page>
                <View style={styles.container} >
                  <Image style={{width: getWidth(155), height: getHeight(82)}} resizeMode={'contain'} source={ICON_LOGO}/>
                  <View style={styles.modal}>
                    <View style={{flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center', paddingBottom: getHeight(40)}}>
                      <Checked size={getHeight(38)} color={PURPLE_MAIN} />
                      <Text style={styles.bodyText}>Transfer Initiated</Text>
                    </View>
                    <TouchableOpacity style={styles.btnBody}
                    onPress={this._gotoHome}
                    >
                      {/* <Text style={styles.btnText}>Home</Text> */}
                      
                      <Text style={styles.btnText}>
                        Home
                      </Text>
                    </TouchableOpacity>
                  </View>
                  
                </View>
            </Page>
            
        )
    }
};

TransferStart.navigatorStyle = {
    navBarHidden: true,
    statusBarBlur: false
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    loadText: {
        paddingBottom: getHeight(10),
        color: '#FFFFFF',
        fontFamily: 'Montserrat-Bold',
    },
    modal: {
      width: getWidth(244),
      height: getHeight(262),
      backgroundColor: '#FFFFFF',
      alignItems: 'center',
      borderRadius: getHeight(10),
      marginTop: getHeight(42)
    },
    btnText: {
      fontFamily: 'Montserrat-Medium',
      color: '#FFFFFF',
      fontSize: getHeight(18)
    },
    bodyText: {
      fontFamily: 'Montserrat-Medium',
      fontSize: getHeight(18),
      color: BLACK_PRIMARY,
      marginTop: getHeight(19)
    },
    bodySecText: {
      fontFamily: 'Montserrat-Medium',
      fontSize: getHeight(15),
      color: BLACK_PRIMARY
    },
    bodyThirdText: {
      fontFamily: 'Montserrat-Medium',
      fontSize: getHeight(18),
      color: BLACK_PRIMARY
    },
    btnBody: {
      width: getWidth(220), 
      height: getHeight(36), 
      borderRadius: getHeight(10), 
      backgroundColor: PURPLE_MAIN, 
      justifyContent: 'center',
      alignItems: 'center', 
      flexDirection: 'row',
      paddingLeft: getWidth(13),
      paddingRight: getWidth(25),
      marginBottom: getHeight(23)
    }
});

const mapStateToProps = (state) => ({
})

export default connect(mapStateToProps)(TransferStart);