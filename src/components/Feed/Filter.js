import React, { Component } from "react";
import { Animated, View, TouchableOpacity, StyleSheet } from "react-native";

import Interactable from "react-native-interactable";

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

class Filter extends Component {
	state = {
		// open: false,
		dragging: true,
		timeSelection: 0
	};

	timeXOffset = new Animated.Value(0);

	onTimeScroll = Animated.event([{ nativeEvent: { contentOffset: { x: this.timeXOffset } } }], {
		useNativeDriver: true
	});

	handleOnDrag = ({ nativeEvent }) => {
		const { state } = nativeEvent;
		if (state === "start") {
			this.setState({ dragging: true });
		} else {
			this.setState({ dragging: false });
		}
	};

	handleTimeScrollEnd = ({ nativeEvent }) => {
		const { x } = nativeEvent.contentOffset;
		if (x === 0) this.setState({ timeSelection: 0 });
		else if (x === SCREEN_WIDTH / 3) this.setState({ timeSelection: 1 });
		else this.setState({ timeSelection: 2 });
	};

	timeOpacity = index => {
		const { dragging, timeSelection } = this.state;
		const { filterOpen, filterDrag } = this.props;

		return {
			opacity:
				!dragging && filterOpen
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
		const { filterOpen, filterDrag, onPress, onSnap, interactableRef } = this.props;

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
						outputRange: [0, -25, -75]
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
				{/*<TouchableOpacity
			activeOpacity={1}
			
			// onPress={onPress}
			onPress={() => console.log("his")}
		>*/}
				<Interactable.View
					animatedNativeDriver
					verticalOnly
					snapPoints={[closed_point, open_point]}
					ref={interactableRef}
					onDrag={this.handleOnDrag}
					onSnapStart={onSnap}
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
						scrollEnabled={filterOpen}
						showsHorizontalScrollIndicator={false}
						onScroll={this.onTimeScroll}
						onMomentumScrollEnd={this.handleTimeScrollEnd}
						scrollEventThrottle={16}
						style={[animatedTime, { width: SCREEN_WIDTH }]}
						decelerationRate={0}
						snapToInterval={SCREEN_WIDTH / 3}
						snapToAlignment={"center"}
						contentContainerStyle={{ justifyContent: "space-around" }}
					>
						<View style={{ width: SCREEN_WIDTH / 3 }} />
						<SubHeader
							pointerEvents="none"
							animated
							style={{
								...this.timeOpacity(0),
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
								...this.timeOpacity(1),
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
								...this.timeOpacity(2),
								width: SCREEN_WIDTH / 3,
								textAlign: "center"
							}}
						>
							This Month
						</SubHeader>
						<View style={{ width: SCREEN_WIDTH / 3 }} />
					</Animated.ScrollView>

					{/* <Paragraph animated style={{ ...animatedType, ...animatedOpacity }}> */}
					{/* 	Type */}
					{/* </Paragraph> */}
					{/* <SubHeader animated style={{ ...animatedType, ...animatedOpacity2 }}> */}
					{/* 	Anything */}
					{/* </SubHeader> */}
				</Interactable.View>
				{/*</TouchableOpacity>*/}
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
		height: 250,
		top: -150,
		padding: 5,
		paddingTop: 155,
		alignItems: "center",
		justifyContent: "center"
		// backgroundColor: "red"
		// justifyContent: "space-around"
	}
});

export default Filter;
