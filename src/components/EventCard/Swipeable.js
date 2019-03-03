import React, { Component } from "react";
import { StyleSheet, Animated } from "react-native";

import Interactable from "react-native-interactable";
import Haptics from "react-native-haptic-feedback";

import { SCREEN_HEIGHT, SCREEN_WIDTH } from "../../lib/constants";

class Swipeable extends Component {
	deltaX = new Animated.Value(0);

	handleOnSnap = ({ nativeEvent }) => {
		const { index } = nativeEvent;
		const { onSwipeRight, onSwipeLeft } = this.props;

		this.props.swipeAmount.setValue(0);

		if (index === 0) {
			Haptics.trigger("impactLight");
			onSwipeLeft();
		} else if (index === 1) {
		} else if (index === 2) {
			Haptics.trigger("impactLight");
			onSwipeRight();
		}
	};

	render() {
		const left = { x: -450 };
		const centered = { x: 0 };
		const right = { x: 450 };

		const animatedScale = {
			transform: [
				{
					scale: this.props.swipeAmount.interpolate({
						inputRange: [-200, 0, 200],
						outputRange: [1, 0.9, 1],
						extrapolate: "clamp"
					})
				}
			]
		};

		const animatedRotation = {
			transform: [
				{
					rotate: this.props.swipeAmount.interpolate({
						inputRange: [-300, 0, 300],
						outputRange: ["-10deg", "0deg", "10deg"]
					})
				}
			]
		};

		const animated = this.props.firstCard ? animatedRotation : animatedScale;
		return (
			<Interactable.View
				animatedNativeDriver
				style={[animated, styles.container]}
				ref={view => (this.interactable = view)}
				horizontalOnly={true}
				snapPoints={[left, centered, right]}
				onSnapStart={this.handleOnSnap}
				onDrag={this.handleOnDrag}
				initialPosition={centered}
				// animatedValueX={this.deltaX}
				animatedValueX={this.props.swipeAmount}
			>
				{this.props.children}
			</Interactable.View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		position: "absolute",
		justifyContent: "center",
		alignItems: "center"
	}
});

export default Swipeable;
