import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ActivityIndicator,
    Image,
    Dimensions,
    CameraRoll,
    TouchableOpacity
} from 'react-native';
import Page from '../components/basePage';
import MenuPage from '../components/menuPage';
import {getWidth, getHeight} from '../constants/dynamicSize';
import BaseButton from '../components/baseButton';
import MenuButton from '../components/menuButton';
import Back from '../components/icons/back';
import navigationService from '../navigation/navigationService';
import pages from '../constants/pages';
import CameraRollPicker from '../components/cameraRollPicker/index';
import CameraRollGallery from '../components/cameraRollBrowser/index';
import { RNCamera } from 'react-native-camera';
import { SafeAreaView } from 'react-navigation';
import {withMappedNavigationParams} from 'react-navigation-props-mapper';
import { BLACK_PRIMARY, PURPLE_MAIN } from '../constants/colors';

const LOGO_IMAGE = require('../assets/images/logo.png');
const BACK_IMAGE = require('../assets/images/back-button.png');

const IMAGE_WIDTH = Dimensions.get('screen').width > 500 ? getWidth(360) / 3 : (Dimensions.get('screen').width - 15) / 3;

@withMappedNavigationParams()
export default class Camera extends Component {

  constructor(props) {
    super(props);

    this.state = {
      num: 0,
      selectedImage: "",
      selected: false,

      flash: 'off',
      zoom: 0,
      autoFocus: 'on',
      autoFocusPoint: {
          normalized: { x: 0.5, y: 0.5 }, // normalized values required for autoFocusPointOfInterest
          drawRectPosition: {
              x: Dimensions.get('window').width * 0.5 - 32,
              y: Dimensions.get('window').height * 0.5 - 32,
          },
      },
      depth: 0,
      type: 'back',
      whiteBalance: 'auto',
      ratio: '16:9',
      // recordOptions: {
      //     mute: false,
      //     maxDuration: 50,
      //     fixOrientation: true,
      //     skipProcessing: false,
      //     quality: RNCamera.Constants.VideoQuality["288p"]
      // },
      isRecording: false,
      canDetectFaces: false,
      canDetectText: false,
      canDetectBarcode: false,
      faces: [],
      textBlocks: [],
      barcodes: [],
      defaultBtn: 'photo',
      intervalReference: null,
      time: new Date().toLocaleTimeString(),
      countdown: 0,
      sec_Right: 0,
      pause: false,
      subject: '',
      problemName: ''
    };

    this.getSelectedImages = this.getSelectedImages.bind(this);

    // props.navigation.addListener('didFocus', payload => {
    //   this.setState({subject: payload.action.params.subject, problemName: payload.action.params.problemName});
    // })
  }

  _photoTake = async () => {
    if (this.camera) {
      const options = {
          skipProcessing: false,
          fixOrientation: true, quality: 0.5, base64: true
      };
      const data = await this.camera.takePictureAsync(options);
      console.log("Camera Photo Take ======= ", data.uri);
      // Actions.EditStory({ data: { uri: data.uri, type: 'image', typer: 'camera' } })
      // navigationService.navigate(pages.PROBLEM_CROP, {imageUri: data.uri, subject: this.state.subject, imageWidth: data.width, imageHeight: data.height, problemName: this.state.problemName});
      this.props.updatePhoto(data);
      // navigationService.go();
    }
    // navigationService.navigate(pages.PROBLEM_CROP);
  }

  componentDidMount() {
    // openOverlay();
  }

  getSelectedImages(images, current) {
    
    let num = images.length;

    if (images.length > 0) {
      // closeOverlay();
    } else {
      // openOverlay();
    }

    this.setState({
      num: num,
      selected: images,
    });

    console.log(current);
    console.log(this.state.selected);
  }

  _onSelectImage = (imgId, index, uri) => {
    console.log("SelectedImage URI = ", uri);
    this.setState({selected: true, selectedImage: uri});
  }

  render () {
      return (
          <SafeAreaView style={styles.container} forceInset={{bottom: 'never', top: 'never'}}>
            
              <RNCamera
                  ref={ref => {
                      this.camera = ref;
                  }}
                  style={{
                      flex: 1,
                      width: '100%',
                      alignItems: 'center'
                  }}
                  type={this.state.type}
                  flashMode={this.state.flash}
                  autoFocus={this.state.autoFocus}
                  autoFocusPointOfInterest={this.state.autoFocusPoint.normalized}
                  zoom={this.state.zoom}
                  captureAudio={false}
                  whiteBalance={this.state.whiteBalance}
                  ratio={this.state.ratio}
                  focusDepth={this.state.depth}
                  // permissionDialogTitle={'Permission to use camera'}
                  // permissionDialogMessage={'We need your permission to use your camera phone'}
                  androidCameraPermissionOptions={{
                    title: 'Permission to use Camera',
                    message: 'We need your permission to use your camera',
                    buttonPositive: 'OK',
                    buttonNegative: 'Cancel'
                  }}
                  androidRecordAudioPermissionOptions={{
                    title: 'Permission to use Audio',
                    message: 'We need your permission to use your audio',
                    buttonPositive: 'OK',
                    buttonNegative: 'Cancel'
                  }}
              >
                <TouchableOpacity style={{position: 'absolute', top: getHeight(40), left: getWidth(10)}}
                  onPress={() => {navigationService.pop()}}
                >
                  {/* <Image source={BACK_IMAGE} style={{width: getHeight(48), height: getHeight(48)}}/> */}
                  <Back size={getHeight(48)} color={BLACK_PRIMARY}/>
                </TouchableOpacity>
                <BaseButton 
                  text={'CAPTURE'}
                  onClick={this._photoTake}
                  buttonStyle={{position: 'absolute', bottom: getHeight(30), backgroundColor: PURPLE_MAIN}}
                  textStyle={{color: '#FFFFFF'}}
                />
              </RNCamera>
              
            
            
          </SafeAreaView>
      )
  }
}

Camera.navigatorStyle = {
    navBarHidden: true,
    statusBarBlur: false
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        width: '100%',
        // backgroundColor: 'red'
    },
    libraryView: {
      width: '100%',
      height: getHeight(576),
      backgroundColor: '#FFFFFF'
    },
    btnView: {
      flex: 1,
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      // paddingBottom: getHeight(40)
    },
    btnMask: {
      width: '100%',
      height: '100%',
      position: 'absolute',
      top: 0,
      left: 0,
      backgroundColor: 'rgba(0,0,0,0.8)'
    }
})