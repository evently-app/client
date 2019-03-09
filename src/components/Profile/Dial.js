import React, { Component } from "react";
import { View, PanResponder, Animated, StyleSheet } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";

class Dial extends Component {
	constructor(props) {
		super(props);
		this.state = {
			fill: props.fill || 0
		};
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (nextState.fill != this.state.fill) {
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
					(Math.pow(centerOut, 2) +
						Math.pow(topOut, 2) -
						Math.pow(centerTop, 2)) /
						(2 * centerOut * topOut)
				);
				this.setState({ fill: angle });
			},

			onPanResponderRelease: (e, { vx, vy }) => {
				// publish preference selection
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
					onAnimationComplete={() => console.log("onAnimationComplete")}
					backgroundColor="rgba(110,10,234,0.30)"
				/>
				<View style={styles.innerCircleWrapper}>
					<View style={styles.innerCircle} />
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
		borderColor: "white",
		borderWidth: 15
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
