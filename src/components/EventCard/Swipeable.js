import React, { Component } from "react";
import { StyleSheet, Animated } from "react-native";
import { SCREEN_WIDTH } from "../../lib/constants";

import Interactable from "react-native-interactable";
import Haptics from "react-native-haptic-feedback";

class Swipeable extends Component {
	startSwipe = () => {
		const { onStartSwipe } = this.props;
		// console.log("startSwipe: ", this.props.id);
		onStartSwipe();
		Haptics.trigger("impactLight");
	};

	handleOnDrag = ({ nativeEvent }) => {
		// console.log("handle on drag");
		const { state, x } = nativeEvent;
		const { onStartSwipe } = this.props;

		if (state === "end") {
			if (x < -150) {
				// console.log("drag sending left");
				this.Interactable.snapTo({ index: 0 });
				this.startSwipe();
				// onStartSwipe();
				Haptics.trigger("impactLight");
			} else if (x > 150) {
				this.Interactable.snapTo({ index: 2 });
				this.startSwipe();
				// onStartSwipe();
				Haptics.trigger("impactLight");
			}
		}
	};

	handleOnSnapStart = ({ nativeEvent }) => {
		// console.log("handle on snap start");
		const { onStartSwipe } = this.props;

		const { index } = nativeEvent;
		if (index === 0 || index === 2) {
			// this.startSwipe();
			// console.log("startSwipe: ", this.props.id);
			Haptics.trigger("impactLight");
			onStartSwipe();
			// swipeAmount.setValue(0);
			// onSwipeLeft();
		}

		// else if (index === 1) {
		// } else if (index === 2) {
		// 	Haptics.trigger("impactLight");
		// 	// swipeAmount.setValue(0);
		// 	// onSwipeRight();
		// }
	};

	handleOnSnap = ({ nativeEvent }) => {
		const { index } = nativeEvent;
		const { onSwipeRight, onSwipeLeft } = this.props;

		if (index === 0) onSwipeLeft();
		else if (index === 2) onSwipeRight();
	};

	render() {
		const { index, swipeAmount, scaleAmount, children } = this.props;

		const spring = { damping: 0.5, tension: 700 };

		const left = { x: -1.2 * SCREEN_WIDTH, ...spring };
		const centered = { x: 0, damping: 0.7, tension: 200 };
		const right = { x: SCREEN_WIDTH * 1.2, ...spring };

		const animated = {
			transform: [
				{
					rotate: swipeAmount.interpolate({
						inputRange: [-1.2 * SCREEN_WIDTH, 0, SCREEN_WIDTH * 1.2],
						outputRange: ["-10deg", "0deg", "10deg"]
					})
				},
				scaleAmount
					? {
							scale: scaleAmount.interpolate({
								inputRange: [-150, 0, 150],
								outputRange: [1, 0.95, 1],
								extrapolate: "clamp"
							})
					  }
					: { scale: 1 }

				// firstCard ? animatedRotation : animatedScale
			]
		};

		const swipeable = (
			<Interactable.View
				animatedNativeDriver
				horizontalOnly
				ref={Interactable => (this.Interactable = Interactable)}
				style={[animated, styles.container]}
				snapPoints={[left, centered, right]}
				// onDrag={this.handleOnDrag}
				onSnapStart={this.handleOnSnapStart}
				onSnap={this.handleOnSnap}
				initialPosition={centered}
				animatedValueX={swipeAmount}
			>
				{children}
			</Interactable.View>
		);

		// return firstCard || secondCard ? swipeable : null;
		return index <= 3 ? swipeable : null;
		// console.log(index);
		// return swipeable;
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
