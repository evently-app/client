import React, { Component } from "react";
import { Animated, View, Text, TouchableOpacity, StyleSheet } from "react-native";

import Interactable from "react-native-interactable";

import { Header, SubHeader, Paragraph } from "../universal/Text";
import { SB_HEIGHT } from "../../lib/constants";

const Filter = ({ filterDrag, onPress, interactableRef }) => {
	const closed_point = { y: 0 };
	const open_point = { y: 150 };
	const boundaries = {
		top: -1,
		bottom: 225,
		haptics: true
	};

	const inputRange = [0, 50, 150];

	const translateX = {
		translateX: filterDrag.interpolate({
			inputRange,
			outputRange: [0, -45, -135]
		})
	};

	const animatedLocation = {
		transform: [
			{
				translateY: filterDrag.interpolate({
					inputRange,
					outputRange: [0, -35, -105]
				})
			}
			// translateX
		]
	};

	const animatedTime = {
		transform: [
			{
				translateY: filterDrag.interpolate({
					inputRange,
					outputRange: [-10, -30, -90]
				})
			}
			// translateX
		]
	};

	const animatedType = {
		transform: [
			{
				translateY: filterDrag.interpolate({
					inputRange,
					outputRange: [0, -25, -75]
				})
			}
			// translateX
		]
	};

	const animatedOpacity = {
		// position: "absolute",
		// top: -10,
		opacity: filterDrag.interpolate({
			inputRange: [0, open_point.y],
			outputRange: [0, 0.5],
			extrapolate: "clamp"
		})
	};

	const animatedOpacity2 = {
		// position: "absolute",
		// top: -10,
		opacity: filterDrag.interpolate({
			inputRange: [0, open_point.y],
			outputRange: [0, 1],
			extrapolate: "clamp"
		})
	};

	return (
		<TouchableOpacity activeOpacity={1} style={styles.container} onPress={onPress}>
			<Interactable.View
				animatedNativeDriver
				verticalOnly={true}
				snapPoints={[closed_point, open_point]}
				ref={interactableRef}
				// onSnapStart={handleOnSnap}
				boundaries={boundaries}
				initialPosition={closed_point}
				style={styles.interactable}
				animatedValueY={filterDrag}
			>
				<Paragraph animated style={{ ...animatedLocation, ...animatedOpacity }}>
					I want events in
				</Paragraph>
				<Header animated style={animatedLocation}>
					New York
				</Header>
				<Paragraph animated style={{ ...animatedTime, ...animatedOpacity }}>
					for
				</Paragraph>
				<SubHeader animated style={animatedTime}>
					tonight
				</SubHeader>
				<Paragraph animated style={{ ...animatedType, ...animatedOpacity }}>
					I'm in the mood for
				</Paragraph>
				<SubHeader animated style={{ ...animatedType, ...animatedOpacity2 }}>
					anything
				</SubHeader>
			</Interactable.View>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	container: {
		position: "absolute",
		top: SB_HEIGHT,
		left: 0,
		right: 0,
		height: 150
	},
	interactable: {
		height: 75,
		// backgroundColor: "red",
		padding: 5,
		alignItems: "center",
		justifyContent: "center"
		// justifyContent: "space-around"
	},
	location: {
		marginTop: 0
	},
	time: {
		marginBottom: 5
	}
});

export default Filter;
