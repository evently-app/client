import React, { Component } from "react";
import { StyleSheet, Animated } from "react-native";

import Interactable from "react-native-interactable";

import { SCREEN_HEIGHT, SCREEN_WIDTH } from "../../lib/constants";

class Swipeable extends Component {
	deltaX = new Animated.Value(0);

	render() {
		const left = { x: -200 };
		const centered = { x: 0 };
		const right = { x: 200 };

		const animatedRotation = {
			// transform: {
			// 	rotateZ: this.deltaX.interpolate({
			// 		inputRange: [-200, 0, 200],
			// 		outputRange: ["-15deg", "0deg", "15deg"]
			// 	})
			// }
		};

		console.log("hi");

		return (
			<Interactable.View
				animatedNativeDriver
				style={[animatedRotation, styles.container]}
				ref={view => (this.interactable = view)}
				horizontalOnly={true}
				snapPoints={[left, centered, right]}
				onSnap={this.handleOnSnap}
				onDrag={this.handleOnDrag}
				// boundaries={{
				//   top: open.y - 10,
				//   bottom: closed.y + 20,
				//   haptics: true
				// }}
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
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "white",
		borderRadius: 20
	}
});

export default Swipeable;
