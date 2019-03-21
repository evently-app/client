import React, { Component } from "react";
import { View, StyleSheet } from "react-native";
import { Header } from "../universal/Text";
import Dial from "./Dial";

import {
	SCREEN_WIDTH,
	SCREEN_HEIGHT,
	IS_X,
	CATEGORIES
} from "../../lib/constants";

class Profile extends Component {
	render() {
		const Dials = [];
		for (let i = 0; i < CATEGORIES.length; i++) {
			const category = CATEGORIES[i];
			Dials.push(<Dial title={category} fill={Math.random()} />);
		}

		return (
			<View style={styles.wrapper}>
				<Header style={styles.header}>Preferences</Header>
				<View style={styles.dials}>{Dials}</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	wrapper: {
		flex: 1,
		width: SCREEN_WIDTH,
		height: SCREEN_HEIGHT,
		flexDirection: "column",
		justifyContent: "flex-start",
		alignItems: "flex-start",
		paddingBottom: 20,
		paddingTop: IS_X ? 60 : 40
	},
	header: {
		marginLeft: 20
	},
	dials: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "space-around",
		paddingTop: 20
	}
});

export default Profile;
