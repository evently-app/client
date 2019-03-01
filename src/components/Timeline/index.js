import React, { Component } from "react";
import { View, Text } from "react-native";

import { SCREEN_WIDTH, SCREEN_HEIGHT } from "../../lib/constants";

class Timeline extends Component {
	render() {
		return (
			<View
				style={{
					flex: 1,
					width: SCREEN_WIDTH,
					height: SCREEN_HEIGHT,
					backgroundColor: "rgba(255, 0, 0, 0.2)",
					justifyContent: "center",
					alignItems: "center"
				}}
			>
				<Text>Timeline</Text>
			</View>
		);
	}
}

export default Timeline;
