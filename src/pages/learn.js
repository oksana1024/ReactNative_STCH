import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    Image,
    TouchableOpacity,
    Alert,
    Platform,
    ScrollView,
    FlatList
} from 'react-native';
import SwitchPage from '../components/switchPage';
import {getWidth, getHeight} from '../constants/dynamicSize';
import {BLACK_PRIMARY, PURPLE_MAIN, GRAY_THIRD} from '../constants/colors';
import BaseButton from '../components/baseButton';
import Triangle from '../components/icons/triangle';
import Camera from '../components/icons/camera';
import Picture from '../components/icons/picture';
import Check from '../components/icons/check';
import navigationService from '../navigation/navigationService';
import pages from '../constants/pages';
import RadioButton from '../components/radioButton';
import {uploadImage} from '../service/firebase';
import {auth, firestore} from '../constants/firebase';
import ImagePicker from 'react-native-image-picker';
import {connect} from 'react-redux';
import {getMyInitLearnList, clearMyLearnList} from '../controller/learn';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {changeAppBranch} from '../model/actions/branchAC';
import { KeyboardAwareView } from 'react-native-keyboard-aware-view';

const LOGO_IMAGE = require('../assets/images/logo.png');

class LearnScreen extends Component {

  constructor(props) {
    super(props);

    this.state={
      modalOpened: false,
      subjectArray: [
        {
          iconName: 'algebra',
          name: 'Algebra'
        },
        {
          iconName: 'physics',
          name: 'Physics'
        },
        {
          iconName: 'geometry',
          name: 'Geometry'
        },
        {
          iconName: 'chemistry',
          name: 'Chemistry'
        }
      ],
      subject: '',
      displaySubject: '',
      problemName: '',
      photoSource: 'camera',
      selecting: false,
      cropped: false,
      imageToBeUploaded: ''
    }

    // console.log("Redux Store Subjects =", props.subjects);
  }

  checkSubject = () => {
    if (this.state.subject == '') {
      Alert.alert(
        'YOUR SUBJECT',
        'Please select your subject',
        [
          {
            text: 'OK',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel'
          }
        ],
        {cancelable: false}
      )
    }
  }

  libraryClick = () => {
    if (this.state.subject == '') {
      Alert.alert(
        'YOUR SUBJECT',
        'Please select your subject',
        [
          {
            text: 'OK',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel'
          }
        ],
        {cancelable: false}
      )
      return;
    }

    if(this.state.problemName == '') {
      Alert.alert(
        'YOUR PROBLEM NAME',
        'Please input your problem name!',
        [
          {
            text: 'OK',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel'
          }
        ],
        {cancelable: false}
      )
      return;
    }
    const options = {
      title: 'Select Problem Image',
      customButtons: [],
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.launchImageLibrary(options, (response) => {
      this.setState({photoSource: 'library'});
      console.log("Image Picker Response = ", response);
      if (response.uri != undefined && response.uri != null && response.uri != '' ) {
        if (Platform.OS == 'ios') {
          navigationService.navigate(pages.PROBLEM_CROP, {imageUri: response.uri, imageWidth: response.width, imageHeight: response.height, updateResult: (uri) => this._updateCropResult(uri)});
        } else if (Platform.OS == 'android') {
          let absPath = 'file://' + response.path;
          navigationService.navigate(pages.PROBLEM_CROP, {imageUri: absPath, imageWidth: response.width, imageHeight: response.height, updateResult: (uri) => this._updateCropResult(uri)});
        } else {
          navigationService.navigate(pages.PROBLEM_CROP, {imageUri: response.uri, imageWidth: response.width, imageHeight: response.height, updateResult: (uri) => this._updateCropResult(uri)});
        }
      }
    })
  }

  cameraClick = () => {
    if (this.state.subject == '') {
      Alert.alert(
        'YOUR SUBJECT',
        'Please select your subject',
        [
          {
            text: 'OK',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel'
          }
        ],
        {cancelable: false}
      )
      return;
    }

    if(this.state.problemName == '') {
      Alert.alert(
        'YOUR PROBLEM TOPIC',
        'Please input your problem topic!',
        [
          {
            text: 'OK',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel'
          }
        ],
        {cancelable: false}
      )
      return;
    }

    const subject = this.state.subject.toLowerCase();
    navigationService.navigate(pages.CAMERA, {subject: subject, problemName: this.state.problemName});
  }

  _skipUpload = () => {
    const {dispatch} = this.props;
    dispatch(clearMyLearnList());
    dispatch(getMyInitLearnList());
    navigationService.navigate(pages.LEARN_HISTORY);
  }

  _gotoLearn = () => {
    // navigationService.navigate(pages.LEARN_START);
    navigationService.navigate(pages.SESSION);
  }

  // static getDerivedStateFromProps (props, state) {
  //   console.log("Learn Start Props User = ", props.user);
  //   return null;
  // }

  _onChangeProblemName = (name) => {
    this.setState({problemName: name});
  }

  _gotoTeach = () => {
    const {dispatch} = this.props;
    
    console.log("Bank Props ==== ", this.props.bank);
    if(this.props.bank.express == null) {
      navigationService.navigate(pages.BANK_EDIT, {bank: this.props.bank});
    } else {
      dispatch(changeAppBranch('teach'));
      navigationService.navigate(pages.TEACH_SWITCH);
    }
    // navigationService.navigate(pages.TEACH_SWITCH)
  }

  _updateCameraPhoto = (photo) => {
      console.log("Camera Photo URL === ", photo.uri);
      // navigationService.pop();
      this.setState({photoSource: 'camera'});
      navigationService.navigate(pages.PROBLEM_CROP, {imageUri: photo.uri, imageWidth: photo.width, imageHeight: photo.height, updateResult: (uri) => this._updateCropResult(uri)});
  }

  _updateCropResult = (croppedImage) => {
    this.setState({cropped: true});
    this.setState({imageToBeUploaded: croppedImage});
    console.log("Cropped Image ==== ", croppedImage);
    navigationService.popToTop();
  }

  _gotoCamera = () => {
    console.log("Go to Camera === ");
    if (this.state.subject == '') {
      Alert.alert(
        'YOUR SUBJECT',
        'Please select your subject',
        [
          {
            text: 'OK',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel'
          }
        ],
        {cancelable: false}
      )
      return;
    }

    if(this.state.problemName == '') {
      Alert.alert(
        'YOUR PROBLEM TOPIC',
        'Please input your problem topic!',
        [
          {
            text: 'OK',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel'
          }
        ],
        {cancelable: false}
      )
      return;
    }
    navigationService.navigate(pages.CAMERA, {updatePhoto: (uri) => this._updateCameraPhoto(uri)});
  }

  _forwardClick = () => {
    if (this.state.subject == '') {
      Alert.alert(
        'YOUR SUBJECT',
        'Please select your subject',
        [
          {
            text: 'OK',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel'
          }
        ],
        {cancelable: false}
      )
      return;
    }

    if(this.state.problemName == '') {
      Alert.alert(
        'YOUR PROBLEM TOPIC',
        'Please input your problem topic!',
        [
          {
            text: 'OK',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel'
          }
        ],
        {cancelable: false}
      )
      return;
    }

    if (this.state.photoSource == '' || this.state.cropped == false) {
      Alert.alert(
        'YOUR PROBLEM IMAGE',
        'Please select your problem image!',
        [
          {
            text: 'OK',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel'
          }
        ],
        {cancelable: false}
      )
      return;
    }
    if (this.state.imageToBeUploaded != '') {
      uploadImage(this.state.imageToBeUploaded).then((data) => {
        console.log("Problem Uploaded!!!!");
        let newDocRef  = firestore.collection(this.state.subject).doc();
        newDocRef.set({
          problemId: newDocRef.id,
          posterId: auth.currentUser.uid,
          problemImage: data,
          updateTime: Date.now(),
          sessionExist: false,
          subject: this.state.subject,
          displaySubject: this.state.displaySubject,
          problemName: this.state.problemName
        }).catch((err) => {
          console.log("firestore set error ==== ", err);
        })
        .finally(() => {
        })
      }).catch((err) =>{
        console.log("Upload Error = ", err);
      });
      navigationService.navigate(pages.PROBLEM_SUBMITTED);
    }
  }

  _renderSubjects = (item) => {
    let oneItem = item.item;

    return (
      <TouchableOpacity 
        style={styles.selectionItem}
        onPress={()=> {this.setState({subject: oneItem.name.toLowerCase(), displaySubject: oneItem.displayName})}}
      >
          <Text style={{fontFamily: 'Montserrat-Medium', fontSize: getHeight(20), color: BLACK_PRIMARY}}>
            {oneItem.displayName}
          </Text>
          <RadioButton 
            isSelected={this.state.subject == oneItem.name.toLowerCase() ? true : false}
            onPress={()=> {this.setState({subject: oneItem.name.toLowerCase(), displaySubject: oneItem.displayName})}}
            size={getHeight(11)}
          />
      </TouchableOpacity>
    )
  }

  render () {
    const {subjects} = this.props;
    console.log("Learn Subjects === ", subjects);
    return (
      <SwitchPage leftSwitch={'Learn'} rightSwitch={'Teach'} switchChange={this._gotoTeach} switchValue={'left'}>
        {
          this.state.selecting == false ?
          <KeyboardAwareScrollView style={styles.workingPart} contentContainerStyle={styles.editPart}>
            <View style={{flex: 1}}>
              <Text
                style={styles.titleText}
              >
                Problem info
              </Text>
              <Text style={styles.subTitle}>
                Select subject
              </Text>
              <TouchableOpacity
                style={styles.btnSubject}
                onPress={()=>{this.setState({selecting: true})}}
              >
                <Text style={styles.btnText}>
                  {this.state.subject != '' ? this.state.displaySubject : 'Subject'}
                </Text>
                <Triangle width={getHeight(16)} height={getHeight(16)} color={PURPLE_MAIN} />
              </TouchableOpacity>
              <View style={{marginBottom: getHeight(30)}}>
                <Text style={styles.subTitle}>
                  Problem topic
                </Text>
                <TextInput
                  style={styles.problemName}
                  onChangeText={text => this._onChangeProblemName(text)}
                  defaultValue={this.state.problemName}
                />
              </View>
              {/* <View style={{marginBottom: getHeight(30)}}>
                <Text style={styles.subTitle}>
                  What's tripping you up?
                </Text>
                <TextInput
                  style={styles.problemName}
                  onChangeText={text => this._onChangeProblemName(text)}
                />
              </View> */}
              <Text
                style={[styles.titleText, {marginTop: getHeight(30)}]}
              >
                Upload
              </Text>
              <TouchableOpacity 
                style={styles.photoBtn}
                onPress={this._gotoCamera}
              >
                <Camera size={getHeight(24)} />
                <Text style={styles.btnText}>
                  Take photo
                </Text>
                {
                  this.state.photoSource == 'camera' && this.state.cropped == true ?
                  <Check size={getHeight(24)} />
                  :
                  <View style={{width: getHeight(24), height: getHeight(24)}}></View>
                }
              </TouchableOpacity>
              <TouchableOpacity style={[styles.photoBtn, {marginTop: getHeight(18)}]} onPress={() => {this.libraryClick()}}>
                <Picture size={getHeight(24)} />
                <Text style={styles.btnText}>
                  Camera roll
                </Text>
                {
                  this.state.photoSource == 'library' && this.state.cropped == true ?
                  <Check size={getHeight(24)} />
                  :
                  <View style={{width: getHeight(24), height: getHeight(24)}}></View>
                }
              </TouchableOpacity>
              <View style={{flex: 1, justifyContent: 'flex-end'}}>
                <BaseButton 
                    text={'Submit problem'}
                    onClick={this._forwardClick}
                    buttonStyle={{marginBottom: getHeight(30), backgroundColor: PURPLE_MAIN, alignSelf: 'center'}}
                    textStyle={{color: '#FFFFFF'}}
                />
              </View>
              
            </View>
          </KeyboardAwareScrollView>
          :
          <View style={{flex: 1, width: '100%'}}>
              <View style={styles.selectionHeader}>
                <Text style={{fontFamily: 'Montserrat-Medium', fontSize: getHeight(24), color: BLACK_PRIMARY}}>
                  Select Subject
                </Text>
                <TouchableOpacity
                  onPress={() => {this.setState({selecting: false})}}
                >
                  <Text style={{fontFamily: 'Montserrat-Medium', fontSize: getHeight(18), color: PURPLE_MAIN}}>
                    Save
                  </Text>
                </TouchableOpacity>
              </View>
              <FlatList 
                data={subjects.subject}
                renderItem={this._renderSubjects}
                keyExtractor={item => item.name}
                contentContainerStyle={{flex: 1, width: '100%'}}
                style={{flex: 1, width: '100%'}}
              />
          </View>
        }
        </SwitchPage>
    )
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        
    },
    workingPart: {
      flex: 1,
      height: '100%',
      width: '100%',
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
      fontSize: getHeight(16),
      color: BLACK_PRIMARY,
      marginLeft: getWidth(32),
      marginBottom: getHeight(20)
    },
    editPart: {
      flex:1,
      height: '100%',
      width: '100%',
    },
    btnSubject: {
      width: getWidth(308),
      height: getHeight(49),
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: PURPLE_MAIN,
      alignSelf: 'center',
      paddingLeft: getWidth(8),
      paddingRight: getWidth(11),
      marginBottom: getHeight(30)
    },
    problemName: {
      height: getHeight(42), 
      width: getWidth(308),
      alignSelf: 'center',
      borderColor: BLACK_PRIMARY, 
      borderBottomWidth: 1, 
      color: BLACK_PRIMARY, 
      fontFamily:  'Montserrat-Regular', 
      fontSize: getHeight(18), 
      paddingLeft: getWidth(10),
    },
    btnText: {
      fontFamily: 'Montserrat-Bold',
      color: PURPLE_MAIN,
      fontSize: getHeight(17)
    },
    photoBtn: {
      width: getWidth(308),
      height: getHeight(37),
      justifyContent: 'space-between',
      paddingHorizontal: getWidth(7),
      alignSelf: 'center',
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: GRAY_THIRD
    },
    selectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      paddingHorizontal: getWidth(33),
      alignSelf: 'center',
      marginTop: getHeight(33),
      marginBottom: getHeight(73)
    },
    selectionItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: getWidth(305),
      height: getHeight(70),
      borderBottomWidth: 2,
      borderColor: GRAY_THIRD,
      alignSelf: 'center',
      alignItems: 'center',
    }
})

const mapStateToProps = (state) => ({
  subjects: state.subject,
  user: state.user,
  bank: state.bank,
})

export default connect(mapStateToProps)(LearnScreen);