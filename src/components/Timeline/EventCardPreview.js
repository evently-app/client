import React, { Component } from "react";
import {
	View,
	Text,
	Image,
	Alert,
	Animated,
	StyleSheet,
	TouchableWithoutFeedback,
	TouchableOpacity
} from "react-native";
import { BlurView } from "react-native-blur";
import { Header, SubHeader } from "../universal/Text";
import CalendarButton from "./CalendarButton";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "../../lib/constants";
import LinearGradient from "react-native-linear-gradient";

const GoingButton = () => {
	return (
		<TouchableOpacity activeOpacity={0.9} style={styles.outline}>
			<BlurView blurType="regular" style={styles.button}>
				<SubHeader style={{ color: "white" }}>Going</SubHeader>
			</BlurView>
		</TouchableOpacity>
	);
};

const CARD_HEIGHT = 150;

class EventCardPreview extends Component {
	scale = new Animated.Value(1);
	actionScale = new Animated.Value(1);
	state = {
		isAddedToCalendar: this.props.isAddedToCalendar
	};

	render() {
		const {
			imageUrl,
			startTime,
			endTime,
			date,
			title,
			momentStartDate,
			momentEndDate,
			uid,
			id,
			action,
			onPress,
			onAction
		} = this.props;
		const { isAddedToCalendar } = this.state;

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
				onPress={onPress}
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
						source={{ uri: imageUrl }}
						resizeMode="cover"
						style={styles.image}
					/>
					<LinearGradient
						style={styles.gradient}
						locations={[0, 0.9]}
						colors={["rgba(0,0,0,0.5)", "rgba(0,0,0,0.7)"]}
					/>
					<Header style={styles.header}>{title}</Header>
					<SubHeader>
						{startTime}
						{!!endTime && ` - ${endTime}`}
					</SubHeader>
					{!!date && <SubHeader>{date}</SubHeader>}
					{!isAddedToCalendar && action && (
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
							onPress={onAction}
						>
							<Animated.View
								style={[
									styles.actionWrapper,
									{
										transform: [{ scale: this.actionScale }]
									}
								]}
							>
								<CalendarButton
									eventName={title}
									start={momentStartDate}
									end={momentEndDate}
									uid={uid}
									eventId={id}
									onAdd={() => {
										console.log("isadded");
										this.setState({ isAddedToCalendar: true });
									}}
								/>
							</Animated.View>
						</TouchableWithoutFeedback>
					)}
					{isAddedToCalendar == true && <GoingButton />}
				</Animated.View>
			</TouchableWithoutFeedback>
		);
	}
}

const styles = StyleSheet.create({
	wrapper: {
		width: SCREEN_WIDTH - 50,
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
	button: {
		height: 10,
		bottom: 10,
		width: 135,
		height: 28,
		position: "absolute",
		borderRadius: 10,
		justifyContent: "center",
		alignItems: "center"
	},
	action: {
		paddingHorizontal: 12,
		paddingVertical: 8,
		borderRadius: 10
	},
	actionText: {
		// color: "black"
		fontWeight: "700"
	},
	outline: {
		//backgroundColor: "rgba(255,255,255,0.5)",
		right: 10,
		bottom: 10,
		width: 135,
		height: 28,
		position: "absolute",
		borderRadius: 10,
		justifyContent: "center",
		alignItems: "center"
	}
});

export default EventCardPreview;
