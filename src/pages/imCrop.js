import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ActivityIndicator,
    Image,
    Dimensions,
    CameraRoll,
    Animated
} from 'react-native';
import Page from '../components/basePage';
import MenuPage from '../components/menuPage';
import {getWidth, getHeight} from '../constants/dynamicSize';
import BaseButton from '../components/baseButton';
import MenuButton from '../components/menuButton';
import Crop from '../components/icons/crop';
import Back from '../components/icons/back';
import navigationService from '../navigation/navigationService';
import pages from '../constants/pages';
import {uploadImage} from '../service/firebase';
import {auth, firestore} from '../constants/firebase';
import {connect} from 'react-redux';
import {getMyInitLearnList} from '../controller/learn';
import {PanGestureHandler, PinchGestureHandler, TouchableOpacity} from 'react-native-gesture-handler';
import AmazingCropper from '../components/imageCropper';
import PropTypes from 'prop-types';
import { BLACK_PRIMARY, PURPLE_MAIN } from '../constants/colors';
import { withMappedNavigationParams } from 'react-navigation-props-mapper';

const LOGO_IMAGE = require('../assets/images/logo.png');
const IMAGE_WIDTH = Dimensions.get('screen').width > 500 ? getWidth(360) / 3 : (Dimensions.get('screen').width - 15) / 3;
const tag ='[GESTURE]'

const CustomCropperFooter = (props) => (
  <View style={{width: '100%', height: '100%', alignItems: 'center', justifyContent: 'flex-end'}}>
    <BaseButton 
        text={'Crop'}
        onClick={props.onDone}
        buttonStyle={{marginBottom: getHeight(30), backgroundColor: PURPLE_MAIN, alignSelf: 'center'}}
        textStyle={{color: '#FFFFFF'}}
    />
  </View>
)

CustomCropperFooter.propTypes = {
  onDone: PropTypes.func,
  onRotate: PropTypes.func,
  onCancel: PropTypes.func
}

@withMappedNavigationParams()
class ImageCrop extends Component {

  constructor(props) {
    super(props);

    this.state = {
      imageSource: '',
      subject: '',
      loading: false,
      aspect: getHeight(410) / getWidth(316),
      imageWidth: 0,
      imageHeight: 0,
      prevImageSource: '',
      prevImageHeight: 0,
      prevImageWidth: 0,
      problemName: ''
    }
    console.log("Image Crops Props === ", this.props);
    // props.navigation.addListener('didFocus', payload => {
    //   let newAspect = payload.action.params.imageHeight/payload.action.params.imageWidth;
    //   this.setState({imageSource: payload.action.params.imageUri, aspect: newAspect, imageWidth: payload.action.params.imageWidth,
    //   imageHeight: payload.action.params.imageHeight});
    // })
  }

  goForward = () => {
    
  }

  handleGesture = () => {
    Animated.event([{nativeEvent: {scale:this.scale}}], { useNativeDriver: true });
  }

  _onDone = (croppedUri) => {
    console.log('Cropped Image === ', croppedUri);
    this.props.updateResult(croppedUri);
    // if (this.state.imageSource == '' || this.state.subject == '') {
    //   console.log("Not be able to go forward")
    //   return;
    // }

    // this.setState({loading: true});    
    // uploadImage(croppedUri).then((data) => {
    //   console.log("Problem Uploaded!!!!");
    //   let newDocRef  = firestore.collection(this.state.subject).doc();
    //   newDocRef.set({
    //     problemId: newDocRef.id,
    //     posterId: auth.currentUser.uid,
    //     problemImage: data,
    //     updateTime: Date.now(),
    //     sessionExist: false,
    //     subject: this.state.subject,
    //     problemName: this.state.problemName
    //   }).catch((err) => {
    //     console.log("firestore set error ==== ", err);
    //   })
    //   .finally(() => {
    //     this.setState({loading: false});
    //   })
    //   const {dispatch} = this.props;
    //   dispatch(getMyInitLearnList());
      
    // }).catch((err) =>{
    //   console.log("Upload Error = ", err);
    // });
    // navigationService.navigate(pages.PROBLEM_SUBMITTED);
  }

  _onCancel = () => {

  }

  _onGestureStateChange = (event) => {
    console.log(tag,event.nativeEvent);
  //  this.scale.setValue(event.nativeEvent.scale)
    // this.setState({scale: event.nativeEvent.scale});
    this.scale.setValue(event.nativeEvent.scale);
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   if (nextProps.navigation.state.params.imageUri != nextState.prevImageSource ||
  //     nextProps.navigation.state.params.imageWidth != nextState.prevImageWidth ||
  //     nextProps.navigation.state.params.imageHeight != nextState.prevImageHeight
  //     ) {
  //     return true
  //   } else {
  //     return false
  //   }
  // }

  _goBack = () => {
    // navigationService.navigate(pages.LEARN_SUBJECT)
    navigationService.popToTop();
  }

  render () {
    // let imageWidth = this.props.navigation.state.params.imageWidth;
    // let imageHeight = this.props.navigation.state.params.imageHeight;
    // let imageSource = this.props.navigation.state.params.imageUri;
    // let aspect = imageHeight/imageWidth;
    // this.setState({
    //   prevImageSource: imageSource,
    //   prevImageWidth: imageWidth,
    //   prevImageHeight: imageHeight
    // })
    return (
        <Page forceInset={{bottom: 'never', top: 'never'}}>
            <View style={styles.container}>
              <View style={{marginTop: getHeight(5), marginBottom: getHeight(10), width: '100%'}}>
                <TouchableOpacity style={{marginLeft: getWidth(10)}} onPress={() => { this._goBack()}}>
                  <Back size={getHeight(48)} color={BLACK_PRIMARY}/>
                </TouchableOpacity>
              </View>
              <View style={styles.headView}>
                  <Text style={{color: BLACK_PRIMARY, fontFamily: 'Montserrat-Medium', fontSize: getHeight(25)}}>
                    Select one Problem
                  </Text> 
              </View>
              <View style={{height: getHeight(660), width: getWidth(370), borderRadius: getHeight(10)}}>
                <AmazingCropper
                  ref={(instance) => this.child = instance}
                  onDone={this._onDone}
                  footerComponent={
                    <CustomCropperFooter />
                  }
                  onCancel={this.onCancel}
                  imageUri={this.props.imageUri}
                  imageWidth={this.props.imageWidth}
                  imageHeight={this.props.imageHeight}
                  NOT_SELECTED_AREA_OPACITY={0.3}
                  BORDER_WIDTH={0}
                />
              </View>
            </View>
        </Page>
    )
  }
}

ImageCrop.navigatorStyle = {
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
    headView: {
      flexDirection: 'row',
      marginLeft: getWidth(32),
      width: '100%',
      marginBottom: getHeight(24)
    },
    titleView: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      width: '100%',
      
    },
    libraryView: {
      width: getWidth(316),
      height: getHeight(410),
      borderRadius: getHeight(10),
      backgroundColor: 'red'
    },
    btnView: {
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: getHeight(16)
    },
    btnMask: {
      width: '100%',
      height: '100%',
      position: 'absolute',
      top: 0,
      left: 0,
      backgroundColor: 'rgba(0,0,0,0.8)'
    },
    loadingWrapper: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center'
    }
})

const mapStateToProps = (state) => ({
  
})

export default connect(mapStateToProps)(ImageCrop);