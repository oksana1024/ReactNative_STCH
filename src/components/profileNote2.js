import React from 'react';
import {TouchableOpacity, Text, View} from 'react-native';
import PropTypes from 'prop-types';
import {getHeight, getWidth} from '../constants/dynamicSize';
import Light from './icons/light';

const wrapperDefault = {
  width: '100%',
  paddingLeft: getWidth(25.02),
  paddingRight: getWidth(24),
  backgroundColor: 'transparent',
  alignItems: 'center',
  flexDirection: 'row'
};

const textDefault = {
  color: '#FFFFFF',
  fontSize: getHeight(14),
  fontFamily: 'Montserrat-Regular',
  marginLeft: getWidth(5.66)
};

const ProfileNote = ({text1, text2, customStyle, optionSize, optionColor, textStyle}) => {
  return (
    <View
      style={{...wrapperDefault, ...customStyle}}
    >
      <Light size={optionSize} color={optionColor}/>
      <View style={{marginLeft: getWidth(5.66)}}>
        <Text style={{...textDefault, ...textStyle}}>{text1}</Text>
        <Text style={{...textDefault, ...textStyle}}>{text2}</Text>
      </View>
      
    </View>
  )
};

ProfileNote.defaultProps = {
  text1: '',
  text2: '',
  onClick: null,
  checked: false,
  customStyle: {},
  optionSize: getHeight(20),
  optionColor: '#FFFFFF',
  textStyle: {}
};

ProfileNote.propTypes = {
  text1: PropTypes.string,
  text2: PropTypes.string,
  onClick: PropTypes.func,
  checked: PropTypes.bool,
  customStyle: PropTypes.object,
  optionSize: PropTypes.number,
  optionColor: PropTypes.string,
  textStyle: PropTypes.object
};

export default ProfileNote;