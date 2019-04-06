import React from "react";
import { Animated, StyleSheet, View, TouchableOpacity, Linking } from "react-native";
import { connect } from "react-redux";
import { BlurView } from "react-native-blur";
import RNCalendarEvents from "react-native-calendar-events";


import { colors } from "../../lib/styles";
import { Header, SubHeader, Paragraph } from "../universal/Text";
import { AddEventToCalendar } from "../../api"; 


const CalendarButton = ({ eventName, start, end, eventId, userId}) => {
	const inputRange = [0, 50, 110, 150];

	addToCalendar = (title, start, end, userId, eventId) => {
		var details = {
			startDate: start + ".000Z",
			endDate: end + ".000Z"
		}

		console.log("START*******************", start, end)

		RNCalendarEvents.saveEvent(title, {
			  startDate: start + ".000Z",
  				endDate: end + ".000Z"
		}).then(res => {
			AddEventToCalendar(userId, eventId).then(res => {
				console.log("yeah buddy!")
			})
			.catch((err) => {
				console.log(err)
			})
			console.log("sucess!")
		})
	}

	calendarAuth = (eventName, start, end, userId, eventId) => {
		console.log("from calendar", eventId, userId)
		//BUG - didn't work (crashed app), but will need this later on to access calendar
		console.log("Added to calendar")
		RNCalendarEvents.authorizationStatus().then(res => {
			console.log("return val: ", res)
			if(res == "authorized"){
				console.log("RES1: ", res)
				addToCalendar(eventName, start, end); 
			}
			else if(res == "undetermined"){
				console.log("hey")
				RNCalendarEvents.authorizeEventStore().then( res => {
					console.log("RES 2", res)
					addToCalendar(eventName, start, end, userId, eventId); 
				})
				.catch((err) =>{
					console.log(err)
				})
			}
		})
		.catch((err) =>{
			console.log(err)
		})

		addToCalendar(eventName, start, end, userId, eventId); 

	}

	return (
		<TouchableOpacity
			activeOpacity={0.9}
			style={styles.wrapper}
			onPressIn={() => {
				//addToCalendar goes here 
				calendarAuth(eventName, start, end, userId, eventId);
			}}
		>

		<BlurView blurType="xlight" style={styles.button}>
			<SubHeader style={{color: "black"}}>
				Add to Calendar
			</SubHeader>
		</BlurView>

		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	container: {
		right: 10,
		bottom: 10,
		width: 112,
		height: 30,
		position: "absolute"
		// borderRadius: 10
	},
	button: {
		//backgroundColor: "rgba(255,255,255,0.5)",
		right: 10,
		bottom: 10,
		width: 135,
		height: 28,
		position: "absolute",
		borderRadius: 10,
		justifyContent: "center",
	 	alignItems: "center"

	},
	wrapper: {
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
	// text: {
	// 	position: "absolute",
	// 	right: 25,
	// 	bottom: 10,
	// 	height: 30,
	// 	// paddingHorizontal: 10,
	// 	// width: 300,
	// 	justifyContent: "center",
	// 	alignItems: "center"
	// }
});


const mapStateToProps = ({ user }) => {
	return {
		userId: user.uid,
	};
};

export default connect(
	mapStateToProps,
)(CalendarButton);

// export default CalendarButton;