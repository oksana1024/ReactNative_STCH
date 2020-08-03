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
  justifyContent: 'flex-start',
  alignItems: 'center',
  flexDirection: 'row'
};

const textDefault = {
  color: '#FFFFFF',
  fontSize: getHeight(14),
  fontFamily: 'Montserrat-Regular',
  marginLeft: getWidth(5.66)
};

const ProfileNote = ({text, customStyle, optionSize, optionColor, textStyle}) => {
  return (
    <View
      style={{...wrapperDefault, ...customStyle}}
    >
      <Light size={optionSize} color={optionColor}/>
      <Text style={{...textDefault, ...textStyle}}>{text}</Text>
    </View>
  )
};

ProfileNote.defaultProps = {
  text: '',
  onClick: null,
  checked: false,
  customStyle: {},
  optionSize: getHeight(20),
  optionColor: '#FFFFFF',
  textStyle: {}
};

ProfileNote.propTypes = {
  text: PropTypes.string,
  onClick: PropTypes.func,
  checked: PropTypes.bool,
  customStyle: PropTypes.object,
  optionSize: PropTypes.number,
  optionColor: PropTypes.string,
  textStyle: PropTypes.object
};

export default ProfileNote;