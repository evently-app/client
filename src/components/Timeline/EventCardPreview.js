import React, { Component } from "react";
import {
	View,
	Text,
	Image,
	Alert,
	Animated,
	StyleSheet,
	TouchableWithoutFeedback
} from "react-native";
import { Header, SubHeader } from "../universal/Text";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "../../lib/constants";
import LinearGradient from "react-native-linear-gradient";
import { VibrancyView } from "react-native-blur";

const CARD_HEIGHT = 150;

class EventCardPreview extends Component {
	componentWillMount() {
		this.scale = new Animated.Value(1);
		this.actionScale = new Animated.Value(1);
	}

	render() {
		return (
			<TouchableWithoutFeedback
				onPressIn={() => {
					Animated.timing(this.scale, {
						toValue: 1.03,
						duration: 100
					}).start();
				}}
				onPressOut={() => {
					Animated.timing(this.scale, {
						toValue: 1,
						duration: 100
					}).start();
				}}
				onPress={this.props.onPress}
			>
				<Animated.View
					style={[
						styles.wrapper,
						{
							transform: [{ scale: this.scale }]
						}
					]}
				>
					<Image
						source={{ uri: this.props.imageUrl }}
						resizeMode="cover"
						style={styles.image}
					/>
					<LinearGradient
						style={styles.gradient}
						locations={[0, 0.9]}
						colors={["rgba(0,0,0,0.5)", "rgba(0,0,0,0.7)"]}
					/>
					<Header style={styles.header}>{this.props.title}</Header>
					<SubHeader>
						{this.props.startTime}
						{!!this.props.endTime && ` - ${this.props.endTime}`}
					</SubHeader>
					<TouchableWithoutFeedback
						onPressIn={() => {
							Animated.timing(this.actionScale, {
								toValue: 1.1,
								duration: 100
							}).start();
						}}
						onPressOut={() => {
							Animated.timing(this.actionScale, {
								toValue: 1,
								duration: 100
							}).start();
						}}
						onPress={this.props.onAction}
					>
						<Animated.View
							style={[
								styles.actionWrapper,
								{
									transform: [{ scale: this.actionScale }]
								}
							]}
						>
							<VibrancyView style={styles.action} blurType="xlight">
								<Header style={styles.actionText}>{this.props.action}</Header>
							</VibrancyView>
						</Animated.View>
					</TouchableWithoutFeedback>
				</Animated.View>
			</TouchableWithoutFeedback>
		);
	}
}

const styles = StyleSheet.create({
	wrapper: {
		width: SCREEN_WIDTH - 40,
		padding: 10,
		borderRadius: 10,
		height: CARD_HEIGHT,
		backgroundColor: "rgba(255, 255, 255, 0.3)",
		overflow: "hidden",
		marginBottom: 20,
		marginHorizontal: 20
	},
	image: {
		width: SCREEN_WIDTH - 40,
		height: CARD_HEIGHT,
		position: "absolute",
		left: 0,
		right: 0
	},
	gradient: {
		width: SCREEN_WIDTH - 40,
		height: CARD_HEIGHT,
		position: "absolute",
		top: 0,
		left: 0
	},
	header: {
		marginBottom: 5
	},
	actionWrapper: {
		position: "absolute",
		bottom: 10,
		right: 10
	},
	action: {
		paddingHorizontal: 12,
		paddingVertical: 8,
		borderRadius: 10
	},
	actionText: {
		// color: "black"
	}
});

export default EventCardPreview;
