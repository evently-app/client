import React, { Component } from "react";
import { View, Text } from "react-native";

import { SCREEN_WIDTH, SB_HEIGHT, SCREEN_HEIGHT } from "../../lib/constants";

class EventCard extends Component {
	render() {
		return (
			<View
				style={{
					width: SCREEN_WIDTH - 20,
					height: SCREEN_HEIGHT - 200,
					// marginBottom: 100,
					backgroundColor: this.props.backgroundColor,
					borderRadius: 20
				}}
			>
				<Text>{this.props.title}</Text>
			</View>
		);
	}
}

export default EventCard;
