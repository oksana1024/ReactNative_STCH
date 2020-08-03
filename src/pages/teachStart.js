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
import BaseButton from '../components/baseButton';
import navigationService from '../navigation/navigationService';
import pages from '../constants/pages';
import Star from '../components/icons/star';
import BStar from '../components/icons/bstar';
import {withMappedNavigationParams} from 'react-navigation-props-mapper';
import {firestore, auth} from '../constants/firebase';

const ICON_LOGO = require('../assets/images/icon-logo.png');
const MASTER_IMAGE = require('../assets/images/master.png')

@withMappedNavigationParams()
class TeachStart extends Component {

  constructor(props) {
    super(props);

    this.state = {
      problemData: {},
      posterId: ''
    }
  }

    componentDidMount() {
      const {sessionData} = this.props;
      this.setState({posterId: sessionData.userId});
      firestore.collection(sessionData.subject.toLowerCase()).doc(sessionData.problemId).get().then(doc => {
        this.setState({problemData: doc.data()});
      })
    }

    _gotoHome = () => {
      // navigationService.reset(pages.LOADING);
    }

    _goTeach = () => {
      const {sessionData} = this.props;

      firestore.collection('users').doc(auth.currentUser.uid).collection('teach_session').doc(sessionData.subject.toLowerCase() + '-' + sessionData.problemId).update({
        confirmed: true,
        lastUpdate: Date.now()
      })
      navigationService.navigate(pages.TEACH_SOLVE, {sessionData: this.props.sessionData});
    }

    render () {
      const {sessionData} = this.props;
      let rating = sessionData.userData.rating ? sessionData.userData.rating : 0;
        return (
            <Page>
                <View style={styles.container} >
                  <Image style={{width: getWidth(155), height: getHeight(82)}} resizeMode={'contain'} source={ICON_LOGO}/>
                  <View style={styles.modal}>
                    <View style={{flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center', paddingBottom: getHeight(40)}}>
                      <Text style={styles.bodyText}>{this.props.sessionData.userData.userName}</Text>
                      <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                        {
                          rating > 0 ?
                          <Star width={getWidth(28)} height={getHeight(27)} color ={PURPLE_MAIN}/> :
                          <BStar width={getWidth(28)} height={getHeight(27)} color={'#FFFFFF'} stroke={BLACK_PRIMARY} />
                        }
                        {
                          rating > 1 ?
                          <Star width={getWidth(28)} height={getHeight(27)} color ={PURPLE_MAIN}/> :
                          <BStar width={getWidth(28)} height={getHeight(27)} color={'#FFFFFF'} stroke={BLACK_PRIMARY} />
                        }
                        {
                          rating > 2 ?
                          <Star width={getWidth(28)} height={getHeight(27)} color ={PURPLE_MAIN}/> :
                          <BStar width={getWidth(28)} height={getHeight(27)} color={'#FFFFFF'} stroke={BLACK_PRIMARY} />
                        }
                        {
                          rating > 3 ?
                          <Star width={getWidth(28)} height={getHeight(27)} color ={PURPLE_MAIN}/> :
                          <BStar width={getWidth(28)} height={getHeight(27)} color={'#FFFFFF'} stroke={BLACK_PRIMARY} />
                        }
                        {
                          rating > 4 ?
                          <Star width={getWidth(28)} height={getHeight(27)} color ={PURPLE_MAIN}/> :
                          <BStar width={getWidth(28)} height={getHeight(27)} color={'#FFFFFF'} stroke={BLACK_PRIMARY} />
                        }
                      </View>
                      
                    </View>
                    {/* <TouchableOpacity style={styles.btnBody}
                    onPress={this._gotoHome}
                    >
                      {
                      
                      <Text style={styles.btnText}>
                      {this.props.sessionData.name}'s Reviews
                      </Text>
                    </TouchableOpacity> */}
                  </View>
                  <BaseButton 
                    text={'TEACH'}
                    onClick={this._goTeach}
                    buttonStyle={{marginTop: getHeight(185)}}
                  />
                </View>
            </Page>
            
        )
    }
};

TeachStart.navigatorStyle = {
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
      fontSize: getHeight(20),
      color: BLACK_PRIMARY
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
  user: state.user
})

export default connect(mapStateToProps)(TeachStart);