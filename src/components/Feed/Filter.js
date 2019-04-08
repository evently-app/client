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
import {
	SB_HEIGHT,
	SCREEN_WIDTH,
	SCREEN_HEIGHT,
	IS_X,
	CATEGORIES,
	TIME_TYPES
} from "../../lib/constants";
import { colors } from "../../lib/styles";

const CLOSED_POINT = { y: 0 };
const OPEN_POINT = { y: 150 };
const BOUNDARIES = {
	top: -1,
	bottom: 225,
	haptics: true
};

const FILTER_DRAG_RANGE = [0, 50, 150];
const TYPE_SNAP_POINTS = CATEGORIES.map((category, i) => ({ x: ((9 - 2 * i) * SCREEN_WIDTH) / 8 }));
const TIME_SNAP_POINTS = TIME_TYPES.map((time, i) => ({ x: -1 * (((i - 1) * SCREEN_WIDTH) / 3) }));

class Filter extends PureComponent {
	state = {
		time: 0,
		type: 0
	};

	timeXOffset = new Animated.Value(0);
	typeXOffset = new Animated.Value(0);

	handleOnDrag = ({ nativeEvent }) => {
		const { state } = nativeEvent;
		const { open, onPress, BeginTransition, EndTransition } = this.props;

		if (state === "start") BeginTransition();
		// else EndTransition();
	};

	handleOnSnap = ({ nativeEvent }) => {
		const { index } = nativeEvent;
		const {
			SnapOpen,
			SnapClosed,
			timeSelection,
			typeSelection,
			ScrollTimeSelection,
			ScrollTypeSelection
		} = this.props;

		const { time, type } = this.state;

		Haptics.trigger("impactLight");

		// weird necessary fix
		this.timeXOffset.setValue(-1 * (((timeSelection - 1) * SCREEN_WIDTH) / 3));
		this.typeXOffset.setValue(((9 - typeSelection * 2) * SCREEN_WIDTH) / 8);

		// snap closed, update the selected time and type filters
		if (index == 0) SnapClosed({ time, type });
		else SnapOpen();
	};

	// update time selection in redux
	handleTimeScroll = ({ nativeEvent }) => {
		const { index } = nativeEvent;

		// update local filter state with new selection
		Haptics.trigger("impactLight");
		this.setState({ time: index });
	};

	// update type selection in redux
	handleTypeScroll = ({ nativeEvent }) => {
		const { index } = nativeEvent;

		// update local filter state with new selection
		Haptics.trigger("impactLight");
		this.setState({ type: index });
	};

	timeSelectionStyle = index => {
		const { open, transitioning, filterDrag } = this.props;
		const { time } = this.state;

		return {
			// transform: [
			// 	{
			// 		scale: this.timeXOffset.interpolate({
			// 			inputRange: [0, SCREEN_WIDTH / 3, (2 * SCREEN_WIDTH) / 3],
			// 			outputRange: [index === 0 ? 1 : 0.7, index === 1 ? 1 : 0.7, index === 2 ? 1 : 0.7]
			// 		})
			// 	}
			// ],
			...styles.timeSelection,
			opacity:
				!transitioning && open
					? this.timeXOffset.interpolate({
							inputRange: TIME_SNAP_POINTS.map(({ x }) => x).reverse(),
							outputRange: TIME_SNAP_POINTS.map((point, i) => (index === i ? 1 : 0.5)).reverse(),
							extrapolate: "clamp"
					  })
					: filterDrag.interpolate({
							inputRange: FILTER_DRAG_RANGE,
							outputRange: [
								index === time ? 1 : 0,
								index === time ? 1 : 0.1,
								index === time ? 1 : 0.3
							],
							extrapolate: "clamp"
					  })
		};
	};

	typeSelectionStyle = index => {
		const { open, transitioning, filterDrag } = this.props;
		const { type } = this.state;

		return {
			...styles.typeSelection,
			opacity:
				!transitioning && open
					? this.typeXOffset.interpolate({
							inputRange: TYPE_SNAP_POINTS.map(({ x }) => x).reverse(),
							outputRange: TYPE_SNAP_POINTS.map((point, i) => (index === i ? 1 : 0.5)).reverse(),
							extrapolate: "clamp"
					  })
					: filterDrag.interpolate({
							inputRange: FILTER_DRAG_RANGE,
							outputRange: [
								index === type ? 1 : 0,
								index === type ? 1 : 0.25,
								index === type ? 1 : 0.3
							],
							extrapolate: "clamp"
					  })
		};
	};

	openFilter = () => {
		this.filter.snapTo({ index: 1 });
	};

	closeFilter = () => {
		this.filter.snapTo({ index: 0 });
	};

	render() {
		const { open, filterDrag } = this.props;
		const { type } = this.state;

		const animatedLocation = {
			transform: [
				{
					translateY: filterDrag.interpolate({
						inputRange: FILTER_DRAG_RANGE,
						outputRange: [0, -35, -105]
					})
				}
			]
		};

		const animatedTime = {
			transform: [
				{
					translateY: filterDrag.interpolate({
						inputRange: FILTER_DRAG_RANGE,
						outputRange: [-17, -37, -93]
					})
				}
			]
		};

		const animatedType = {
			transform: [
				{
					translateY: filterDrag.interpolate({
						inputRange: FILTER_DRAG_RANGE,
						outputRange: [-30, -65, -115]
					})
				}
			]
		};

		const animatedOpacity = {
			opacity: filterDrag.interpolate({
				inputRange: FILTER_DRAG_RANGE,
				outputRange: [0, 0.25, 0.5],
				extrapolate: "clamp"
			})
		};

		const animatedOpacity2 = {
			opacity: filterDrag.interpolate({
				inputRange: FILTER_DRAG_RANGE,
				outputRange: [0, 0.5, 1],
				extrapolate: "clamp"
			})
		};

		const indicatorOpacity = {
			opacity: filterDrag.interpolate({
				inputRange: FILTER_DRAG_RANGE,
				outputRange: [1, 0.2, 0],
				extrapolate: "clamp"
			})
		};

		return (
			<>
				<Interactable.View
					verticalOnly
					animatedNativeDriver
					snapPoints={[CLOSED_POINT, OPEN_POINT]}
					ref={Interactable => (this.filter = Interactable)}
					onDrag={this.handleOnDrag}
					onSnapStart={this.handleOnSnap}
					boundaries={BOUNDARIES}
					initialPosition={CLOSED_POINT}
					style={styles.filterContainer}
					animatedValueY={filterDrag}
				>
					<Paragraph animated style={{ ...animatedLocation, ...animatedOpacity }}>
						I want events
					</Paragraph>
					<Header animated style={animatedLocation}>
						Nearby
					</Header>
					<Paragraph animated style={{ ...animatedTime, ...animatedOpacity }}>
						that are
					</Paragraph>
					<Interactable.View
						horizontalOnly
						animatedNativeDriver
						ref={Interactable => (this.timeSelector = Interactable)}
						dragEnabled={open}
						snapPoints={TIME_SNAP_POINTS}
						initialPosition={TIME_SNAP_POINTS[0]}
						onSnapStart={this.handleTimeScroll}
						style={[animatedTime, styles.horizontalSelector]}
						animatedValueX={this.timeXOffset}
					>
						{TIME_TYPES.map(({ title }, i) => (
							<TouchableOpacity key={i} onPress={() => this.timeSelector.snapTo({ index: i })}>
								<SubHeader animated style={this.timeSelectionStyle(i)}>
									{title}
								</SubHeader>
							</TouchableOpacity>
						))}
					</Interactable.View>
					<Paragraph animated style={{ ...animatedType, ...animatedOpacity }}>
						and
					</Paragraph>
					<Interactable.View
						horizontalOnly
						animatedNativeDriver
						ref={Interactable => (this.typeSelector = Interactable)}
						dragEnabled={open}
						snapPoints={TYPE_SNAP_POINTS}
						initialPosition={TYPE_SNAP_POINTS[0]}
						onSnapStart={this.handleTypeScroll}
						style={[
							animatedType,
							animatedOpacity2,
							styles.horizontalSelector,
							{ width: 2.5 * SCREEN_WIDTH }
						]}
						animatedValueX={this.typeXOffset}
					>
						{CATEGORIES.map(({ title }, i) => (
							<TouchableOpacity key={i} onPress={() => this.typeSelector.snapTo({ index: i })}>
								<SubHeader animated style={this.typeSelectionStyle(i)}>
									{title}
								</SubHeader>
							</TouchableOpacity>
						))}
					</Interactable.View>
				</Interactable.View>
				{type !== 0 && (
					<Animated.View style={[styles.typeIndicator, indicatorOpacity]}>
						<Paragraph>{CATEGORIES[typeSelection].title}</Paragraph>
					</Animated.View>
				)}
				{open && (
					<TouchableOpacity
						activeOpacity={1}
						style={styles.closeFilterButton}
						onPressIn={this.closeFilter}
					/>
				)}
				<TouchableOpacity
					style={styles.toggleButton}
					onPress={open ? this.closeFilter : this.openFilter}
				/>
			</>
		);
	}
}

const styles = StyleSheet.create({
	center: {
		alignItems: "center",
		justifyContent: "center"
	},
	filterContainer: {
		position: "absolute",
		top: SB_HEIGHT + (IS_X ? 0 : 10) - 250,
		left: 0,
		right: 0,
		height: 400,
		alignItems: "center",
		justifyContent: "flex-end"
	},
	horizontalSelector: {
		width: SCREEN_WIDTH,
		paddingBottom: 25,
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
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 10,
		backgroundColor: colors.lightpurple,
		top: SB_HEIGHT + 12,
		left: 30
	},
	toggleButton: {
		position: "absolute",
		top: SB_HEIGHT - 10,
		left: 0,
		right: 0,
		height: 80
	},
	closeFilterButton: {
		position: "absolute",
		top: 250,
		bottom: 0,
		left: 0,
		right: 0
	}
});

const mapStateToProps = ({ filter }) => {
	const { open, transitioning, timeSelection, typeSelection } = filter;
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
