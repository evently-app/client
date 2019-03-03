import React, { Component } from "react";
import { Animated, View, Text } from "react-native";

import ActionButton from "./ActionButton";

import { SCREEN_WIDTH, SB_HEIGHT, SCREEN_HEIGHT } from "../../lib/constants";

class EventCard extends Component {
	yOffset = new Animated.Value(0);

	_onScroll = Animated.event([{ nativeEvent: { contentOffset: { y: this.yOffset } } }], {
		useNativeDriver: true
	});

	render() {
		return (
			<View style={{ overflow: "hidden" }}>
				<Animated.ScrollView
					// onScroll={this._onScroll}
					// scrollEventThrottle={16}
					style={{
						width: SCREEN_WIDTH - 20,
						height: SCREEN_HEIGHT - 200,
						// alignItems: "center",
						// justifyContent: "center",
						// marginBottom: 100,
						backgroundColor: "white",
						borderRadius: 20
					}}
					scrollEventThrottle={16}
					onScroll={this._onScroll}
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
				</Animated.ScrollView>
				<ActionButton yOffset={this.yOffset} />
			</View>
		);
	}
}

export default EventCard;
