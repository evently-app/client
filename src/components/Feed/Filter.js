import React, { Component } from "react";
import { Animated, View, Text, TouchableOpacity, StyleSheet } from "react-native";

import Interactable from "react-native-interactable";

import { SB_HEIGHT } from "../../lib/constants";

class Filter extends Component {
	state = {
		open: false
	};

	snapOpen = () => {
		this.setState({ open: true }, () => this.Interactable.snapTo({ index: 1 }));
	};

	snapClosed = () => {
		this.setState({ open: false }, () => this.Interactable.snapTo({ index: 0 }));
	};

	render() {
		const { filterDrag } = this.props;
		const { open } = this.state;

		const closed_point = { y: 0 };
		const open_point = { y: 150 };
		const boundaries = {
			top: -1,
			bottom: 200,
			haptics: true
		};

		const inputRange = [0, 50];

		const translateX = {
			translateX: filterDrag.interpolate({
				inputRange,
				outputRange: [0, -45]
			})
		};

		const animatedLocation = {
			transform: [
				{
					translateY: filterDrag.interpolate({
						inputRange,
						outputRange: [0, -35]
					})
				}
				// translateX
			]
		};

		const animatedTime = {
			transform: [
				{
					translateY: filterDrag.interpolate({
						inputRange,
						outputRange: [0, -30]
					})
				}
				// translateX
			]
		};

		const animatedType = {
			transform: [
				{
					translateY: filterDrag.interpolate({
						inputRange,
						outputRange: [0, -25]
					})
				}
				// translateX
			]
		};

		const animatedOpacity = {
			// position: "absolute",
			// top: -10,
			opacity: filterDrag.interpolate({
				inputRange: [0, open_point.y],
				outputRange: [0, 0.5],
				extrapolate: "clamp"
			})
		};

		const animatedOpacity2 = {
			// position: "absolute",
			// top: -10,
			opacity: filterDrag.interpolate({
				inputRange: [0, open_point.y],
				outputRange: [0, 1],
				extrapolate: "clamp"
			})
		};

		return (
			<TouchableOpacity
				activeOpacity={1}
				style={styles.container}
				onPress={open ? this.snapClosed : this.snapOpen}
			>
				<Interactable.View
					animatedNativeDriver
					verticalOnly={true}
					snapPoints={[closed_point, open_point]}
					ref={Interactable => (this.Interactable = Interactable)}
					// onSnapStart={handleOnSnap}
					boundaries={boundaries}
					initialPosition={closed_point}
					style={styles.interactable}
					animatedValueY={filterDrag}
				>
					<Animated.Text style={[animatedOpacity, animatedLocation]}>
						I want events in
					</Animated.Text>
					<Animated.Text style={[styles.location, animatedLocation]}>Location</Animated.Text>
					<Animated.Text style={[animatedOpacity, animatedTime]}>for</Animated.Text>
					<Animated.Text style={[styles.time, animatedTime]}>Time</Animated.Text>
					<Animated.Text style={[animatedOpacity, animatedType]}>I'm in the mood for</Animated.Text>
					<Animated.Text style={[animatedOpacity2, animatedType]}>anything</Animated.Text>
				</Interactable.View>
			</TouchableOpacity>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		position: "absolute",
		top: SB_HEIGHT,
		left: 0,
		right: 0,
		height: 150
	},
	interactable: {
		height: 75,
		// backgroundColor: "red",
		padding: 5,
		alignItems: "center",
		justifyContent: "center"
		// justifyContent: "space-around"
	},
	location: {
		marginTop: 0
	},
	time: {
		marginBottom: 5
	}
});

export default Filter;
