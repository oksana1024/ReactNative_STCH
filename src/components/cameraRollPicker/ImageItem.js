import React, { Component } from 'react';
import {
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  View
} from 'react-native';
import PropTypes from 'prop-types';

const checkIcon = require('../../assets/images/circle-check.png');

const styles = StyleSheet.create({
  marker: {
    backgroundColor: 'transparent',
  },
});

class ImageItem extends Component {
  componentWillMount() {
    let { width } = Dimensions.get('window');
    const { imageMargin, imagesPerRow, containerWidth } = this.props;

    if (typeof containerWidth !== 'undefined') {
      width = containerWidth;
    }
    this.imageSize = (width - (imagesPerRow - 1) * imageMargin) / imagesPerRow;
  }

  handleClick(item) {
    this.props.onClick(item);
  }

  render() {
    const {
      item, selected, selectedMarker, imageMargin,
    } = this.props;

    const marker = selectedMarker || (
    <View style={{width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.2)', justifyContent: 'center', alignItems: 'center'}}>
      <Image
        style={[styles.marker, { width: 20, height: 20 }]}
        source={checkIcon}
      />
    </View>
    
    );

    const { image } = item.node;

    return (
      <TouchableOpacity
        style={{ marginBottom: imageMargin, marginRight: imageMargin }}
        onPress={() => this.handleClick(image)}
      >
        <View style={{height: this.imageSize, width: this.imageSize, justifyContent: 'center', alignItems: 'center' }}>
          <Image
            source={{ uri: image.uri }}
            style={{ height: this.imageSize, width: this.imageSize, position: 'absolute', top: 0, left: 0 }}
          />
          {(selected) ? marker : null}
        </View>
        
        
      </TouchableOpacity>
    );
  }
}

ImageItem.defaultProps = {
  item: {},
  selected: false,
};

ImageItem.propTypes = {
  item: PropTypes.object,
  selected: PropTypes.bool,
  selectedMarker: PropTypes.element,
  imageMargin: PropTypes.number,
  imagesPerRow: PropTypes.number,
  onClick: PropTypes.func,
};

export default ImageItem;
