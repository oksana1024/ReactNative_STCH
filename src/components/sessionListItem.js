import React from 'react';
import {TouchableOpacity, Text, StyleSheet, View, ActivityIndicator} from 'react-native';
import {PURPLE_MAIN, BLACK_PRIMARY, GRAY_PRIMARY, GREEN_PRIMARY, GRAY_SECONDARY} from '../constants/colors';
import PropTypes from 'prop-types';
import {getHeight, getWidth} from '../constants/dynamicSize';

const wrapperDefault = {
  width: '100%',
  height: getHeight(60),
  backgroundColor: BLACK_PRIMARY,
  borderBottomColor: PURPLE_MAIN,
  borderBottomWidth: 2,
  paddingHorizontal: getWidth(15)
};

const subjectDefault = {
  color: '#FFFFFF',
  fontFamily: 'Montserrat-Medium',
  fontSize: getHeight(18)
};

const nameDefault = {
  color: GRAY_SECONDARY,
  fontFamily: 'Montserrat-Bold',
  fontSize: getHeight(25)
}

const newSessionDefault = {
  color: '#FFFFFF',
  backgroundColor: GREEN_PRIMARY,
  borderRadius: 10,
  fontFamily: 'Montserrat-Bold',
  fontSize: getHeight(12),
  width: getWidth(40),
  height: getHeight(15),
  textAlign: 'center',
  marginTop: getHeight(10)
}

const typeDefault = {
  color: '#FFFFFF',
  fontFamily: 'Montserrat-Bold',
  fontSize: getHeight(12)
}

const SessionListItem = ({itemStyle, subject, name, subjectStyle, nameStyle, newExist, newStyle, onClick, typeStyle, sessionType}) => {
  
    return (
      <TouchableOpacity
        style={{...wrapperDefault, ...itemStyle}}
        onPress={onClick}
      >
        <View style={{flex: 7, justifyContent: 'flex-start'}}>
          <Text style={{...subjectDefault, ...subjectStyle}}>{subject}</Text>
          <Text style={{...nameDefault, ...nameStyle}}>{name}</Text>
        </View>
        <View style={{flex: 3, justifyContent: 'flex-end', alignItems: 'flex-end', paddingBottom: getHeight(10)}}>
          {
            sessionType == 'learn' ? 
            <Text style={{...typeDefault, ...typeStyle}}>LEARN</Text>
            :
            <Text style={{...typeDefault, ...typeStyle}}>TEACH</Text>
          }
          
          {
            newExist ? 
            <Text style={{...newSessionDefault, ...newStyle}}>New</Text>
            : null
          }
        </View>
      </TouchableOpacity>
    )
  
};

SessionListItem.defaultProps = {
  itemStyle: {},
  subject: '',
  name: '', 
  subjectStyle: {},
  nameStyle: {},
  newExist: false,
  newStyle: {},
  onClick: null,
  typeStyle: {},
  sessionType: 'learn'
};

SessionListItem.propTypes = {
  itemStyle: PropTypes.object,
  subject: PropTypes.string,
  name: PropTypes.string, 
  subjectStyle: PropTypes.object,
  nameStyle: PropTypes.object,
  newExist: PropTypes.bool,
  newStyle: PropTypes.bool,
  onClick: PropTypes.func,
  typeStyle: PropTypes.object,
  sessionType: PropTypes.string
};

export default SessionListItem;