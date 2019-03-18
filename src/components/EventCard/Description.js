import React from "react";
import { Animated, StyleSheet, View, Text} from "react-native";

import { SCREEN_WIDTH, SB_HEIGHT, SCREEN_HEIGHT } from "../../lib/constants";
import { colors, fonts } from "../../lib/styles";

const description = ({ description }) => {
	// Add processing here for if description is too long

	return (
		<View style={styles.container}>
			<Text style={styles.description}>
				{description}
			</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: colors.lightpurple,
		width: SCREEN_WIDTH - 20,
		height: SCREEN_HEIGHT - 200,
		padding: 20,
	},
	description: {
		color: "white",
		textAlign: 'left',
		fontFamily: fonts.descriptions,
	},
});

export default description;
