import React from "react";
import {
	Easing,
	Animated,
	TouchableOpacity,
	Dimensions,
	View,
	Image
} from "react-native";
import PropTypes from "prop-types";

const checkIcon = require('../../../assets/images/circle-check.png');

export default class ImageCell extends React.PureComponent {
	_imageRef;
	_readyToMeasure;

	static propTypes = {
		data: PropTypes.object.isRequired,
		index: PropTypes.number.isRequired,
		imageId: PropTypes.string.isRequired,
		source: PropTypes.any.isRequired,
		shouldHideDisplayedImage: PropTypes.bool.isRequired,

		imageMargin: PropTypes.number.isRequired,
		imagesPerRow: PropTypes.number.isRequired,
		containerWidth: PropTypes.number,

		imageContainerStyle: PropTypes.object,
		renderIndividualHeader: PropTypes.func,
		renderIndividualFooter: PropTypes.func,

		onPressImage: PropTypes.func.isRequired,
		selected: PropTypes.bool
	}

	static contextTypes = {
		onSourceContext: PropTypes.func.isRequired
	}

	constructor(props) {
		super(props);
		this.state = {
			opacity: new Animated.Value(1),
			imageLoaded: false,
			checked: false
		};
		this._readyToMeasure = false;
		var { width } = Dimensions.get("window");
		var { imageMargin, imagesPerRow, containerWidth } = this.props;

		if (typeof containerWidth !== "undefined") {
			width = containerWidth;
		}
		this._imageSize = (width - (imagesPerRow + 1) * imageMargin) / imagesPerRow;
	}

	componentDidMount() {
		this.context.onSourceContext(
			this.props.imageId,
			this.measurePhoto,
			this.measureImageSize
		);
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevState.imageLoaded === false && this.state.imageLoaded) {
			Animated.timing(this.state.opacity, {
				toValue: 1,
				duration: 300,
				easing: Easing.inOut(Easing.ease)
			}).start();
		} else {
			if (this.props.shouldHideDisplayedImage) {
				this.state.opacity.setValue(0);
			} else {
				this.state.opacity.setValue(1);
			}
		}
	}

	measurePhoto = async () => {
		if (!this._imageRef || !this._readyToMeasure) {
			/* eslint-disable no-console */
			console.warn("measurePhoto: Trying to measure image without ref or layout");
		}
		return new Promise((resolve, reject) => {
			this._imageRef
				.getNode()
				.measure(
					(
						imgX,
						imgY,
						imgWidth,
						imgHeight,
						imgPageX,
						imgPageY
					) => {
						resolve({
							width: imgWidth,
							height: imgHeight,
							x: imgPageX,
							y: imgPageY + this.props.imageMargin
						});
					},
					reject
				);
		});
	}

	measureImageSize = () => {
		return { width: this.props.data.width, height: this.props.data.height };
	}

	_onPressImage = (uri, assetURL) => {
		// Wait for the image to load before reacting to press events
		this.setState({checked: !this.state.checked});
		// if (this.state.imageLoaded) {
			this.props.onPressImage(this.props.imageId, this.props.index, uri, assetURL);
		// }
	}

	render() {
		const {
			data, index, imageId, source, imageMargin, imagesPerRow,
			imageContainerStyle, renderIndividualHeader,
			renderIndividualFooter, selected
		} = this.props;
		const header = (renderIndividualHeader) &&
			renderIndividualHeader(data, index);
		const footer = (renderIndividualFooter) &&
			renderIndividualFooter(data, index);

		return (
			<TouchableOpacity
				key={imageId}
				style={{
					marginTop: imageMargin,
					marginLeft: index === 0 || index % imagesPerRow === 0
						? imageMargin : imageMargin / 2,
					marginRight: (index + 1) % imagesPerRow === 0
						? imageMargin : imageMargin / 2
				}}
				onPress={() => this._onPressImage(source.uri, source.assetURL)}
			>
				<View style={{width: this._imageSize, height: this._imageSize, justifyContent: 'center', alignItems: 'center'}}>
					{/* {header}
					<Animated.Image
						ref={(ref) => {
							this._imageRef = ref;
						}}
						onLayout={() => {
							this._readyToMeasure = true;
						}}
						onLoad={() => {
							this.setState({ imageLoaded: true });
						}}
						source={source}
						resizeMode="cover"
						style={[
							{
								height: this._imageSize,
								width: this._imageSize,
								backgroundColor: "lightgrey",
								...imageContainerStyle
							},
							{ opacity: this.state.opacity }
						]}
					/>
					{footer} */}
					<Image
            source={{ uri: source.uri }}
            style={{ height: this._imageSize, width: this._imageSize, position: 'absolute', top: 0, left: 0 }}
          />
					{(selected) ? 
						<View style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.2)', justifyContent: 'center', alignItems: 'center'}}>
							<Image
								style={{ width: 20, height: 20 }}
								source={checkIcon}
							/>
						</View>
					 : null}
				</View>
				
			</TouchableOpacity>
		);
	}
}
