import React, {Component} from 'react';
import { View, Animated, Image } from 'react-native';
import PropTypes from 'prop-types';
import styles from './Cropper.component.style';

class Cropper extends Component {

  render () {
    return (
      <View style={styles.container}>
        <View style={styles.secondContainer}>
          <Image
            style={this.props.getImageStyle()}
            source={{ uri: this.props.imageUri }}
          />
        </View>
        
        <View style={styles.footerContainer}>
          {
            React.cloneElement(
              this.props.footerComponent,
              {
                onDone: this.props.onDone,
                onRotate: this.props.onRotate,
                onCancel: this.props.onCancel
              }
            )
          }
        </View>

        <Animated.View
          ref={this.props.topOuterRef}
          style={[styles.animation, this.props.getTopOuterStyle()]}
          {...this.props.topOuterPanResponder.panHandlers}
        />
        <Animated.View
          ref={this.props.leftOuterRef}
          style={[styles.animation, this.props.getLeftOuterStyle()]}
          {...this.props.leftOuterPanResponder.panHandlers}
        />
        <Animated.View
          ref={this.props.bottomOuterRef}
          style={[styles.animation, this.props.getBottomOuterStyle()]}
          {...this.props.bottomOuterPanResponder.panHandlers}
        />
        <Animated.View
          ref={this.props.rightOuterRef}
          style={[styles.animation, this.props.getRightOuterStyle()]}
          {...this.props.rightOuterPanResponder.panHandlers}
        />

        <Animated.View
          style={[styles.animation, styles.topSideAnimation, this.props.getTopSideStyle()]}
          {...this.props.topPanResponder.panHandlers}
        />
        <Animated.View
          style={[styles.animation, styles.leftSideAnimation, this.props.getLeftSideStyle()]}
          {...this.props.leftPanResponder.panHandlers}
        />
        <Animated.View
          style={[styles.animation, styles.bottomSideAnimation, this.props.getBottomSideStyle()]}
          {...this.props.bottomPanResponder.panHandlers}
        />
        <Animated.View
          style={[styles.animation, styles.rightSideAnimation, this.props.getRightSideStyle()]}
          {...this.props.rightPanResponder.panHandlers}
        />

        <Animated.View
          style={[styles.animation, styles.topLeftAnimation, this.props.getTopLeftStyle()]}
          {...this.props.topLeftPanResponder.panHandlers}
        />
        <Animated.View
          style={[styles.animation, styles.bottomLeftAnimation, this.props.getBottomLeftStyle()]}
          {...this.props.bottomLeftPanResponder.panHandlers}
        />
        <Animated.View
          style={[styles.animation, styles.bottomRightAnimation, this.props.getBottomRightStyle()]}
          {...this.props.bottomRightPanResponder.panHandlers}
        />
        <Animated.View
          style={[styles.animation, styles.topRightAnimation, this.props.getTopRightStyle()]}
          {...this.props.topRightPanResponder.panHandlers}
        />

        <Animated.View
          style={[styles.animation, this.props.getRectangleStyle()]}
          {...this.props.rectanglePanResponder.panHandlers}
        >
          <View style={styles.gridRow} >
            <View style={styles.gridColumn}>
              <View style={[styles.borderDesign, { borderLeftWidth: 3, borderTopWidth: 3 }]} />
            </View>
            <View style={styles.gridColumn}>
              <View style={[styles.borderDesign, { borderTopWidth: 3, alignSelf: 'center' }]} />
            </View>
            <View style={styles.gridColumn}>
              <View style={[styles.borderDesign, { borderTopWidth: 3, borderRightWidth: 3, alignSelf: 'flex-end' }]} />
            </View>
          </View>

          <View style={styles.gridRow} >
            <View style={[styles.gridColumn, { flexDirection: 'row' }]}>
              <View style={[styles.borderDesign, { borderLeftWidth: 3, alignSelf: 'center' }]} />
            </View>
            <View style={styles.gridColumn} />
            <View style={[styles.gridColumn, { justifyContent: 'center' }]}>
              <View style={[styles.borderDesign, { borderRightWidth: 3, alignSelf: 'flex-end' }]} />
            </View>
          </View>

          <View style={styles.gridRow} >
            <View style={[styles.gridColumn, { justifyContent: 'flex-end' }]}>
              <View style={[styles.borderDesign, { borderLeftWidth: 3, borderBottomWidth: 3 }]} />
            </View>
            <View style={[styles.gridColumn, { justifyContent: 'flex-end' }]}>
              <View style={[styles.borderDesign, { borderBottomWidth: 3, alignSelf: 'center' }]} />
            </View>
            <View style={[styles.gridColumn, { justifyContent: 'flex-end' }]}>
              <View style={[styles.borderDesign, { borderRightWidth: 3, borderBottomWidth: 3, alignSelf: 'flex-end' }]} />
            </View>
          </View>
        </Animated.View>
      </View>
    )
    
  }
}
  


Cropper.propTypes = {
  imageUri: PropTypes.string,
  footerComponent: PropTypes.object,
  getTopOuterStyle: PropTypes.func,
  getLeftOuterStyle: PropTypes.func,
  getBottomOuterStyle: PropTypes.func,
  getRightOuterStyle: PropTypes.func,
  getTopLeftStyle: PropTypes.func,
  getBottomLeftStyle: PropTypes.func,
  getBottomRightStyle: PropTypes.func,
  getTopRightStyle: PropTypes.func,
  getTopSideStyle: PropTypes.func,
  getLeftSideStyle: PropTypes.func,
  getBottomSideStyle: PropTypes.func,
  getRightSideStyle: PropTypes.func,
  getRectangleStyle: PropTypes.func,
  getImageStyle: PropTypes.func,
  onDone: PropTypes.func,
  onRotate: PropTypes.func,
  onCancel: PropTypes.func,
  topOuterPanResponder: PropTypes.object,
  leftOuterPanResponder: PropTypes.object,
  bottomOuterPanResponder: PropTypes.object,
  rightOuterPanResponder: PropTypes.object,
  topPanResponder: PropTypes.object,
  leftPanResponder: PropTypes.object,
  bottomPanResponder: PropTypes.object,
  rightPanResponder: PropTypes.object,
  topLeftPanResponder: PropTypes.object,
  bottomLeftPanResponder: PropTypes.object,
  bottomRightPanResponder: PropTypes.object,
  topRightPanResponder: PropTypes.object,
  rectanglePanResponder: PropTypes.object,
  topOuterRef: PropTypes.func,
  leftOuterRef: PropTypes.func,
  bottomOuterRef: PropTypes.func,
  rightOuterRef: PropTypes.func,
};

export default Cropper;
