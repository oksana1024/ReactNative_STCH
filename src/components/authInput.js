import React from 'react';
import {TextInput, Text, View, Platform} from 'react-native';
import {PURPLE_MAIN, BLACK_PRIMARY} from '../constants/colors';
import PropTypes from 'prop-types';
import {getHeight, getWidth} from '../constants/dynamicSize';

const wrapperDefault = {
  width: '100%',
  paddingLeft: getWidth(33),
  paddingRight: getWidth(36),
  justifyContent: 'center',
  alignItems: 'center'
};

const descDefault = {
  color: BLACK_PRIMARY,
  fontFamily: 'Montserrat-Medium',
  fontSize: getHeight(16),
  width: '100%'
};

const textDefault = {
  color: BLACK_PRIMARY,
  fontFamily: 'Montserrat-Regular',
  fontSize: getHeight(16),
  width: '100%',
  height: getHeight(35),
  paddingVertical: 0
}

const errorDefault = {
  color: 'red',
  fontFamily: 'Montserrat-Medium',
  fontSize: getHeight(12),
  width: '100%',
  paddingLeft: getWidth(10),
}

const ComonInput = ({desc, onChangeText, wrapperStyle, descStyle, textStyle, pwdType, errorText, errorExist, errorStyle, placeholder, keyboardType, autoFocus, defaultValue, autoCap, activeInput, returnKeyType, onSubmitEditing, onFocus, disabled}) => {
  return (
    <View
      style={{...wrapperDefault, ...wrapperStyle}}
    >
      <Text style={{...descDefault, ...descStyle}}>{desc}</Text>
      {
        pwdType == true ? 
        <TextInput style={{...textDefault, ...textStyle}} autoFocus={autoFocus} onChangeText={onChangeText} secureTextEntry={true} placeholder={placeholder} placeholderTextColor={'#d0d0d0'} keyboardType={keyboardType} returnKeyType={returnKeyType} onSubmitEditing={onSubmitEditing} onFocus={onFocus} editable={!disabled} selectTextOnFocus={!disabled}
        ></TextInput>
        :
        <TextInput style={{...textDefault, ...textStyle}} autoFocus={autoFocus} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor={'#a0a0a0'} keyboardType={keyboardType} defaultValue={defaultValue} autoCapitalize={autoCap == true ? 'words' : 'none'} returnKeyType={returnKeyType} onSubmitEditing={onSubmitEditing} onFocus={onFocus} editable={!disabled} selectTextOnFocus={!disabled}></TextInput> 
      }
      {
        activeInput == false ?
        <View style={{width: '100%', backgroundColor: '#E5E5E5', height: 1, paddingLeft: getWidth(1)}} />
        : 
        <View style={{width: '100%', backgroundColor: BLACK_PRIMARY, height: 2, paddingLeft: getWidth(1)}} />
      }
      {
        errorExist == true ? 
        <Text style={{...errorDefault, ...errorStyle}}>{errorText}</Text>
        : null
      }
    </View>
  )
};

ComonInput.defaultProps = {
  desc: '',
  onChangeText: () => null,
  descStyle: {},
  textStyle: {},
  pwdType: false,
  wrapperStyle: {},
  errorExist: false,
  errorStyle: {},
  errorText: '',
  placeholder: '',
  keyboardType: 'default',
  autoFocus: false,
  defaultValue: '',
  autoCap: false,
  activeInput: false,
  returnKeyType: 'default',
  // getRef: () => null,
  onSubmitEditing: () => null,
  onFocus: () => null,
  disabled: false
};

ComonInput.propTypes = {
  desc: PropTypes.string,
  onChangeText: PropTypes.func,
  descStyle: PropTypes.object,
  textStyle: PropTypes.object,
  pwdType: PropTypes.bool,
  wrapperStyle: PropTypes.object,
  errorText: PropTypes.bool,
  errorStyle: PropTypes.object,
  errorText: PropTypes.string,
  placeholder: PropTypes.string,
  keyboardType: PropTypes.string,
  autoFocus: PropTypes.bool,
  defaultValue: PropTypes.string,
  autoCap: PropTypes.bool,
  activeInput: PropTypes.bool,
  returnKeyType: PropTypes.string,
  // getRef: PropTypes.string,
  onSubmitEditing: PropTypes.func,
  onFocus: PropTypes.func,
  disabled: PropTypes.bool
};

export default ComonInput;