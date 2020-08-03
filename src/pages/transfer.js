import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ActivityIndicator,
    Image,
    TextInput,
    TouchableOpacity,
    Alert
} from 'react-native';
import Page from '../components/basePage';
// import MenuPage from '../components/menuPage';
import TopBarPage from '../components/topBarPage';
import {getWidth, getHeight} from '../constants/dynamicSize';
import BaseButton from '../components/baseButton';
import MenuButton from '../components/menuButton';
import navigationService from '../navigation/navigationService';
import pages from '../constants/pages';
import {connect} from 'react-redux';
import Check from '../components/icons/check';
import {auth, firestore} from '../constants/firebase';
import { GREEN_PRIMARY, PURPLE_MAIN, BLACK_PRIMARY } from '../constants/colors';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const LOGO_IMAGE = require('../assets/images/logo.png');
const WORD_LOGO = require('../assets/images/word-logo.png');
const CHASE_IMAGE = require('../assets/images/bank-chase.png');
const AMERICA_IMAGE = require('../assets/images/bank-america.png');

class Transfer extends Component {
    
    constructor(props) {
        super(props);

        this.paymentsData = [
          {
            id: '0',
            name: 'chase',
            card_name: 'Chase, 8372',
            number: '8372',
            newItem: false
          },
          {
            id: '1',
            name: 'america',
            card_name: 'Bank of America, 0874',
            number: '0874',
            newItem: false
          },
          {
            id: 'new',
            newItem: true
          }
        ]
        this.state = {
          selected: 'chase',
          totalDisplay: '0.00',
          pendingDisplay: '0.00',
          available: 0,
          total: 0,
          pending: 0,
          prevBank: {},
          transferAmount: 0.00
        }
    }
    learnClick = () => {
        navigationService.navigate(pages.LEARN_SUBJECT);
    }

    teachClick = () => {
        navigationService.navigate(pages.TEACH_SUBJECT);
    }
    
    static getDerivedStateFromProps (props, state) {
        if (props.bank != null && props.bank != state.prevBank) {
          let bankBalance = props.bank.balance;
          if (bankBalance != null) {
            let totalDisplay = bankBalance.total;
            let pendingDisplay = bankBalance.pending;
            if (bankBalance.total != 0 && bankBalance.total * 100 % 100 == 0) {
              totalDisplay = bankBalance.total + '.00';
            }

            if (bankBalance.pending != 0 && bankBalance.pending * 100 % 100 == 0) {
              pendingDisplay = bankBalance.pending + '.00';
            }

            return {
              total: bankBalance.total,
              pending: bankBalance.pending,
              available: bankBalance.available,
              totalDisplay: totalDisplay,
              pendingDisplay: pendingDisplay,
              prevBank: props.bank
            }
          } else {
            return null;
          }
        }
        return null;
    }

    _renderTitle = () => {
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', paddingLeft: getWidth(10)}}>
                <Image 
                    style={{width: getWidth(191), height: getHeight(28)}}
                    resizeMode={'contain'}
                    source={WORD_LOGO}
                />
            </View>
            
        )
    }

    _renderListItem =(item) => {
      console.log(item.item);
      if (item.item.newItem == false) {
        
        switch (item.item.name) {
          case 'chase':
            return (
              <TouchableOpacity style={styles.listItem} onPress={() => {this.setState({selected: 'chase'})}}>
                <View style={{flexDirection: 'row'}}>
                  <Image style={{width: getWidth(24), height: getHeight(16), marginLeft: getWidth(24), marginRight: getWidth(16)}}
                    resizeMode={'contain'} source={CHASE_IMAGE}
                  />
                  <Text style={styles.listText}>
                    {item.item.card_name}
                  </Text>
                  
                </View>
                  {
                    this.state.selected == 'chase' ?
                    <View style={{marginRight: getWidth(29)}}>
                      <Check size={getHeight(20)} color={'#FFFFFF'}/>
                    </View>
                    : null
                  }
              </TouchableOpacity>
            )
          case 'america': 
            return (
              <TouchableOpacity style={styles.listItem} onPress={() => {this.setState({selected: 'america'})}}>
                <View style={{flexDirection: 'row'}}>
                  <Image style={{width: getWidth(24), height: getHeight(16), marginLeft: getWidth(24), marginRight: getWidth(16)}}
                    resizeMode={'contain'} source={AMERICA_IMAGE}
                  />
                  <Text style={styles.listText}>
                    {item.item.card_name}
                  </Text>
                  
                </View>
                  {
                    this.state.selected == 'america' ?
                    <View style={{marginRight: getWidth(29)}}>
                      <Check size={getHeight(20)} color={'#FFFFFF'}/>
                    </View>
                    : null
                  }
              </TouchableOpacity>
            )
        }
        
      } else {
        return (
          <TouchableOpacity style={{width: '100%', height: getHeight(40), flexDirection: 'row', alignItems: 'center', borderBottomColor: PURPLE_MAIN, borderBottomWidth: 2, backgroundColor: BLACK_PRIMARY}} onPress={this._addBank}>
            <Text style={{width: getWidth(24), height: getHeight(16), marginLeft: getWidth(24), marginRight: getWidth(16), color: '#FFFFFF', fontSize: getHeight(18)}}>+1</Text>
            <Text style={styles.newListText}>
              Add Bank Account
            </Text>
          </TouchableOpacity>
        )
      }

    }

    _addBank = () => {
      navigationService.navigate(pages.BANK_SETUP, {prevScreen: 'transfer'});
    }

    _clickTransfer = () => {
      if (this.state.moneyAmount > this.state.available) {
        Alert.alert(
          'Not Available',
          'You can not transfer money bigger than your available one',
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

      if (this.state.available == 0) {
        Alert.alert(
          'Not Available',
          'You have no available money to send',
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

      //SENT
      console.log("Money Transfer ==== ", this.state.transferAmount);
      let xhr = new XMLHttpRequest();
      xhr.open('GET', `https://us-central1-socrateach-65b77.cloudfunctions.net/proto/transferMoney/${auth.currentUser.uid}/${this.state.transferAmount}`);
      xhr.send();

      xhr.onload = () => { 
          if (xhr.status == 200) {
              let responseData = JSON.parse(xhr.response);
              if (responseData['result'] == true) {
                Alert.alert(
                  'Success',
                  'Money will be sent to your bank account!',
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
          }

          Alert.alert(
            'Failed',
            'Money can not be sent to your bank account!',
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
      // navigationService.navigate(pages.TRANSFER_STARTED)
    }

    _changeAmount = (text) => {
      let moneyAmount = parseFloat(text);
      this.setState({transferAmount: moneyAmount});
    }

    render () {
        return (
            <TopBarPage titleText={'TRANSFER'}>
                <KeyboardAwareScrollView style={styles.container} contentContainerStyle={styles.wrapper}>
                  <Text style={styles.title}>
                    AMOUNT
                  </Text>
                  <View style={styles.amountView}>
                    <Text style={styles.amountText}>
                      $
                    </Text>
                    <TextInput 
                      style={styles.amountInput}
                      defaultValue={'0.00'}
                      onChangeText={(text) => this._changeAmount(text)}
                      keyboardType={'numeric'}
                    />
                  </View>
                  <View style={styles.mainDescView}>
                    <View style={styles.mainDescFirst}>
                      <Text style={styles.mainDescNormal}>
                        Your Socra
                      </Text>
                      <Text style={styles.mainDescBold}>
                        Teach
                      </Text>
                      <Text style={styles.mainDescNormal}>
                        {' '}balance is ${this.state.totalDisplay}
                      </Text>
                    </View>
                    <Text style={styles.mainDescNormal}>
                      with ${this.state.pendingDisplay} pending
                    </Text>
                  </View>
                  <View style={styles.secDescView}>
                    <Text style={styles.secDesc}>
                      The money will be sent to the bank
                    </Text>
                    <Text style={styles.secDesc}>
                      account set up using Stripe
                    </Text>
                  </View>
                  <BaseButton 
                    onClick={this._clickTransfer}
                    text={'TRANSFER'}
                    buttonStyle={{marginBottom: getHeight(26)}}
                  />
                </KeyboardAwareScrollView>
            </TopBarPage>
        )
    }
}

Transfer.navigatorStyle = {
    navBarHidden: true,
    statusBarBlur: false
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
    },
    wrapper: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
    },
    logoImage: {
        width: getWidth(291),
        height: getHeight(151),
        marginBottom: getHeight(23),
        
    },
    title: {
      width: '100%',
      marginBottom: getHeight(18),
      color: '#FFFFFF',
      fontSize: getHeight(24), 
      fontFamily: 'Montserrat-Bold',
      textAlign: 'center',
      marginTop: getHeight(98)
    },
    amountView: {
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: getHeight(31),
      flexDirection: 'row'
    },
    amountText: {
      fontFamily: 'Montserrat-Bold',
      fontSize: getHeight(24),
      color: '#FFFFFF',
    },
    amountInput: {
      fontFamily: 'Montserrat-Bold',
      fontSize: getHeight(24),
      color: '#FFFFFF',
      width: getWidth(100),
      textAlign: 'center',
      borderWidth: 1,
      borderColor: '#FFFFFF',
      paddingVertical: getHeight(10)
    },
    mainDescView: {
      marginBottom: getHeight(256),
      justifyContent: 'center',
      alignItems: 'center'
    },
    mainDescFirst: {
      flexDirection: 'row',
    },
    mainDescNormal: {
      fontFamily: 'Montserrat-Regular',
      fontSize: getHeight(18),
      color: '#FFFFFF',
    },
    mainDescBold: {
      fontFamily: 'Montserrat-Bold',
      fontSize: getHeight(18),
      color: '#FFFFFF',
    },
    secDescView: {
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: getHeight(31)
    },
    secDesc: {
      fontFamily: 'Montserrat-Regular',
      fontSize: getHeight(16),
      color: '#FFFFFF',
    }
})

const mapStateToProps = (state) => ({
    subjects: state.subject,
    user: state.user,
    bank: state.bank
})
  
export default connect(mapStateToProps)(Transfer);