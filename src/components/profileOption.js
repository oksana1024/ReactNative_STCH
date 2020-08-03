import React from 'react';
import {TouchableOpacity, Text} from 'react-native';
import PropTypes from 'prop-types';
import {getHeight, getWidth} from '../constants/dynamicSize';
import Checked from '../components/icons/checked';
import Unchecked from '../components/icons/unchecked';

const wrapperDefault = {
  flex: 1,
  width: '100%',
  paddingLeft: getWidth(13),
  backgroundColor: 'transparent',
  justifyContent: 'flex-start',
  alignItems: 'center',
  flexDirection: 'row'
};

const textDefault = {
  color: '#FFFFFF',
  fontSize: getHeight(14),
  fontFamily: 'Montserrat-Regular',
  marginLeft: getWidth(9)
};

const ProfileOption = ({text, onClick, checked, customStyle, optionSize, optionColor, textStyle}) => {
  return (
    <TouchableOpacity
      style={{...wrapperDefault, ...customStyle}}
      onPress={onClick}
    >
      {
        checked == true ?
        <Checked size={optionSize} color={optionColor}/>
        :
        <Unchecked size={optionSize} color={optionColor} />
      }
      <Text style={{...textDefault, ...textStyle}}>{text}</Text>
    </TouchableOpacity>
  )
};

ProfileOption.defaultProps = {
  text: '',
  onClick: null,
  checked: false,
  customStyle: {},
  optionSize: getHeight(20),
  optionColor: '#FFFFFF',
  textStyle: {}
};

ProfileOption.propTypes = {
  text: PropTypes.string,
  onClick: PropTypes.func,
  checked: PropTypes.bool,
  customStyle: PropTypes.object,
  optionSize: PropTypes.number,
  optionColor: PropTypes.string,
  textStyle: PropTypes.object
};

export default ProfileOption;