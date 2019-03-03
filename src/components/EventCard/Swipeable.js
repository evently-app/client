import React from "react";
import { StyleSheet, Animated } from "react-native";

import Interactable from "react-native-interactable";
import Haptics from "react-native-haptic-feedback";

import { SCREEN_HEIGHT, SCREEN_WIDTH } from "../../lib/constants";

const Swipeable = ({
	onSwipeRight,
	onSwipeLeft,
	swipeAmount,
	filterDrag,
	firstCard,
	secondCard,
	children
}) => {
	// deltaX = new Animated.Value(0);

	handleOnSnap = ({ nativeEvent }) => {
		const { index } = nativeEvent;

		if (index === 0) {
			Haptics.trigger("impactLight");
			swipeAmount.setValue(0);
			onSwipeLeft();
		} else if (index === 1) {
		} else if (index === 2) {
			Haptics.trigger("impactLight");
			swipeAmount.setValue(0);
			onSwipeRight();
		}
	};

	const left = { x: -450 };
	const centered = { x: 0 };
	const right = { x: 450 };

	const animatedScale = {
		scale: swipeAmount.interpolate({
			inputRange: [-200, 0, 200],
			outputRange: [1, 0.95, 1],
			extrapolate: "clamp"
		})
	};

	const animatedRotation = {
		rotate: swipeAmount.interpolate({
			inputRange: [-300, 0, 300],
			outputRange: ["-10deg", "0deg", "10deg"]
		})
	};

	const animated = {
		transform: [
			{
				translateY: filterDrag.interpolate({
					inputRange: [0, 100],
					outputRange: [0, 100]
				})
			},

			firstCard ? animatedRotation : animatedScale
		]
	};

	const swipeable = (
		<Interactable.View
			animatedNativeDriver
			style={[animated, styles.container]}
			horizontalOnly={true}
			snapPoints={[left, centered, right]}
			onSnapStart={handleOnSnap}
			initialPosition={centered}
			// animatedValueX={deltaX}
			animatedValueX={swipeAmount}
		>
			{children}
		</Interactable.View>
	);

	return firstCard || secondCard ? swipeable : null;
};

const styles = StyleSheet.create({
	container: {
		position: "absolute",
		justifyContent: "center",
		alignItems: "center"
	}
});

export default Swipeable;
