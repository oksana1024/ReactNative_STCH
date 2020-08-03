import React from 'react';
import {TouchableOpacity, Text, StyleSheet, View, ActivityIndicator} from 'react-native';
import {PURPLE_MAIN} from '../constants/colors';
import PropTypes from 'prop-types';
import {getHeight, getWidth} from '../constants/dynamicSize';

const wrapperDefault = {
  width: getWidth(306),
  height: getHeight(50),
  borderRadius: getWidth(10),
  backgroundColor: '#FFFFFF',
  justifyContent: 'center',
  alignItems: 'center'
};

const textDefault = {
  color: PURPLE_MAIN,
  fontFamily: 'Montserrat-Bold',
  fontSize: getHeight(17)
};

const ComonButton = ({text, onClick, buttonStyle, textStyle, loading}) => {
  if (loading == false) {
    return (
      <TouchableOpacity
        style={{...wrapperDefault, ...buttonStyle}}
        onPress={onClick}
      >
        <Text style={{...textDefault, ...textStyle}}>{text}</Text>
      </TouchableOpacity>
    )
  } else {
    return (
      <View
        style={{...wrapperDefault, ...buttonStyle}}
      >
        <ActivityIndicator size={'small'} />
      </View>
    )
  }
  
};

ComonButton.defaultProps = {
  text: '',
  onClick: null,
  buttonStyle: {},
  textStyle: {},
  loading: false
};

ComonButton.propTypes = {
  text: PropTypes.string,
  onClick: PropTypes.func,
  buttonStyle: PropTypes.object,
  textStyle: PropTypes.object,
  loading: PropTypes.bool
};

export default ComonButton;