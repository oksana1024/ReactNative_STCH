import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ActivityIndicator,
    TouchableOpacity,
    Image,
    Linking
} from 'react-native';
import {BLACK_PRIMARY, PURPLE_MAIN, GRAY_THIRD} from '../constants/colors';
import Page from '../components/basePage';
import NavPage from '../components/navPage';
import RadioButton from '../components/radioButton';
import {getHeight, getWidth} from '../constants/dynamicSize';
import {connect} from 'react-redux';
import Forward from '../components/icons/forward';
import navigationService from '../navigation/navigationService';
import pages from '../constants/pages';

class Help extends Component {

  constructor(props) {
    super(props)

    this.state = {

    }
  }

    componentDidMount() {
        
    }

    _gotoHome = () => {
      navigationService.reset(pages.LOADING);
    }

    _gotoPolicy = () => {
      let url = `http://socrateach.com/privacy-policy/`;
      Linking.canOpenURL(url)
      .then((supported) => {
        if (!supported) {
          console.log("Can't handle url: " + url);
        } else {
          return Linking.openURL(url);
        }
      })
      .catch((err) => console.error('An error occurred', err));
    }

    _gotoTerms = () => {
      let url = `https://www.apple.com/legal/internet-services/itunes/dev/stdeula/`;
      Linking.canOpenURL(url)
      .then((supported) => {
        if (!supported) {
          console.log("Can't handle url: " + url);
        } else {
          return Linking.openURL(url);
        }
      })
      .catch((err) => console.error('An error occurred', err));
    }

    _gotoContact = () => {
      let url = `mailto:admin@socrateach.com`;
      Linking.canOpenURL(url)
      .then((supported) => {
        if (!supported) {
          console.log("Can't handle url: " + url);
        } else {
          return Linking.openURL(url);
        }
      })
      .catch((err) => console.error('An error occurred', err));
    }

    _goBack = () => {
      navigationService.pop()
    }

    render () {
        return (
          <NavPage onLeftClick={this._goBack}>
            <View style={{flex: 1, width: '100%'}}>
              <View style={styles.selectionHeader}>
                <Text style={{fontFamily: 'Montserrat-Medium', fontSize: getHeight(24), color: BLACK_PRIMARY}}>
                  Help
                </Text>
                {/* <TouchableOpacity
                  onPress={this._saveConfiguration}
                >
                  <Text style={{fontFamily: 'Montserrat-Medium', fontSize: getHeight(18), color: PURPLE_MAIN}}>
                    Save to Send
                  </Text>
                </TouchableOpacity> */}
              </View>
              <TouchableOpacity style={styles.selectionItem} onPress={this._gotoPolicy}>
                  <Text style={{fontFamily: 'Montserrat-Medium', fontSize: getHeight(16), color: BLACK_PRIMARY}}>
                    Privacy Policy
                  </Text>
                  <Forward size={getHeight(24)} color={GRAY_THIRD} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.selectionItem}>
                  <Text style={{fontFamily: 'Montserrat-Medium', fontSize: getHeight(16), color: BLACK_PRIMARY}}>
                    Copyright
                  </Text>
                  <Forward size={getHeight(24)} color={GRAY_THIRD} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.selectionItem} onPress={this._gotoTerms}>
                  <Text style={{fontFamily: 'Montserrat-Medium', fontSize: getHeight(16), color: BLACK_PRIMARY}}>
                    Terms & Conditions
                  </Text>
                  <Forward size={getHeight(24)} color={GRAY_THIRD} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.selectionItem} onPress={this._gotoContact}>
                  <View>
                    <Text style={{fontFamily: 'Montserrat-Medium', fontSize: getHeight(14), color: BLACK_PRIMARY}}>
                      Contact admin@socrateach.com for
                    </Text>
                    <Text style={{fontFamily: 'Montserrat-Medium', fontSize: getHeight(14), color: BLACK_PRIMARY}}>
                      further questions
                    </Text>
                  </View>
                  
                  <Forward size={getHeight(24)} color={GRAY_THIRD} />
              </TouchableOpacity>
              
            </View>
          </NavPage>
            
        )
    }
};

Help.navigatorStyle = {
    navBarHidden: true,
    statusBarBlur: false
};

const styles = StyleSheet.create({
  selectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: getWidth(33),
    alignSelf: 'center',
    marginTop: getHeight(33),
    marginBottom: getHeight(34)
  },
  selectionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: getWidth(305),
    height: getHeight(47),
    borderBottomWidth: 2,
    borderColor: GRAY_THIRD,
    alignSelf: 'center',
    alignItems: 'center',
    marginBottom: getHeight(16),
    paddingHorizontal: getWidth(10)
  }
});

const mapStateToProps = (state) => ({
})

export default connect(mapStateToProps)(Help);