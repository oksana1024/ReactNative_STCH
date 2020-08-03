import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StatusBar, View, StyleSheet, Text, Platform, SafeAreaView} from 'react-native';
import {getHeight, getWidth} from '../constants/dynamicSize';
import {PURPLE_MAIN} from '../constants/colors';

const statusExist = Platform.OS == 'android' ? false : true;

const mainStyle = {
    height: '100%',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
}
const ContentContainer = ({ children, backgroundColor, statusBarExist}) => {
    return (
        <View 
            style={{
                ...mainStyle, 
                backgroundColor: backgroundColor
            }}
        >
            {children}
        </View>
    )
}

const Page = ({
    children,
    backgroundColor,
    forceInset,
    statusBarExist
}) => {
    return (
        <SafeAreaView forceInset={forceInset} style={{backgroundColor: backgroundColor}}>
            {
                statusBarExist == true ? 
                <StatusBar backgroundColor={backgroundColor} translucent />
                : <StatusBar backgroundColor={backgroundColor} hidden />
            }            
            <ContentContainer
                backgroundColor={backgroundColor}
                statusBarExist={statusBarExist}
            >
                {children}
            </ContentContainer>
        </SafeAreaView>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    contentContainer: {
        height: '100%',
        width: '100%',
        display: 'flex'
    }
});

Page.defaultProps = {
    backgroundColor: '#FFFFFF',
    statusBarExist: statusExist
};

Page.propTypes = {
    backgroundColor: PropTypes.string,
    statusBarExist: PropTypes.bool
};

export default Page;