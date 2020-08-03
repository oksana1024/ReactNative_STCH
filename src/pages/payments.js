import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ActivityIndicator,
    Image,
    FlatList,
    TouchableOpacity
} from 'react-native';
import TopBarPage from '../components/topBarPage';
import {getWidth, getHeight} from '../constants/dynamicSize';
import navigationService from '../navigation/navigationService';
import pages from '../constants/pages';
import {connect} from 'react-redux';
import { GREEN_PRIMARY, PURPLE_MAIN, BLACK_PRIMARY } from '../constants/colors';
import {firestore, auth} from '../constants/firebase';
import _ from 'lodash';

const WORD_LOGO = require('../assets/images/word-logo.png');
const VISA_IMAGE = require('../assets/images/visa.png');
const MASTER_IMAGE = require('../assets/images/master.png');
const AMEX_IMAGE = require('../assets/images/americanexpress.png');
const JCB_IMAGE = require('../assets/images/jcb.png');
const DISCOVER_IMAGE = require('../assets/images/discover.png');
const DINERS_IMAGE = require('../assets/images/diners-club.png');

class Payments extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
          prevPayments: null,
          paymentData: [
            {
              id: 'new',
              newItem: true
            }
          ]
        }
    }
    
    static getDerivedStateFromProps (props, state) {
      console.log("Payments Array = ", props.payment);
        if (props.payment != null && props.payment != state.prevPayments) {
          
          let paymentArray = _.map(props.payment, item => {
            let Brand = item.card.brand;
            let newItem = {
              id: item.cardId,
              name: Brand,
              card_name: Brand.charAt(0).toUpperCase() + Brand.slice(1) + ', ' + item.card.last4,
              number: item.card.last4,
              newItem: false
            }
            return newItem;
          })
          paymentArray.push({
            id: 'new',
            newItem: true
          })
          
          return {
            paymentData: paymentArray,
            prevPayments: props.payment
          }
        } else {
          return {
            paymentData: [{
              id: 'new',
              newItem: true
            }]
          };
        }
        
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

    _addPayment = () => {
      navigationService.navigate(pages.PAYMENTS_SETUP);
    }

    _editPayment = (cardId) => {
      firestore.collection('users').doc(auth.currentUser.uid).collection('cards').doc(cardId).get().then(doc => {
        navigationService.navigate(pages.PAYMENTS_EDIT, {cardInfo: doc.data(), cardId: cardId});
      })
      
    }

    _renderListItem =(item) => {
      if (item.item.newItem == false) {
        switch (item.item.name) {
          case 'visa':
            return (
              <TouchableOpacity style={styles.listItem} onPress={() => this._editPayment(item.item.id)}>
                  <Image style={{width: getWidth(24), height: getHeight(16), marginLeft: getWidth(24), marginRight: getWidth(16)}}
                    resizeMode={'contain'} source={VISA_IMAGE}
                  />
                  <Text style={styles.listText}>
                    {'Visa, ' + item.item.number}
                  </Text>
              </TouchableOpacity>
            )
          case 'mastercard': 
            return (
              <TouchableOpacity style={styles.listItem} onPress={() => this._editPayment(item.item.id)}>
                  <Image style={{width: getWidth(24), height: getHeight(16), marginLeft: getWidth(24), marginRight: getWidth(16)}}
                    resizeMode={'contain'} source={MASTER_IMAGE}
                  />
                  <Text style={styles.listText}>
                    {'Mastercard, ' + item.item.number}
                  </Text>
              </TouchableOpacity>
            )
          case 'amex':
            return (
              <TouchableOpacity style={styles.listItem} onPress={() => this._editPayment(item.item.id)}>
                  <Image style={{width: getWidth(24), height: getHeight(30), marginLeft: getWidth(24), marginRight: getWidth(16)}}
                    resizeMode={'contain'} source={AMEX_IMAGE}
                  />
                  <Text style={styles.listText}>
                    {'American Express, ' + item.item.number}
                  </Text>
              </TouchableOpacity>
            )
          case 'discover': 
            return (
              <TouchableOpacity style={styles.listItem} onPress={() => this._editPayment(item.item.id)}>
                  <Image style={{width: getWidth(20), height: getHeight(24), marginLeft: getWidth(24), marginRight: getWidth(16)}}
                    resizeMode={'contain'} source={DISCOVER_IMAGE}
                  />
                  <Text style={styles.listText}>
                    {'Discover, ' + item.item.number}
                  </Text>
              </TouchableOpacity>
            )
          case 'diners':
            return (
              <TouchableOpacity style={styles.listItem} onPress={() => this._editPayment(item.item.id)}>
                  <Image style={{width: getWidth(20), height: getHeight(24), marginLeft: getWidth(24), marginRight: getWidth(16)}}
                    resizeMode={'contain'} source={DINERS_IMAGE}
                  />
                  <Text style={styles.listText}>
                    {'Diners Club, ' + item.item.number}
                  </Text>
              </TouchableOpacity>
            )
          case 'jcb':
            return (
              <TouchableOpacity style={styles.listItem} onPress={() => this._editPayment(item.item.id)}>
                  <Image style={{width: getWidth(20), height: getHeight(24), marginLeft: getWidth(24), marginRight: getWidth(16)}}
                    resizeMode={'contain'} source={JCB_IMAGE}
                  />
                  <Text style={styles.listText}>
                    {'JCB, ' + item.item.number}
                  </Text>
              </TouchableOpacity>
            )
        }
        
      } else {
        return (
          <TouchableOpacity style={styles.listItem} onPress={this._addPayment}>
            <Text style={{width: getWidth(24), height: getHeight(16), marginLeft: getWidth(24), marginRight: getWidth(16), color: '#FFFFFF', fontSize: getHeight(18)}}>+1</Text>
            <Text style={styles.newListText}>
              Add Credit/Debit
            </Text>
          </TouchableOpacity>
        )
      }

    }

    render () {
        return (
            <TopBarPage titleText={'PAYMENTS'}>
                <View style={styles.container}>
                    <FlatList 
                      data={this.state.paymentData}
                      renderItem={item => this._renderListItem(item)}
                      keyExtractor={item => item.id}
                      contentContainerStyle={{flex: 1, width: '100%'}}
                      style={{flex: 1, width: '100%'}}
                    />
                </View>
            </TopBarPage>
        )
    }
}

Payments.navigatorStyle = {
    navBarHidden: true,
    statusBarBlur: false
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        paddingTop: getHeight(56)
    },
    logoImage: {
        width: getWidth(291),
        height: getHeight(151),
        marginBottom: getHeight(23),
        
    },
    listText: {
      fontFamily: 'Montserrat-Medium',
      fontSize: getHeight(18),
      color: '#FFFFFF'
    },
    newListText: {
      fontFamily: 'Montserrat-Medium',
      fontSize: getHeight(18),
      color: GREEN_PRIMARY
    },
    listItem: {
      width: '100%', 
      height: getHeight(40), 
      flexDirection: 'row', 
      alignItems: 'center', 
      borderBottomColor: PURPLE_MAIN, 
      borderBottomWidth: 2, 
      backgroundColor: BLACK_PRIMARY
    }
})

const mapStateToProps = (state) => ({
    subjects: state.subject,
    payment: state.payment
  })
  
  export default connect(mapStateToProps)(Payments);