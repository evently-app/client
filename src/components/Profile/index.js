import React, { Component } from "react";
import { View, StyleSheet } from "react-native";
import { Header } from "../universal/Text";
import Dial from "./Dial";

import { SCREEN_WIDTH, SCREEN_HEIGHT, IS_X } from "../../lib/constants";

class Profile extends Component {
	render() {
		return (
			<View style={styles.wrapper}>
				<Header>Preferences</Header>
				<Dial />
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
		padding: 20,
		paddingTop: IS_X ? 60 : 40
	}
});

export default Profile;
