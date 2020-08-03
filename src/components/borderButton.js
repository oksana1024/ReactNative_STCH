import React from 'react';
import {TouchableOpacity, Text, StyleSheet, View, ActivityIndicator} from 'react-native';
import {PURPLE_MAIN, GRAY_THIRD} from '../constants/colors';
import PropTypes from 'prop-types';
import {getHeight, getWidth} from '../constants/dynamicSize';

const wrapperDefault = {
  width: getWidth(306),
  height: getHeight(50),
  borderWidth: 1,
  borderColor: GRAY_THIRD,
  backgroundColor: '#FFFFFF',
  justifyContent: 'center',
  alignItems: 'center'
};

const textDefault = {
  color: PURPLE_MAIN,
  fontFamily: 'Montserrat-Bold',
  fontSize: getHeight(17)
};

const disableDefault = {
  color: GRAY_THIRD,
  fontFamily: 'Montserrat-Bold',
  fontSize: getHeight(17)
}

const BorderButton = ({text, onClick, buttonStyle, textStyle, loading, disable}) => {
  if (loading == false) {
    return (
      <TouchableOpacity
        style={{...wrapperDefault, ...buttonStyle}}
        onPress={onClick}
        disabled={disable}
      >
        {
          disable == false ?
          <Text style={{...textDefault, ...textStyle}}>{text}</Text>
          :
          <Text style={{...disableDefault, ...textStyle}}>{text}</Text>
        }
        
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

BorderButton.defaultProps = {
  text: '',
  onClick: null,
  buttonStyle: {},
  textStyle: {},
  loading: false,
  disable: false,
};

BorderButton.propTypes = {
  text: PropTypes.string,
  onClick: PropTypes.func,
  buttonStyle: PropTypes.object,
  textStyle: PropTypes.object,
  loading: PropTypes.bool,
  disable: PropTypes.bool
};

export default BorderButton;