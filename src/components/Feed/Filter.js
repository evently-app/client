import React, { PureComponent } from "react";
import { Animated, View, TouchableOpacity, StyleSheet } from "react-native";
import { connect } from "react-redux";
import Interactable from "react-native-interactable";

import {
	BeginDrag,
	EndDrag,
	SnapOpen,
	SnapClosed,
	ScrollTimeSelection,
	ScrollTypeSelection
} from "../../redux/filter";
import { Header, SubHeader, Paragraph } from "../universal/Text";
import { SB_HEIGHT, SCREEN_WIDTH } from "../../lib/constants";

const closed_point = { y: 0 };
const open_point = { y: 150 };
const boundaries = {
	top: -1,
	bottom: 225,
	haptics: true
};

const filterDragRange = [0, 50, 150];

class Filter extends PureComponent {
	timeXOffset = new Animated.Value(0);
	typeXOffset = new Animated.Value(0);

	onTimeScroll = Animated.event([{ nativeEvent: { contentOffset: { x: this.timeXOffset } } }], {
		useNativeDriver: true
	});

	onTypeScroll = Animated.event([{ nativeEvent: { contentOffset: { x: this.typeXOffset } } }], {
		useNativeDriver: true
	});

	handleOnDrag = ({ nativeEvent }) => {
		const { state } = nativeEvent;
		const { BeginDrag, EndDrag } = this.props;

		if (state === "start") BeginDrag();
		else EndDrag();
	};

	handleOnSnap = ({ nativeEvent }) => {
		const { index } = nativeEvent;
		const { SnapOpen, SnapClosed } = this.props;

		if (index == 0) SnapClosed();
		else SnapOpen();
	};

	// update time selection in redux
	handleTimeScrollEnd = ({ nativeEvent }) => {
		const { x } = nativeEvent.contentOffset;
		const { ScrollTimeSelection } = this.props;

		if (x === 0) ScrollTimeSelection(0);
		else if (x === SCREEN_WIDTH / 3) ScrollTimeSelection(1);
		else ScrollTimeSelection(2);
	};

	// update type selection in redux
	handleTypeScrollEnd = ({ nativeEvent }) => {
		const { x } = nativeEvent.contentOffset;
		const { ScrollTypeSelection } = this.props;

		if (x === 0) ScrollTypeSelection(0);
		else if (x === SCREEN_WIDTH / 3) ScrollTypeSelection(1);
		else ScrollTypeSelection(2);
	};

	timeSelectionStyle = index => {
		const { open, dragging, timeSelection, filterDrag } = this.props;

		return {
			transform: [
				{
					scale: this.timeXOffset.interpolate({
						inputRange: [0, SCREEN_WIDTH / 3, (2 * SCREEN_WIDTH) / 3],
						outputRange: [index === 0 ? 1 : 0.7, index === 1 ? 1 : 0.7, index === 2 ? 1 : 0.7]
					})
				}
			],
			opacity:
				!dragging && open
					? this.timeXOffset.interpolate({
							inputRange: [0, SCREEN_WIDTH / 3, (2 * SCREEN_WIDTH) / 3],
							outputRange: [index === 0 ? 1 : 0.5, index === 1 ? 1 : 0.5, index === 2 ? 1 : 0.5],
							extrapolate: "clamp"
					  })
					: filterDrag.interpolate({
							inputRange: filterDragRange,
							outputRange: [
								index === timeSelection ? 1 : 0,
								index === timeSelection ? 1 : 0.25,
								index === timeSelection ? 1 : 0.5
							]
					  })
		};
	};

	render() {
		const { open, filterDrag, onPress, interactableRef } = this.props;

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
			opacity: filterDrag.interpolate({
				inputRange: filterDragRange,
				outputRange: [0, 0.5, 1],
				extrapolate: "clamp"
			}),
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

		return (
			<View style={styles.container}>
				<Interactable.View
					animatedNativeDriver
					verticalOnly
					snapPoints={[closed_point, open_point]}
					ref={interactableRef}
					onDrag={this.handleOnDrag}
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
					<Animated.ScrollView
						horizontal
						pagingEnabled
						scrollEnabled={open}
						showsHorizontalScrollIndicator={false}
						onScroll={this.onTimeScroll}
						onMomentumScrollEnd={this.handleTimeScrollEnd}
						scrollEventThrottle={16}
						style={[animatedTime, { width: SCREEN_WIDTH }]}
						decelerationRate={0}
						snapToInterval={SCREEN_WIDTH / 3}
						snapToAlignment={"center"}
						contentContainerStyle={{
							justifyContent: "space-around",
							alignItems: "center"
						}}
					>
						<View style={styles.bufferView} />
						<SubHeader
							pointerEvents="none"
							animated
							style={{
								...this.timeSelectionStyle(0),
								width: SCREEN_WIDTH / 3,
								textAlign: "center"
							}}
						>
							Upcoming
						</SubHeader>
						<SubHeader
							pointerEvents="none"
							animated
							style={{
								...this.timeSelectionStyle(1),
								width: SCREEN_WIDTH / 3,
								textAlign: "center"
							}}
						>
							Next Week
						</SubHeader>
						<SubHeader
							pointerEvents="none"
							animated
							style={{
								...this.timeSelectionStyle(2),
								width: SCREEN_WIDTH / 3,
								textAlign: "center"
							}}
						>
							This Month
						</SubHeader>
						<View style={styles.bufferView} />
					</Animated.ScrollView>
					<Paragraph animated style={animatedType}>
						Type
					</Paragraph>
					<Animated.ScrollView
						horizontal
						pagingEnabled
						scrollEnabled={open}
						showsHorizontalScrollIndicator={false}
						onScroll={this.onTypeScroll}
						onMomentumScrollEnd={this.handleTypeScrollEnd}
						scrollEventThrottle={16}
						style={[animatedType, { width: SCREEN_WIDTH }]}
						decelerationRate={0}
						snapToInterval={SCREEN_WIDTH / 3}
						snapToAlignment={"center"}
						contentContainerStyle={{ justifyContent: "space-around" }}
					>
						<View style={styles.bufferView} />
						<SubHeader
							pointerEvents="none"
							animated
							style={{
								// ...this.timeOpacity(0),
								width: SCREEN_WIDTH / 3,
								textAlign: "center"
							}}
						>
							Anything
						</SubHeader>
						<SubHeader
							pointerEvents="none"
							animated
							style={{
								// ...this.timeOpacity(0),
								width: SCREEN_WIDTH / 3,
								textAlign: "center"
							}}
						>
							Concerts
						</SubHeader>
						<SubHeader
							pointerEvents="none"
							animated
							style={{
								// ...this.timeOpacity(1),
								width: SCREEN_WIDTH / 3,
								textAlign: "center"
							}}
						>
							Sports
						</SubHeader>
						<SubHeader
							pointerEvents="none"
							animated
							style={{
								// ...this.timeOpacity(2),
								width: SCREEN_WIDTH / 3,
								textAlign: "center"
							}}
						>
							Shows
						</SubHeader>
						<View style={styles.bufferView} />
					</Animated.ScrollView>
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
		top: -175,
		padding: 5,
		paddingTop: 155,
		alignItems: "center",
		justifyContent: "center"
		// justifyContent: "space-around"
	},
	bufferView: {
		width: SCREEN_WIDTH / 3
	}
});

const mapStateToProps = state => {
	const { open, dragging, timeSelection } = state.filter;
	return {
		open,
		dragging,
		timeSelection
	};
};

const mapDispatchToProps = {
	BeginDrag,
	EndDrag,
	SnapOpen,
	SnapClosed,
	ScrollTimeSelection,
	ScrollTypeSelection
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Filter);
