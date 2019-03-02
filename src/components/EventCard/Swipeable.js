import React, { Component } from "react";
import { StyleSheet, Animated } from "react-native";

import Interactable from "react-native-interactable";
import Haptics from "react-native-haptic-feedback";

import { SCREEN_HEIGHT, SCREEN_WIDTH } from "../../lib/constants";

class Swipeable extends Component {
	deltaX = new Animated.Value(0);

	handleOnSnap = ({ nativeEvent }) => {
		Haptics.trigger("impactLight");
		const { index } = nativeEvent;
		const { onSwipeRight, onSwipeLeft } = this.props;

		if (index === 0) {
			onSwipeLeft();
		} else if (index === 1) {
		} else if (index === 2) {
			onSwipeRight();
		}
	};

	render() {
		const left = { x: -400 };
		const centered = { x: 0 };
		const right = { x: 400 };

		const animatedRotation = {
			transform: [
				{
					rotate: this.deltaX.interpolate({
						inputRange: [-300, 0, 300],
						outputRange: ["-10deg", "0deg", "10deg"]
					})
				}
			]
		};

		return (
			<Interactable.View
				animatedNativeDriver
				style={[animatedRotation, styles.container]}
				ref={view => (this.interactable = view)}
				horizontalOnly={true}
				snapPoints={[left, centered, right]}
				onSnap={this.handleOnSnap}
				onDrag={this.handleOnDrag}
				initialPosition={centered}
				animatedValueX={this.deltaX}
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
