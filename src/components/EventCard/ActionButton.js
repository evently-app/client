import React from "react";
import { Animated, StyleSheet, View } from "react-native";

import { SCREEN_WIDTH, SCREEN_HEIGHT } from "../../lib/constants";

const INITIAL_WIDTH = 100;

const ActionButton = ({ title, url, yOffset }) => {
	// const animatedStyle = {
	// 	right: yOffset.interpolate({
	// 		inputRange: [0, 100],
	// 		outputRange: [10, 0],
	// 		extrapolate: "clamp"
	// 	}),
	// 	bottom: yOffset.interpolate({
	// 		inputRange: [0, 100],
	// 		outputRange: [10, 0],
	// 		extrapolate: "clamp"
	// 	}),
	// 	left: yOffset.interpolate({
	// 		inputRange: [0, 100],
	// 		outputRange: [250, 0],
	// 		extrapolate: "clamp"
	// 	}),
	// 	borderRadius: yOffset.interpolate({
	// 		inputRange: [0, 100],
	// 		outputRange: [10, 0]
	// 	})
	// 	// transform: [
	// 	// 	{
	// 	// 		translateX: yOffset.interpolate({
	// 	// 			inputRange: [0, 100],
	// 	// 			outputRange: [0, -100]
	// 	// 		})
	// 	// 	}
	// 	// ]
	// };
	const inputRange = [0, 100];
	const animatedStyle = {
		transform: [
			{
				translateX: yOffset.interpolate({
					inputRange,
					outputRange: [0, -100],
					extrapolate: "clamp"
				})
			},
			{
				scaleX: yOffset.interpolate({
					inputRange,
					outputRange: [1, SCREEN_WIDTH / INITIAL_WIDTH],
					extrapolate: "clamp"
				})
			}
		]
	};

	return (
		<View>
			<Animated.View style={[animatedStyle, styles.container]} />
			{/*<Animated.Text>Buy Tickets</Animated.Text>*/}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: "gray",
		right: 10,
		bottom: 10,
		width: 100,
		height: 50,
		position: "absolute"
		// borderRadius: 10
	}
});

export default ActionButton;
