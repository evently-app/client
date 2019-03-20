import React, { Component } from "react";
import { View, PanResponder, Animated, StyleSheet } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";

class Dial extends Component {
	constructor(props) {
		super(props);
		this.state = {
			fill: props.fill || 0.5
		};
		this.activated = new Animated.Value(1)
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (nextState.fill != this.state.fill) {
			return true;
		} else if (nextState.activated != this.state.activated) {
			return true;
		} else {
			return false;
		}
	}

	componentWillMount() {
		this._panResponder = PanResponder.create({
			onMoveShouldSetResponderCapture: () => true,
			onMoveShouldSetPanResponderCapture: () => true,

			onPanResponderGrant: (e, gestureState) => {},

			onPanResponderMove: (e, { x0, y0, dx, dy }) => {
				// animate dial fill

				const panPoint = { x: x0 + dx, y: y0 + dy };

				const onRightSide = panPoint.x > this.center.x;

				// get lengths of implicit lines for calculation
				const centerTop = this.center.y - this.centerTop.y;
				const centerOut = Math.sqrt(
					Math.pow(this.center.y - panPoint.y, 2) +
						Math.pow(this.center.x - panPoint.x, 2)
				);
				const topOut = Math.sqrt(
					Math.pow(this.centerTop.y - panPoint.y, 2) +
						Math.pow(this.centerTop.x - panPoint.x, 2)
				);
				// console.log(centerTop, centerOut, topOut);
				// use line lengths and law of cosine to calculate implied angle from drag
				const angle = Math.acos(
					(Math.pow(centerTop, 2) +
						Math.pow(centerOut, 2) -
						Math.pow(topOut, 2)) /
						(2 * centerOut * centerTop)
				);

				console.log(angle)

				const fill = onRightSide ? (angle/Math.PI) * 0.7 - 0.15 : 0.5 + (1 - (angle/Math.PI)) * 0.6

				this.setState({ fill });

			},

			onPanResponderRelease: (e, { vx, vy }) => {
				// publish preference selection

				// activation animation
				if (this.state.fill >= 0) {
					Animated.timing(this.activated, {
						toValue: 1,
						duration: 100
					}).start()
				}
				else {
					Animated.timing(this.activated, {
						toValue: 0,
						duration: 100
					}).start()
				}
			}
		});
	}

	render() {
		return (
			<View
				onLayout={event => {
					var { x, y, width, height } = event.nativeEvent.layout;
					this.centerTop = { x: x + width / 2, y: y };
					this.center = { x: x + width / 2, y: y + height / 2 };
					console.log(this.centerTop, this.center)
				}}
				style={styles.circleWrapper}
				{...this._panResponder.panHandlers}
			>
				<AnimatedCircularProgress
					size={120}
					width={10}
					rotation={0}
					fill={this.state.fill * 100}
					tintColor="rgba(110,10,234,0.95)"
					// onAnimationComplete={({finished}) => {}}
					backgroundColor="rgba(110,10,234,0.30)"
				/>
				<View style={styles.innerCircleWrapper}>
					<Animated.View
						style={[
							styles.innerCircle,
							{
								opacity: this.activated.interpolate({
									inputRange: [0, 1],
									outputRange: [0.2, 1]
								})
							}
						]}
					/>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	circleWrapper: {
		flexDirection: "column",
		paddingVertical: 20
	},
	innerCircle: {
		width: 80,
		height: 80,
		borderRadius: 40,
		borderWidth: 15,
		borderColor: "white"
	},
	innerCircleWrapper: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		justifyContent: "center",
		alignItems: "center"
	}
});

export default Dial;
