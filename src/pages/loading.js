import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ActivityIndicator
} from 'react-native';
import {PURPLE_MAIN, BLACK_PRIMARY} from '../constants/colors';
import Page from '../components/basePage';
import {getHeight} from '../constants/dynamicSize';
import {appInitialized} from '../controller/init';
import {connect} from 'react-redux';

class Loading extends Component {

    componentDidMount() {
        const {dispatch} = this.props;
        // setTimeout(() => {
        //     navigationService.navigate(pages.AUTH);
        // }, 3000);
        dispatch(appInitialized());
    }

    render () {
        return (
            <Page>
                <View style={styles.container} >
                    <Text style={styles.loadText}>Loading...</Text>
                    <ActivityIndicator size={'large'} />
                </View>
            </Page>
            
        )
    }
};

Loading.navigatorStyle = {
    navBarHidden: true,
    statusBarBlur: false
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    loadText: {
        paddingBottom: getHeight(10),
        color: BLACK_PRIMARY,
        fontFamily: 'Montserrat-Bold',
    }
});

const mapStateToProps = (state) => ({
})

export default connect(mapStateToProps)(Loading);