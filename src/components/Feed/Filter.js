import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";

import Interactable from "react-native-interactable";

class Filter extends Component {
	state = {};

	render() {
		const { filterDrag } = this.props;

		const closed = { y: 0 };
		const open = { y: 100 };

		return (
			<Interactable.View
				animatedNativeDriver
				snapPoints={[closed, open]}
				// onSnapStart={handleOnSnap}
				initialPosition={closed}
				style={styles.container}
				animatedValueY={filterDrag}
			>
				<Text>Location</Text>
				<Text>Time</Text>
			</Interactable.View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		height: 100
	}
});

export default Filter;
