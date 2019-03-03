import React from "react";
import { Animated, StyleSheet, View } from "react-native";

import { BlurView } from "react-native-blur";

import { SCREEN_WIDTH, SCREEN_HEIGHT } from "../../lib/constants";
import { colors } from "../../lib/styles";

const INITIAL_WIDTH = 100;

const ActionButton = ({ title, url, yOffset }) => {
	const inputRange = [0, 50, 110, 150];

	const animatedStyle = {
		overflow: "hidden",
		borderRadius: yOffset.interpolate({
			inputRange,
			outputRange: [10, 10, 10, 0],
			extrapolate: "clamp"
		}),
		transform: [
			{
				translateX: yOffset.interpolate({
					inputRange,
					outputRange: [0, -25, -55, -110],
					extrapolate: "clamp"
				})
			},
			{
				translateY: yOffset.interpolate({
					inputRange,
					outputRange: [0, -1.25, -2.5, -5],
					extrapolate: "clamp"
				})
			},
			{
				scaleX: yOffset.interpolate({
					inputRange,
					outputRange: [
						1,
						SCREEN_WIDTH / (4 * INITIAL_WIDTH),
						SCREEN_WIDTH / (2 * INITIAL_WIDTH),
						SCREEN_WIDTH / INITIAL_WIDTH
					],
					extrapolate: "clamp"
				})
			},
			{
				scaleY: yOffset.interpolate({
					inputRange,
					outputRange: [1, 1, 1.5, 2],
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
					outputRange: [0, -23.5, -60, -120],
					extrapolate: "clamp"
				})
			},
			{
				translateY: yOffset.interpolate({
					inputRange,
					outputRange: [0, -1.25, -2.5, -5],
					extrapolate: "clamp"
				})
			}
		]
	};

	return (
		<View>
			<Animated.View style={[styles.container, animatedStyle]}>
				<BlurView blurType="xlight" style={styles.fill} />
			</Animated.View>
			<View style={styles.text}>
				<Animated.Text style={[animatedTextStyle]}>Buy Tickets</Animated.Text>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		right: 10,
		bottom: 10,
		width: 100,
		height: 30,
		position: "absolute"
		// borderRadius: 10
	},
	fill: {
		position: "absolute",
		top: 0,
		bottom: 0,
		left: 0,
		right: 0
	},
	text: {
		position: "absolute",
		right: 10,
		bottom: 10,
		height: 30,
		width: 100,
		justifyContent: "center",
		alignItems: "center"
	}
});

export default ActionButton;
