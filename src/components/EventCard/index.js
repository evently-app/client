import React, { Component } from "react";
import { View, Text } from "react-native";

class EventCard extends Component {
	render() {
		return (
			<View style={{ width: 300, height: 300 }}>
				<Text>{this.props.title}</Text>
			</View>
		);
	}
}

export default EventCard;
