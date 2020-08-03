import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ActivityIndicator,
    Image,
    Dimensions,
    CameraRoll
} from 'react-native';
import Page from '../components/basePage';
import MenuPage from '../components/menuPage';
import {getWidth, getHeight} from '../constants/dynamicSize';
import BaseButton from '../components/baseButton';
import MenuButton from '../components/menuButton';
import navigationService from '../navigation/navigationService';
import pages from '../constants/pages';
import CameraRollPicker from '../components/cameraRollPicker/index';
import CameraRollGallery from '../components/cameraRollBrowser/index';

const LOGO_IMAGE = require('../assets/images/logo.png');

const IMAGE_WIDTH = Dimensions.get('screen').width > 500 ? getWidth(360) / 3 : (Dimensions.get('screen').width - 15) / 3;

export default class PhotoLibrary extends Component {

  constructor(props) {
    super(props);

    this.state = {
      num: 0,
      selectedImage: "",
      selected: false,
      selectedImageURL: ''
    };

    this.getSelectedImages = this.getSelectedImages.bind(this);
  }

  photoSelect = () => {
    navigationService.navigate(pages.PROBLEM_CROP, {imageUri: this.state.selectedImage});
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

  _onSelectImage = (imgId, index, uri, assetURL) => {
    console.log("Selected Image URL ======= ", assetURL);
    this.setState({selected: true, selectedImage: uri, selectedImageURL: assetURL});
  }

  render () {
      return (
          <MenuPage forceInset={{bottom: 'never'}} titleText={'LEARN'}>
            <View style={styles.libraryView}>
            {/* <CameraRollPicker
              groupTypes='All'
              maximum={1}
              selected={this.state.selected}
              assetType='Photos'
              imagesPerRow={4}
              imageMargin={getWidth(3)}
              callback={this.getSelectedImages} 
              /> */}
              <CameraRollGallery
                enableCameraRoll={true}
                cameraRollListHeader={null}
                renderPageHeader={null}
                onSelectImage={this._onSelectImage}
              />
            </View>
            <View style={styles.btnView}>
              <BaseButton 
                  text={'SELECT'}
                  onClick={this.photoSelect}
                  textStyle={this.state.selected == false ? {color: 'gray'} : {}}
              />
              {
                this.state.selected == false ? 
                <View style={styles.btnMask}>

                </View> : 
                null
              }
              {/* <BlurOverlay
                  radius={14}
                  downsampling={2}
                  brightness={-100}
                  customStyles={{alignItems: 'center', justifyContent: 'center'}}
                  blurStyle="dark"
              /> */}
            </View>
          </MenuPage>
      )
  }
}

PhotoLibrary.navigatorStyle = {
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