import React, { Component } from "react";
import { Animated, View, Text, StyleSheet } from "react-native";

import ActionButton from "./ActionButton";

import { SCREEN_WIDTH, SB_HEIGHT, SCREEN_HEIGHT } from "../../lib/constants";

const SCROLL_BAR_HEIGHT = 100;
const SCROLL_INDICATOR_HEIGHT = 20;

class EventCard extends Component {
	yOffset = new Animated.Value(0);

	onScroll = Animated.event([{ nativeEvent: { contentOffset: { y: this.yOffset } } }], {
		useNativeDriver: true
	});

	render() {
		const animatedScrollIndicator = {
			transform: [
				{
					translateY: this.yOffset.interpolate({
						inputRange: [0, SCREEN_HEIGHT],
						outputRange: [0, SCROLL_BAR_HEIGHT - SCROLL_INDICATOR_HEIGHT],
						extrapolate: "clamp"
					})
				}
			]
		};

		return (
			<View style={styles.container}>
				<Animated.ScrollView
					showsVerticalScrollIndicator={false}
					scrollEventThrottle={16}
					onScroll={this.onScroll}
				>
					<View style={[styles.coloredBackground, { backgroundColor: this.props.backgroundColor }]}>
						<Text>{this.props.id}</Text>
					</View>
					<Text>{this.props.title}</Text>
					<View style={{ height: SCREEN_HEIGHT }} />
				</Animated.ScrollView>
				<ActionButton yOffset={this.yOffset} />
				<View style={styles.scrollContainer}>
					<Animated.View style={[styles.scrollIndicator, animatedScrollIndicator]} />
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		overflow: "hidden",
		width: SCREEN_WIDTH - 20,
		height: SCREEN_HEIGHT - 200,
		backgroundColor: "white",
		borderRadius: 20
	},
	coloredBackground: {
		alignItems: "center",
		justifyContent: "center",
		width: SCREEN_WIDTH - 20,
		height: SCREEN_HEIGHT - 200
	},
	scrollContainer: {
		position: "absolute",
		right: 10,
		top: 10,
		width: 7,
		height: SCROLL_BAR_HEIGHT,
		backgroundColor: "gray",
		borderRadius: 10
	},
	scrollIndicator: {
		position: "absolute",
		right: 0,
		top: 0,
		width: 7,
		height: SCROLL_INDICATOR_HEIGHT,
		backgroundColor: "lightgray",
		borderRadius: 10
	}
});

export default EventCard;
