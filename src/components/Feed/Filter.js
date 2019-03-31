import React, { PureComponent } from "react";
import { Animated, View, TouchableOpacity, StyleSheet } from "react-native";
import { connect } from "react-redux";
import Interactable from "react-native-interactable";
import Haptics from "react-native-haptic-feedback";

import {
	BeginTransition,
	EndTransition,
	SnapOpen,
	SnapClosed,
	ScrollTimeSelection,
	ScrollTypeSelection
} from "../../redux/filter";
import { Header, SubHeader, Paragraph } from "../universal/Text";
import { SB_HEIGHT, SCREEN_WIDTH } from "../../lib/constants";
import { colors } from "../../lib/styles";

const closed_point = { y: 0 };
const open_point = { y: 150 };
const boundaries = {
	top: -1,
	bottom: 225,
	haptics: true
};

const filterDragRange = [0, 50, 150];

const EVENT_TYPES = ["Anything", "Concerts", "Sports", "Shows"];

const TYPE_SNAP_POINTS = [
	{ x: (3 * SCREEN_WIDTH) / 8 },
	{ x: SCREEN_WIDTH / 8 },
	{ x: (-1 * SCREEN_WIDTH) / 8 },
	{ x: (-3 * SCREEN_WIDTH) / 8 }
];

const TIME_TYPES = ["Upcoming", "Next Week", "This Month"];

const TIME_SNAP_POINTS = [{ x: SCREEN_WIDTH / 3 }, { x: 0 }, { x: -SCREEN_WIDTH / 3 }];

class Filter extends PureComponent {
	timeXOffset = new Animated.Value(0);
	typeXOffset = new Animated.Value(0);

	handleOnDrag = ({ nativeEvent }) => {
		const { state } = nativeEvent;
		const { BeginTransition, EndTransition } = this.props;

		if (state === "start") BeginTransition();
		else EndTransition();
	};

	handleOnSnap = ({ nativeEvent }) => {
		const { index } = nativeEvent;
		const { SnapOpen, SnapClosed, timeSelection, typeSelection } = this.props;

		Haptics.trigger("impactLight");

		// weird necessary fix
		this.timeXOffset.setValue(-1 * (((timeSelection - 1) * SCREEN_WIDTH) / 3));
		this.typeXOffset.setValue(((3 - typeSelection * 2) * SCREEN_WIDTH) / 8);

		if (index == 0) SnapClosed();
		else SnapOpen();
	};

	// update time selection in redux
	handleTimeScroll = ({ nativeEvent }) => {
		const { index } = nativeEvent;
		const { ScrollTimeSelection } = this.props;

		Haptics.trigger("impactLight");

		if (index === 0) ScrollTimeSelection(0);
		else if (index === 1) ScrollTimeSelection(1);
		else ScrollTimeSelection(2);
	};

	// update type selection in redux
	handleTypeScroll = ({ nativeEvent }) => {
		const { index } = nativeEvent;
		const { ScrollTypeSelection } = this.props;

		Haptics.trigger("impactLight");

		if (index === 0) ScrollTypeSelection(0);
		else if (index === 1) ScrollTypeSelection(1);
		else if (index === 2) ScrollTypeSelection(2);
		else ScrollTypeSelection(3);
	};

	timeSelectionStyle = index => {
		const { open, transitioning, timeSelection, filterDrag } = this.props;

		return {
			// transform: [
			// 	{
			// 		scale: this.timeXOffset.interpolate({
			// 			inputRange: [0, SCREEN_WIDTH / 3, (2 * SCREEN_WIDTH) / 3],
			// 			outputRange: [index === 0 ? 1 : 0.7, index === 1 ? 1 : 0.7, index === 2 ? 1 : 0.7]
			// 		})
			// 	}
			// ],
			opacity:
				!transitioning && open
					? this.timeXOffset.interpolate({
							inputRange: TIME_SNAP_POINTS.map(({ x }) => x).reverse(),
							outputRange: [index === 2 ? 1 : 0.5, index === 1 ? 1 : 0.5, index === 0 ? 1 : 0.5],
							extrapolate: "clamp"
					  })
					: filterDrag.interpolate({
							inputRange: filterDragRange,
							outputRange: [
								index === timeSelection ? 1 : 0,
								index === timeSelection ? 1 : 0.25,
								index === timeSelection ? 1 : 0.3
							],
							extrapolate: "clamp"
					  })
		};
	};

	typeSelectionStyle = index => {
		const { open, transitioning, typeSelection, filterDrag } = this.props;

		return {
			opacity:
				!transitioning && open
					? this.typeXOffset.interpolate({
							inputRange: TYPE_SNAP_POINTS.map(({ x }) => x).reverse(),
							outputRange: [
								index === 3 ? 1 : 0.5,
								index === 2 ? 1 : 0.5,
								index === 1 ? 1 : 0.5,
								index === 0 ? 1 : 0.5
							],
							extrapolate: "clamp"
					  })
					: filterDrag.interpolate({
							inputRange: filterDragRange,
							outputRange: [
								index === typeSelection ? 1 : 0,
								index === typeSelection ? 1 : 0.25,
								index === typeSelection ? 1 : 0.3
							],
							extrapolate: "clamp"
					  })
		};
	};

	render() {
		const { open, filterDrag, onPress, interactableRef, timeSelection, typeSelection } = this.props;

		const animatedLocation = {
			transform: [
				{
					translateY: filterDrag.interpolate({
						inputRange: filterDragRange,
						outputRange: [0, -35, -105]
					})
				}
			]
		};

		const animatedTime = {
			transform: [
				{
					translateY: filterDrag.interpolate({
						inputRange: filterDragRange,
						outputRange: [-15, -35, -95]
					})
				}
			]
		};

		const animatedType = {
			transform: [
				{
					translateY: filterDrag.interpolate({
						inputRange: filterDragRange,
						outputRange: [0, -35, -85]
					})
				}
			]
		};

		const animatedOpacity = {
			opacity: filterDrag.interpolate({
				inputRange: filterDragRange,
				outputRange: [0, 0.25, 0.5],
				extrapolate: "clamp"
			})
		};

		const animatedOpacity2 = {
			opacity: filterDrag.interpolate({
				inputRange: filterDragRange,
				outputRange: [0, 0.5, 1],
				extrapolate: "clamp"
			})
		};

		const indicatorOpacity = {
			opacity: filterDrag.interpolate({
				inputRange: filterDragRange,
				outputRange: [1, 0.2, 0],
				extrapolate: "clamp"
			})
		};

		return (
			<View style={styles.container}>
				<Animated.View style={[styles.typeIndicator, indicatorOpacity]}>
					<Paragraph>{EVENT_TYPES[typeSelection]}</Paragraph>
				</Animated.View>
				<Interactable.View
					animatedNativeDriver
					verticalOnly
					snapPoints={[closed_point, open_point]}
					ref={interactableRef}
					onDrag={this.handleOnDrag}
					// onSnap={this.props.EndTransition}
					onSnapStart={this.handleOnSnap}
					boundaries={boundaries}
					initialPosition={closed_point}
					style={styles.interactable}
					animatedValueY={filterDrag}
				>
					<Paragraph animated style={{ ...animatedLocation, ...animatedOpacity }}>
						Location
					</Paragraph>
					<Header animated style={animatedLocation}>
						Nearby
					</Header>
					<Paragraph animated style={{ ...animatedTime, ...animatedOpacity }}>
						Time
					</Paragraph>
					<Interactable.View
						horizontalOnly
						dragEnabled={open}
						snapPoints={TIME_SNAP_POINTS}
						initialPosition={TIME_SNAP_POINTS[0]}
						onSnapStart={this.handleTimeScroll}
						style={[animatedTime, styles.horizontalSelector]}
						animatedValueX={this.timeXOffset}
					>
						{TIME_TYPES.map((time, i) => (
							<SubHeader
								animated
								key={i}
								pointerEvents="none"
								style={{ ...this.timeSelectionStyle(i), ...styles.timeSelection }}
							>
								{time}
							</SubHeader>
						))}
					</Interactable.View>
					<Paragraph animated style={{ ...animatedType, ...animatedOpacity }}>
						Type
					</Paragraph>
					<Interactable.View
						horizontalOnly
						dragEnabled={open}
						snapPoints={TYPE_SNAP_POINTS}
						initialPosition={TYPE_SNAP_POINTS[0]}
						onSnapStart={this.handleTypeScroll}
						style={[animatedType, animatedOpacity2, styles.horizontalSelector]}
						animatedValueX={this.typeXOffset}
					>
						{EVENT_TYPES.map((type, i) => (
							<SubHeader
								animated
								key={i}
								pointerEvents="none"
								style={{ ...this.typeSelectionStyle(i), ...styles.typeSelection }}
							>
								{type}
							</SubHeader>
						))}
					</Interactable.View>
				</Interactable.View>
			</View>
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
		height: 300,
		top: -185,
		padding: 5,
		paddingTop: 155,
		alignItems: "center",
		justifyContent: "center"
	},
	horizontalSelector: {
		width: SCREEN_WIDTH,
		flexDirection: "row",
		justifyContent: "space-around",
		alignItems: "center"
	},
	timeSelection: {
		width: SCREEN_WIDTH / 3,
		textAlign: "center"
	},
	typeSelection: {
		width: SCREEN_WIDTH / 4,
		textAlign: "center"
	},
	typeIndicator: {
		position: "absolute",
		padding: 10,
		borderRadius: 10,
		backgroundColor: colors.lightpurple,
		top: 30,
		left: 30
	}
});

const mapStateToProps = state => {
	const { open, transitioning, timeSelection, typeSelection } = state.filter;
	return {
		open,
		transitioning,
		timeSelection,
		typeSelection
	};
};

const mapDispatchToProps = {
	BeginTransition,
	EndTransition,
	SnapOpen,
	SnapClosed,
	ScrollTimeSelection,
	ScrollTypeSelection
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Filter);
