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

		const animatedLocation = {
			transform: [
				{
					translateY: filterDrag.interpolate({
						inputRange: [0, 50],
						outputRange: [0, -35]
					})
				}
			]
		};

		const animatedTime = {
			transform: [
				{
					translateY: filterDrag.interpolate({
						inputRange: [0, 50],
						outputRange: [0, -15]
					})
				}
			]
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
					boundaries={{
						top: 0,
						bottom: 200,
						haptics: true
					}}
					initialPosition={closed_point}
					style={styles.interactable}
					animatedValueY={filterDrag}
				>
					<Animated.Text style={animatedLocation}>Location</Animated.Text>
					<Animated.Text style={animatedTime}>Time</Animated.Text>
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
		height: 60,
		alignItems: "center",
		justifyContent: "center"
	}
});

export default Filter;
