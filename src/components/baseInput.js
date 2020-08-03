import React from 'react';
import {TextInput, Text, View, Platform} from 'react-native';
import {PURPLE_MAIN} from '../constants/colors';
import PropTypes from 'prop-types';
import {getHeight, getWidth} from '../constants/dynamicSize';

const wrapperDefault = {
  width: '100%',
  paddingLeft: getWidth(35),
  paddingRight: getWidth(64),
  justifyContent: 'center',
  alignItems: 'center'
};

const descDefault = {
  color: '#FFFFFF',
  fontFamily: 'Montserrat-Medium',
  fontSize: getHeight(18),
  width: '100%',
  paddingLeft: getWidth(8)
};

const textDefault = {
  color: 'white',
  fontFamily: 'Montserrat-Medium',
  fontSize: getHeight(14),
  width: '100%',
  paddingLeft: getWidth(10),
  height: getHeight(20),
  paddingVertical: 0
}

const errorDefault = {
  color: 'red',
  fontFamily: 'Montserrat-Medium',
  fontSize: getHeight(12),
  width: '100%',
  paddingLeft: getWidth(10),
}

const ComonInput = ({desc, onChangeText, wrapperStyle, descStyle, textStyle, pwdType, errorText, errorExist, errorStyle, placeholder, keyboardType}) => {
  return (
    <View
      style={{...wrapperDefault, ...wrapperStyle}}
    >
      <Text style={{...descDefault, ...descStyle}}>{desc}</Text>
      {
        pwdType == true ? 
        <TextInput style={{...textDefault, ...textStyle}} onChangeText={onChangeText} secureTextEntry={true} placeholder={placeholder} placeholderTextColor={'#d3d3d3'} keyboardType={keyboardType}></TextInput>
        :
        <TextInput style={{...textDefault, ...textStyle}} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor={'#d3d3d3'} keyboardType={keyboardType}></TextInput>  
      }
      
      <View style={{width: '100%', backgroundColor: '#FFFFFF', height: 2}} />
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
  onChangeText: null,
  descStyle: {},
  textStyle: {},
  pwdType: false,
  wrapperStyle: {},
  errorExist: false,
  errorStyle: {},
  errorText: '',
  placeholder: '',
  keyboardType: 'default'
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
  keyboardType: PropTypes.string
};

export default ComonInput;