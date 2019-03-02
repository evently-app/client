import React, { Component } from "react";
import { ScrollView, View, Text } from "react-native";

import { SCREEN_WIDTH, SB_HEIGHT, SCREEN_HEIGHT } from "../../lib/constants";

class EventCard extends Component {
	render() {
		return (
			<ScrollView
				style={{
					width: SCREEN_WIDTH - 20,
					height: SCREEN_HEIGHT - 200,
					// alignItems: "center",
					// justifyContent: "center",
					// marginBottom: 100,
					backgroundColor: "white",
					borderRadius: 20
				}}
			>
				<View
					style={{
						backgroundColor: this.props.backgroundColor,
						width: SCREEN_WIDTH - 20,
						height: SCREEN_HEIGHT - 200
					}}
				/>
				<Text>{this.props.title}</Text>
				<View style={{ height: SCREEN_HEIGHT }} />
			</ScrollView>
		);
	}
}

export default EventCard;
