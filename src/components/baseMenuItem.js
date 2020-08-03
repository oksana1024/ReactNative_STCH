import React from 'react';
import {TouchableOpacity, Text, View} from 'react-native';
import {PURPLE_MAIN, BLACK_PRIMARY, GRAY_THIRD, RED_PRIMARY} from '../constants/colors';
import PropTypes from 'prop-types';
import {getHeight, getWidth} from '../constants/dynamicSize';
import Notification from './icons/notification';

const wrapperDefault = {
  width: '100%',  
  backgroundColor: 'white',
  justifyContent: 'center',
};

const textDefault = {
  color: BLACK_PRIMARY,
  fontFamily: 'Montserrat-Medium',
  fontSize: getHeight(22),
  marginLeft: getWidth(16),
  
};

const iconViewDefault = {
  width: getWidth(52),
  height: '100%',
  justifyContent: 'center',
  alignItems: 'center'
}

const borderViewDefault = {
  marginLeft: getWidth(13),
  marginRight: getWidth(29),
  marginBottom: getHeight(18),
  height: 1,
  backgroundColor: GRAY_THIRD 
}

const CommonMenu = ({text, onClick, wrapperStyle, textStyle, borderViewStyle, notiExist}) => {
  return (
    <TouchableOpacity
      style={{...wrapperDefault, ...wrapperStyle}}
      onPress={onClick}
    >
      <View
        style={{...borderViewDefault, ...borderViewStyle}}
      >
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: getHeight(18), justifyContent: 'space-between', paddingRight: getWidth(30)}}>
        <Text style={{...textDefault, ...textStyle}}>{text}</Text>
        {
          notiExist == true ?
          <Notification size={getHeight(21)} color={RED_PRIMARY}/>
          : null
        }
      </View>
      
    </TouchableOpacity>
  )
};

CommonMenu.defaultProps = {
  text: '',
  onClick: null,
  wrapperStyle: {},
  textStyle: {},
  notiExist: false,
  borderViewStyle: {}
};

CommonMenu.propTypes = {
  text: PropTypes.string,
  onClick: PropTypes.func,
  wrapperStyle: PropTypes.object,
  textStyle: PropTypes.object,
  notiExist: PropTypes.bool,
  borderViewStyle: PropTypes.object
};

export default CommonMenu;