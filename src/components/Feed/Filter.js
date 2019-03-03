import React, { Component } from "react";
import { View, Text } from "react-native";

import Interactable from "react-native-interactable";

class Filter extends Component {
	state = {};

	render() {
		return (
			<Interactable.View>
				<Text>Location</Text>
			</Interactable.View>
		);
	}
}

export default Filter;
