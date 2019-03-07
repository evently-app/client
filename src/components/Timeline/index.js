import React, { Component } from "react";
import {
	View,
	ScrollView,
	StyleSheet,
	SectionList,
	Text,
	Animated,
	Alert
} from "react-native";
import { Header, SubHeader } from "../universal/Text";
import EventCardPreview from "./EventCardPreview";
import { BlurView } from "react-native-blur";

import { SCREEN_WIDTH, SCREEN_HEIGHT, IS_X } from "../../lib/constants";
import moment from "moment";

const SCROLL_BAR_HEIGHT = SCREEN_HEIGHT - (IS_X ? 180 : 140);
const SCROLL_BAR_WIDTH = 5;
const SCROLL_INDICATOR_HEIGHT = 50;

// function that takes date object and returns readable time
function formatAMPM(date) {
	let hours = date.getHours();
	let minutes = date.getMinutes();
	const ampm = hours >= 12 ? "pm" : "am";
	hours = hours % 12;
	hours = hours ? hours : 12;
	minutes = !!minutes ? (minutes < 10 ? `0${minutes}` : minutes) : "00";
	return hours + ":" + minutes + " " + ampm;
}

// takes date object returns readable day
function formatDay(date) {
	return moment(date).format("ddd MMMM Do");
}

const DUMMY_DATA = [
	{
		id: "event1",
		eventName: "Khalid Summer Tour",
		startTime: "8:00pm",
		action: "Tickets from $20",
		startTime: "2019-03-03T22:00:00",
		endTime: "2019-03-4T05:00:00",
		imageUrl:
			"https://media.gq.com/photos/5a625821df8e105e64e8df4b/16:9/w_1280%2Cc_limit/Khalid_Shot_01-edit.jpg"
	},
	{
		id: "event2",
		eventName: "Yale Art Exhibit",
		startTime: "2019-03-04T22:00:00",
		endTime: "2019-03-5T05:00:00",
		action: "Add to Calendar",
		imageUrl:
			"http://assets.saatchiart.com/saatchi/882784/art/3164475/2234366-ECTUFHAI-8.jpg"
	},
	{
		id: "event1",
		eventName: "Khalid Summer Tour",
		startTime: "8:00pm",
		action: "Tickets from $20",
		startTime: "2019-03-03T22:00:00",
		endTime: "2019-03-4T05:00:00",
		imageUrl:
			"https://media.gq.com/photos/5a625821df8e105e64e8df4b/16:9/w_1280%2Cc_limit/Khalid_Shot_01-edit.jpg"
	},
	{
		id: "event2",
		eventName: "Yale Art Exhibit",
		startTime: "2019-03-04T22:00:00",
		endTime: "2019-03-5T05:00:00",
		action: "Add to Calendar",
		imageUrl:
			"http://assets.saatchiart.com/saatchi/882784/art/3164475/2234366-ECTUFHAI-8.jpg"
	},
	{
		id: "event1",
		eventName: "Khalid Summer Tour",
		startTime: "8:00pm",
		action: "Tickets from $20",
		startTime: "2019-03-03T22:00:00",
		endTime: "2019-03-4T05:00:00",
		imageUrl:
			"https://media.gq.com/photos/5a625821df8e105e64e8df4b/16:9/w_1280%2Cc_limit/Khalid_Shot_01-edit.jpg"
	},
	{
		id: "event2",
		eventName: "Yale Art Exhibit",
		startTime: "2019-03-04T22:00:00",
		endTime: "2019-03-5T05:00:00",
		action: "Add to Calendar",
		imageUrl:
			"http://assets.saatchiart.com/saatchi/882784/art/3164475/2234366-ECTUFHAI-8.jpg"
	},
	{
		id: "event3",
		eventName: "Branford College Tea",
		startTime: "2019-03-08T22:00:00",
		endTime: "2019-03-9T05:00:00",
		action: "Add to Calendar",
		imageUrl:
			"https://news.yale.edu/sites/default/files/styles/featured_media/public/2010_05_10_19_03_37_central_campus_1.jpg?itok=dFqc-hAD&c=07307e7d6a991172b9f808eb83b18804"
	}
];

class Timeline extends Component {
	yOffset = new Animated.Value(0);

	onScroll = Animated.event(
		[{ nativeEvent: { contentOffset: { y: this.yOffset } } }],
		{
			useNativeDriver: true
		}
	);

	render() {
		const animatedScrollIndicator = {
			transform: [
				{
					translateY: this.yOffset.interpolate({
						inputRange: [0, SCREEN_HEIGHT - 200],
						outputRange: [0, SCROLL_BAR_HEIGHT - SCROLL_INDICATOR_HEIGHT],
						extrapolate: "clamp"
					})
				}
			]
		};

		let Past = [];
		let Today = [];
		let Tomorrow = [];
		let Later = [];
		for (let i = 0; i < DUMMY_DATA.length; i++) {
			const item = DUMMY_DATA[i];

			let now = new Date();
			let tomorrow = new Date();
			tomorrow.setDate(tomorrow.getDate() + 1);
			let startDate = new Date(item.startTime);
			let endDate = new Date(item.endTime);

			if (startDate.setHours(0, 0, 0, 0) < now.setHours(0, 0, 0, 0)) {
				Past.push(item);
			} else if (startDate.setHours(0, 0, 0, 0) == now.setHours(0, 0, 0, 0)) {
				Today.push(item);
			} else if (
				startDate.setHours(0, 0, 0, 0) == tomorrow.setHours(0, 0, 0, 0)
			) {
				Tomorrow.push(item);
			} else {
				Later.push(item);
			}
		}

		let sections = [];
		if (Past.length > 0) {
			sections.push({ title: "Past", data: Past });
		}
		if (Today.length > 0) {
			sections.push({ title: "Today", data: Today });
		}
		if (Tomorrow.length > 0) {
			sections.push({ title: "Tomorrow", data: Tomorrow });
		}
		if (Later.length > 0) {
			sections.push({ title: "Later", data: Later });
		}

		const AnimatedSectionList = Animated.createAnimatedComponent(SectionList);

		return (
			<View style={styles.wrapper}>
				<AnimatedSectionList
					initialNumToRender={4}
					style={styles.sectionList}
					onLayout={event => {
						var { x, y, width, height } = event.nativeEvent.layout;
						this.height = height;
					}}
					onScroll={this.onScroll}
					renderItem={({ item, index, section }) => {
						let startDate = new Date(item.startTime);
						let endDate = new Date(item.endTime);
						return (
							<EventCardPreview
								key={item.id}
								title={item.eventName}
								imageUrl={item.imageUrl}
								startTime={formatAMPM(startDate)}
								endTime={formatAMPM(endDate)}
								date={
									["Past", "Later"].includes(section.title)
										? formatDay(startDate)
										: null
								}
								action={section.title != "Past" ? item.action : null}
								onAction={() => {
									Alert.alert(`action for ${item.id}`);
								}}
								onPress={() => {
									Alert.alert(`view ${item.id}`);
								}}
							/>
						);
					}}
					renderSectionHeader={({ section: { title } }) => (
						<View style={styles.sectionHeader}>
							{/*<BlurView
															style={styles.sectionHeaderBlur}
															blurType={"extraDark"}
														/>*/}
							<Header>{title}</Header>
						</View>
					)}
					sections={sections}
					keyExtractor={(item, index) => item + index}
					ListFooterComponent={<View style={{ height: IS_X ? 90 : 70 }} />}
				/>
				<View style={styles.scrollContainer}>
					<Animated.View
						style={[styles.scrollIndicator, animatedScrollIndicator]}
					/>
				</View>
				<View style={styles.bottomCover} />
			</View>
		);
	}
}

const styles = StyleSheet.create({
	scrollContainer: {
		position: "absolute",
		right: 10,
		top: IS_X ? 80 : 60,
		width: SCROLL_BAR_WIDTH,
		height: SCROLL_BAR_HEIGHT,
		backgroundColor: "rgba(255, 255, 255, 0.12)",
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
	bottomCover: {
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
		height: IS_X ? 90 : 70,
		backgroundColor: "rgba(0,0,0,0.9)"
	},
	sectionList: {
		overflow: "hidden",
		marginTop: IS_X ? 30 : 10
	},
	sectionHeader: {
		width: SCREEN_WIDTH,
		paddingHorizontal: 20,
		paddingVertical: 20,
		position: "relative",
		marginBottom: 10,
		backgroundColor: "rgba(0,0,0,0.9)"
	},
	sectionHeaderBlur: {
		position: "absolute",
		top: 0,
		right: 0,
		left: 0,
		bottom: 0
	},
	wrapper: {
		flex: 1,
		width: SCREEN_WIDTH,
		height: SCREEN_HEIGHT,
		flexDirection: "column",
		justifyContent: "flex-start",
		alignItems: "flex-start"
	}
});

export default Timeline;
