import React from "react";
import { Animated, StyleSheet, View } from "react-native";

import { SCREEN_WIDTH, SCREEN_HEIGHT } from "../../lib/constants";
import { colors } from "../../lib/styles";

const INITIAL_WIDTH = 100;

const ActionButton = ({ title, url, yOffset }) => {
	const inputRange = [0, 150];

	const animatedStyle = {
		borderRadius: yOffset.interpolate({
			inputRange: [0, 100],
			outputRange: [10, 0],
			extrapolate: "clamp"
		}),
		transform: [
			{
				translateX: yOffset.interpolate({
					inputRange,
					outputRange: [0, -110],
					extrapolate: "clamp"
				})
			},
			{
				translateY: yOffset.interpolate({
					inputRange,
					outputRange: [0, -5],
					extrapolate: "clamp"
				})
			},
			{
				scaleX: yOffset.interpolate({
					inputRange,
					outputRange: [1, SCREEN_WIDTH / INITIAL_WIDTH],
					extrapolate: "clamp"
				})
			},
			{
				scaleY: yOffset.interpolate({
					inputRange,
					outputRange: [1, 2],
					extrapolate: "clamp"
				})
			}
		]
	};

	const animatedTextStyle = {
		transform: [
			{
				translateX: yOffset.interpolate({
					inputRange,
					outputRange: [0, -120],
					extrapolate: "clamp"
				})
			},
			{
				translateY: yOffset.interpolate({
					inputRange,
					outputRange: [0, -5],
					extrapolate: "clamp"
				})
			}
		]
	};

	return (
		<View>
			<Animated.View style={[animatedStyle, styles.container]} />
			<Animated.Text style={[animatedTextStyle, styles.text]}>Buy Tickets</Animated.Text>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: colors.lightgray,
		right: 10,
		bottom: 10,
		width: 100,
		height: 30,
		position: "absolute"
		// borderRadius: 10
	},
	text: {
		position: "absolute",
		right: 22,
		bottom: 15
	}
});

export default ActionButton;
