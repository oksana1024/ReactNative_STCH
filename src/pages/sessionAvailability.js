import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ActivityIndicator,
    TouchableOpacity,
    FlatList
} from 'react-native';
import {BLACK_PRIMARY, PURPLE_MAIN, GRAY_THIRD} from '../constants/colors';
import Page from '../components/basePage';
import NavPage from '../components/navPage';
import RadioButton from '../components/radioButton';
import {getHeight, getWidth} from '../constants/dynamicSize';
import {connect} from 'react-redux';
import navigationService from '../navigation/navigationService';
import pages from '../constants/pages';
import {withMappedNavigationParams} from 'react-navigation-props-mapper';

@withMappedNavigationParams()
class SessionAvailability extends Component {

  constructor(props) {
    super(props);

    this.state={
      starting: props.startingValue ? props.startingValue : 0,
      duration: props.sessionDuration ? props.sessionDuration: 1
    }
    console.log("this.props === ", props);
  }

    _goBack = () => {
      navigationService.pop();
    }

    _saveConfiguration = () => {
      this.props.avaSet(this.state.starting, this.state.duration);
    }

    render () {
        return (
            <NavPage onLeftClick={this._goBack}>
                <View style={{flex: 1, width: '100%'}}>
                  <View style={styles.selectionHeader}>
                    <Text style={{fontFamily: 'Montserrat-Medium', fontSize: getHeight(24), color: BLACK_PRIMARY}}>
                      Available starting
                    </Text>
                    <TouchableOpacity
                      onPress={this._saveConfiguration}
                    >
                      <Text style={{fontFamily: 'Montserrat-Medium', fontSize: getHeight(20), color: PURPLE_MAIN}}>
                        Send
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity style={styles.selectionItem} onPress={()=> {this.setState({starting: 0})}}>
                      <Text style={{fontFamily: 'Montserrat-Medium', fontSize: getHeight(20), color: BLACK_PRIMARY}}>
                        Now
                      </Text>
                      <RadioButton 
                        isSelected={this.state.starting == 0 ? true : false}
                        onPress={()=> {this.setState({starting: 0})}}
                        size={getHeight(11)}
                      />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.selectionItem} onPress={()=> {this.setState({starting: 1})}}>
                      <Text style={{fontFamily: 'Montserrat-Medium', fontSize: getHeight(20), color: BLACK_PRIMARY}}>
                        In 1 hour
                      </Text>
                      <RadioButton 
                        isSelected={this.state.starting == 1 ? true : false}
                        onPress={()=> {this.setState({starting: 1})}}
                        size={getHeight(11)}
                      />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.selectionItem} onPress={()=> {this.setState({starting: 2})}}>
                      <Text style={{fontFamily: 'Montserrat-Medium', fontSize: getHeight(20), color: BLACK_PRIMARY}}>
                        In 2 hours
                      </Text>
                      <RadioButton 
                        isSelected={this.state.starting == 2 ? true : false}
                        onPress={()=> {this.setState({starting: 2})}}
                        size={getHeight(11)}
                      />
                  </TouchableOpacity>
                  <View style={styles.selectionHeader}>
                    <Text style={{fontFamily: 'Montserrat-Medium', fontSize: getHeight(24), color: BLACK_PRIMARY}}>
                      For how long?
                    </Text>
                  </View>
                  <TouchableOpacity style={styles.selectionItem} onPress={()=> {this.setState({duration: 1})}}>
                      <Text style={{fontFamily: 'Montserrat-Medium', fontSize: getHeight(20), color: BLACK_PRIMARY}}>
                        1 hour
                      </Text>
                      <RadioButton 
                        isSelected={this.state.duration == 1 ? true : false}
                        onPress={()=> {this.setState({duration: 1})}}
                        size={getHeight(11)}
                      />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.selectionItem} onPress={()=> {this.setState({duration: 2})}}>
                      <Text style={{fontFamily: 'Montserrat-Medium', fontSize: getHeight(20), color: BLACK_PRIMARY}}>
                        2 hours
                      </Text>
                      <RadioButton 
                        isSelected={this.state.duration == 2 ? true : false}
                        onPress={()=> {this.setState({duration: 2})}}
                        size={getHeight(11)}
                      />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.selectionItem} onPress={()=> {this.setState({duration: 3})}}>
                      <Text style={{fontFamily: 'Montserrat-Medium', fontSize: getHeight(20), color: BLACK_PRIMARY}}>
                        3 hours
                      </Text>
                      <RadioButton 
                        isSelected={this.state.duration == 3 ? true : false}
                        onPress={()=> {this.setState({duration: 3})}}
                        size={getHeight(11)}
                      />
                  </TouchableOpacity>
                </View>
            </NavPage>
            
        )
    }
};

SessionAvailability.navigatorStyle = {
    navBarHidden: true,
    statusBarBlur: false
};

const styles = StyleSheet.create({
  selectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingLeft: getWidth(32),
    paddingRight: getWidth(30),
    alignSelf: 'center',
    marginTop: getHeight(33),
    marginBottom: getHeight(57),
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
});

const mapStateToProps = (state) => ({
})

export default connect(mapStateToProps)(SessionAvailability);