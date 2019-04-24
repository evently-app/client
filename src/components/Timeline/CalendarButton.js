import React, { Component } from "react";
import {
	Animated,
	StyleSheet,
	View,
	TouchableOpacity,
	Linking
} from "react-native";
import { connect } from "react-redux";
import { BlurView } from "react-native-blur";
import moment from "moment";
import RNCalendarEvents from "react-native-calendar-events";

import { colors } from "../../lib/styles";
import { Header, SubHeader, Paragraph } from "../universal/Text";
import { AddEventToCalendar } from "../../api";

class CalendarButton extends Component {
	render() {
		const {
			eventName,
			start,
			end,
			eventId,
			uid,
			onAdd = () => {}
		} = this.props;

		const inputRange = [0, 50, 110, 150];

		let formatDay = date => {
			console.log("**********", date);
			var end = moment(date).format("YYYY-MM-DDTHH:mm:ss.000Z");
			var start = moment(date).format("YYYY-MM-DDTHH:mm:ss.000Z");
			return [start, end];
		};

		let addToCalendar = (title, start, end, uid, eventId) => {
			this.setState({});
			RNCalendarEvents.saveEvent(title, {
				startDate: formatDay(start)[0],
				endDate: formatDay(start)[1]
			})
				.then(res => {
					onAdd();
					//add event to Firebase
					AddEventToCalendar(uid, eventId)
						.then(res => {})
						.catch(err => {
							console.log(err);
						});
				})
				.catch(err => {
					console.log(err);
				});
		};

		let calendarAuth = (eventName, start, end, uid, eventId) => {
			RNCalendarEvents.authorizationStatus()
				.then(res => {
					if (res == "authorized") {
						console.log("RES1: ", res);
						addToCalendar(eventName, start, end);
					} else if (res == "undetermined") {
						RNCalendarEvents.authorizeEventStore()
							.then(res => {
								addToCalendar(eventName, start, end, uid, eventId);
							})
							.catch(err => {
								console.log(err);
							});
					}
					//TODO - make alert here if no access is granted
				})
				.catch(err => {
					console.log(err);
				});

			addToCalendar(eventName, start, end, uid, eventId);
		};

		return (
			<TouchableOpacity
				activeOpacity={0.9}
				style={styles.wrapper}
				onPressIn={() => {
					//addToCalendar goes here
					calendarAuth(eventName, start, end, uid, eventId);
				}}
			>
				<BlurView blurType="xlight" style={styles.button}>
					<SubHeader style={{ color: "black" }}>Add to Calendar</SubHeader>
				</BlurView>
			</TouchableOpacity>
		);
	}
}

const styles = StyleSheet.create({
	button: {
		right: 0,
		bottom: 0,
		width: 135,
		height: 28,
		position: "absolute",
		borderRadius: 10,
		justifyContent: "center",
		alignItems: "center"
	},
	wrapper: {
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

const mapStateToProps = ({ user }) => {
	return {
		uid: user.uid
	};
};

export default connect(mapStateToProps)(CalendarButton);
