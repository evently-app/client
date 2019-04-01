import React, { Component } from "react";
import { View, PanResponder, Animated, StyleSheet } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import Haptics from "react-native-haptic-feedback";

// determines how often the Dial ticks for haptics
const genTick = fill => {
	return Math.round(fill * 7);
};

const PADDING_HORIZONTAL = 20;
const PADDING_VERTICAL = 20;

const SIZE = 116;

class Dial extends Component {
	constructor(props) {
		super(props);
		this.state = {
			fill: props.fill
		};
		this.activated = new Animated.Value(1);
		this.tick = genTick(this.state.fill);
		this.handleLayout = this.handleLayout.bind(this);
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

	refView = ref => (this.view = ref);

	componentWillMount() {
		this._panResponder = PanResponder.create({
			onMoveShouldSetResponderCapture: () => true,
			onMoveShouldSetPanResponderCapture: () => true,

			onPanResponderGrant: (e, gestureState) => {},

			onPanResponderMove: (e, { x0, y0, dx, dy }) => {
				// animate dial fill

				const panPoint = { x: x0 + dx, y: y0 + dy };

				// pattern 1

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

				// use line lengths and law of cosine to calculate implied angle from drag
				const angle = Math.acos(
					(Math.pow(centerTop, 2) +
						Math.pow(centerOut, 2) -
						Math.pow(topOut, 2)) /
						(2 * centerOut * centerTop)
				);

				// interpret angle as fill amount
				let fill = onRightSide
					? (angle / Math.PI) * 0.7 - 0.15
					: 0.5 + (1 - angle / Math.PI) * 0.6;
				if (fill < 0) fill = 0;
				if (fill > 1) fill = 1;
				this.setState({ fill });

				// pattern 2

				// measure distance from center
				// const distance = Math.sqrt(
				// 	Math.pow(this.center.y - panPoint.y, 2) +
				// 		Math.pow(this.center.x - panPoint.x, 2)
				// );
				// let fill = (distance - 40) / 300;
				// if (fill < 0) fill = 0;
				// if (fill > 1) fill = 1;
				// this.setState({ fill });

				// haptic if past next tick
				if (this.tick != genTick(fill)) {
					Haptics.trigger("impactLight");
					this.tick = genTick(fill);
				}
			},

			onPanResponderRelease: (e, { vx, vy }) => {
				// activation animation
				if (this.state.fill > 0) {
					Animated.timing(this.activated, {
						toValue: 1,
						duration: 100
					}).start();
				} else {
					Animated.timing(this.activated, {
						toValue: 0,
						duration: 100
					}).start();
				}

				// publish change
				if (this.props.onChange) {
					this.props.onChange(this.state.fill);
				}
			}
		});
	}

	handleLayout() {
		this.view.measure((fx, fy, width, height, px, py) => {
			this.center = {
				x: fx + PADDING_HORIZONTAL + SIZE / 2,
				y: py + PADDING_VERTICAL + SIZE / 2
			};
			this.centerTop = {
				x: fx + PADDING_HORIZONTAL + SIZE / 2,
				y: py + PADDING_VERTICAL
			};
		});
	}

	render() {
		return (
			<View
				ref={this.refView}
				style={styles.wrapper}
				onLayout={this.handleLayout}
				{...this._panResponder.panHandlers}
			>
				<AnimatedCircularProgress
					size={SIZE}
					width={10}
					rotation={0}
					fill={this.state.fill * 100}
					tintColor="rgba(110,10,234,0.95)"
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
				{!!this.props.title && (
					<Animated.Text
						style={[
							styles.title,
							{
								opacity: this.activated.interpolate({
									inputRange: [0, 1],
									outputRange: [0.6, 1]
								})
							}
						]}
					>
						{this.props.title}
					</Animated.Text>
				)}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	wrapper: {
		flexDirection: "column",
		padding: 20
	},
	title: {
		fontSize: 16,
		fontWeight: "700",
		color: "white",
		fontFamily: "Avenir Next",
		paddingTop: 14,
		textAlign: "center"
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
		bottom: 35,
		justifyContent: "center",
		alignItems: "center"
	}
});

export default Dial;
