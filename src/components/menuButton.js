import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import PropTypes from 'prop-types';
import { getHeight, getWidth } from '../constants/dynamicSize';
import Menu from '../components/icons/menu';

const wrapperDefault = {
  width: getWidth(36),
  height: getHeight(36),
  justifyContent: 'center',
  alignItems: 'center'
};

const MenuButton = ({ onClick, buttonStyle, buttonColor }) => {
  return (
    <TouchableOpacity style={{...wrapperDefault, ...buttonStyle}} onPress={onClick}>
        <Menu size={getWidth(36)} color={buttonColor} />
    </TouchableOpacity>
  )
};

MenuButton.defaultProps = {
  onClick: null,
  buttonStyle: {},
  buttonColor: '#FFFFFF'
};

MenuButton.propTypes = {
  onClick: PropTypes.func,
  buttonStyle: PropTypes.object,
  buttonColor: PropTypes.string
};

export default MenuButton;