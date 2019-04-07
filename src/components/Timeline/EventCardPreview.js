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
import { IsEventInCalendar } from "../../api"; 
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "../../lib/constants";
import LinearGradient from "react-native-linear-gradient";
import { VibrancyView } from "react-native-blur";


//change user id to uid everywhere 

const AlreadyInCalendar = () => {
	return (
		<TouchableOpacity
			activeOpacity={0.9}
			style={styles.outline}
		>

		<BlurView blurType="regular" style={styles.button}>
			<SubHeader style={{color: "white"}}>
				Going
			</SubHeader>
		</BlurView>

		</TouchableOpacity>
	);
};


const CARD_HEIGHT = 150;

class EventCardPreview extends Component {

	constructor() {
    super();
    this.state = {isEventInCalendar: false};
  }

	componentWillMount() {
		this.scale = new Animated.Value(1);
		this.actionScale = new Animated.Value(1);
		IsEventInCalendar(this.props.uid, this.props.id).then(result => {
				console.log("RETURNED RESULT:::: ", result.data().isAddedToCalendar)
				this.setState({isEventInCalendar: result.data().isAddedToCalendar})
			})
	}



	render() {

		console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$", this.state.isEventInCalendar)
		console.log("CALENDAR", IsEventInCalendar(this.props.uid, this.props.id))
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
					{!!this.props.date && <SubHeader>{this.props.date}</SubHeader>}
				      {this.state.isEventInCalendar != true ? (
				        <CalendarButton 
							eventName={this.props.title} 
							start={this.props.momentStartDate}
							end={this.props.momentEndDate}
							userId={this.props.uid}
							eventId={this.props.id}
						/> 
				      ) : (
				        <AlreadyInCalendar /> 
				      )}
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
							{!!this.props.action && (
								<VibrancyView style={styles.action} blurType="xlight">
									<Header style={styles.actionText}>{this.props.action}</Header>
								</VibrancyView>
							)}
						</Animated.View>
					</TouchableWithoutFeedback>
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
