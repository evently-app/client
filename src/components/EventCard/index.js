import React, { Component } from "react";
import { Animated, View, Image, Text, StyleSheet } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import MapboxGL from "@mapbox/react-native-mapbox-gl";

import ActionButton from "./ActionButton";
import { Header, SubHeader, Paragraph } from "../universal/Text";

import { SCREEN_WIDTH, SB_HEIGHT, SCREEN_HEIGHT } from "../../lib/constants";
import { colors } from "../../lib/styles";

const SCROLL_BAR_HEIGHT = 100;
const SCROLL_BAR_WIDTH = 5;
const SCROLL_INDICATOR_HEIGHT = 20;

// const EventCard = () => {

class EventCard extends Component {
	yOffset = new Animated.Value(0);

	onScroll = Animated.event([{ nativeEvent: { contentOffset: { y: this.yOffset } } }], {
		useNativeDriver: true
	});

	render() {
		const { eventName, tags, startTime, endTime, action, imageUrl, backgroundColor } = this.props;

		const animatedScrollIndicator = {
			transform: [
				{
					translateY: this.yOffset.interpolate({
						inputRange: [0, SCREEN_HEIGHT],
						outputRange: [0, SCROLL_BAR_HEIGHT - SCROLL_INDICATOR_HEIGHT],
						extrapolate: "clamp"
					})
				}
			]
		};

		return (
			<View style={styles.container}>
				<Animated.ScrollView
					showsVerticalScrollIndicator={false}
					scrollEventThrottle={16}
					bounces={false}
					onScroll={this.onScroll}
				>
					<Image
						style={[styles.coloredBackground, { backgroundColor: backgroundColor }]}
						source={{ uri: imageUrl }}
					/>
					<LinearGradient
						style={styles.gradient}
						locations={[0, 0.7]}
						colors={["rgba(0,0,0,0.7)", "rgba(0,0,0,0)"]}
					/>
					<Header style={{ position: "absolute", top: 10, left: 10 }}>{eventName}</Header>
					<SubHeader style={{ position: "absolute", top: 35, left: 10 }}>{startTime}</SubHeader>
					{!!tags && (
						<LinearGradient
							locations={[0, 1]}
							colors={["rgba(255,255,255,0.1)", "rgba(255,255,255,0.14)"]}
							style={styles.tags}
						>
							{tags.map((tag, i) => (
								<Paragraph bold key={tag} style={styles.tag}>
									{tag}
								</Paragraph>
							))}
						</LinearGradient>
					)}
					<MapboxGL.MapView
						logoEnabled={false}
						style={{ height: 200, backgroundColor: "white" }}
						userTrackingMode={MapboxGL.UserTrackingModes.Follow}
						styleURL={MapboxGL.StyleURL.Light}
						showUserLocation={true}
						zoomLevel={12}
					/>
					<View style={{ height: SCREEN_HEIGHT }} />
				</Animated.ScrollView>
				<ActionButton yOffset={this.yOffset} title={action} />
				<View style={styles.scrollContainer}>
					<Animated.View style={[styles.scrollIndicator, animatedScrollIndicator]} />
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		overflow: "hidden",
		width: SCREEN_WIDTH - 20,
		height: SCREEN_HEIGHT - 200,
		backgroundColor: colors.purple,
		borderRadius: 20
	},
	gradient: {
		position: "absolute",
		top: 0,
		bottom: 0,
		left: 0,
		right: 0
	},
	coloredBackground: {
		alignItems: "center",
		justifyContent: "center",
		width: SCREEN_WIDTH - 20,
		height: SCREEN_HEIGHT - 200
	},
	scrollContainer: {
		position: "absolute",
		right: 10,
		top: 10,
		width: SCROLL_BAR_WIDTH,
		height: SCROLL_BAR_HEIGHT,
		backgroundColor: "gray",
		borderRadius: SCROLL_BAR_WIDTH / 2
	},
	scrollIndicator: {
		position: "absolute",
		right: 0,
		top: 0,
		width: SCROLL_BAR_WIDTH,
		height: SCROLL_INDICATOR_HEIGHT,
		backgroundColor: "lightgray",
		borderRadius: SCROLL_BAR_WIDTH / 2
	},
	tags: {
		flexDirection: "row",
		backgroundColor: colors.purple,
		padding: 10
	},
	tag: {
		padding: 7,
		marginRight: 10,
		borderRadius: 10,
		backgroundColor: colors.purple,
		overflow: "hidden",
		fontWeight: "bold"
	}
});

export default EventCard;
