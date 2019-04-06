import React, { Component } from "react";
import {
	View,
	ScrollView,
	StyleSheet,
	SectionList,
	PanResponder,
	Text,
	Animated,
	Linking,
	Alert
} from "react-native";
import { Header, SubHeader } from "../universal/Text";
import EventCardPreview from "./EventCardPreview";
import { BlurView } from "react-native-blur";
import { connect } from "react-redux";

import { SCREEN_WIDTH, SCREEN_HEIGHT, IS_X } from "../../lib/constants";
import { LoadTimeline } from "../../redux/timeline";
import moment from "moment";

const SCROLL_BAR_HEIGHT = SCREEN_HEIGHT - (IS_X ? 180 : 140);
const SCROLL_BAR_WIDTH = 5;
const SCROLL_INDICATOR_HEIGHT = 50;

const CARD_HEIGHT = 170;
const SECTION_HEADER_HEIGHT = 70;

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

function sortFn(a, b) {
	const aTime = new Date(a.startTime);
	const bTime = new Date(b.startTime);
	return aTime < bTime ? -1 : aTime > bTime ? 1 : 0;
}

function compileSections(data) {
	let Past = [];
	let Today = [];
	let Tomorrow = [];
	let Later = [];
	for (let i = 0; i < data.length; i++) {
		const item = data[i];

		console.log("ITEM: ", item)

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

	// sort sections by date
	Past.sort(sortFn);
	Today.sort(sortFn);
	Tomorrow.sort(sortFn);
	Later.sort(sortFn);

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

	let SECTION_LIST_HEIGHT =
		sections.length * SECTION_HEADER_HEIGHT +
		CARD_HEIGHT * data.length -
		(SCREEN_HEIGHT - (IS_X ? 40 : 20));

	if (SECTION_LIST_HEIGHT < 0) SECTION_LIST_HEIGHT = 0;

	return { sections, SECTION_LIST_HEIGHT };
}

class Timeline extends Component {
	yOffset = new Animated.Value(0);

	onScroll = Animated.event(
		[{ nativeEvent: { contentOffset: { y: this.yOffset } } }],
		{
			useNativeDriver: true
		}
	);

	shouldComponentUpdate(nextProps, nextState) {
		if (nextProps.timeline.length > this.props.timeline.length) {
			return true;
		} else {
			return false;
		}
	}

	componentWillMount() {
		this._panResponder = PanResponder.create({
			onMoveShouldSetResponderCapture: () => true,
			onMoveShouldSetPanResponderCapture: () => true,

			onPanResponderGrant: (e, gestureState) => {},

			onPanResponderMove: (e, { y0, dy }) => {
				const scrollTopDifference = IS_X ? 80 : 60;
				const scrollPosition = y0 - scrollTopDifference + dy;
				let scrollPercentage = scrollPosition / SCROLL_BAR_HEIGHT;
				scrollPercentage =
					scrollPercentage > 0
						? scrollPercentage < 1
							? scrollPercentage
							: 1
						: 0;

				const { sections, SECTION_LIST_HEIGHT } = compileSections(
					this.props.timeline
				);
				this.yOffset.setValue(scrollPercentage * SECTION_LIST_HEIGHT);
				// this.Timeline.getNode().scrollTo({
				// 	y: scrollPercentage * SECTION_LIST_HEIGHT,
				// 	animated: false
				// });
			},

			onPanResponderRelease: (e, { vx, vy }) => {}
		});

		this.props
			.LoadTimeline()
			.then(() => {
				console.log("timeline synced");
			})
			.catch(error => {
				console.log(error);
			});
	}

	render() {
		const { sections, SECTION_LIST_HEIGHT } = compileSections(
			this.props.timeline
		);

		const animatedScrollIndicator = {
			transform: [
				{
					translateY: this.yOffset.interpolate({
						inputRange: [0, SECTION_LIST_HEIGHT],
						outputRange: [0, SCROLL_BAR_HEIGHT - SCROLL_INDICATOR_HEIGHT],
						extrapolate: "clamp"
					})
				}
			]
		};

		const AnimatedSectionList = Animated.createAnimatedComponent(SectionList);
		return (
			<View style={styles.wrapper}>
				<AnimatedSectionList
					ref={Timeline => (this.Timeline = Timeline)}
					initialNumToRender={4}
					style={styles.sectionList}
					onScroll={this.onScroll}
					renderItem={({ item, index, section }) => {
						console.log("ITEM IS: ", item.id)
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
								momentStartDate={item.startTime}
								momentEndDate={item.endTime}
								action={section.title != "Past" ? item.action : null}
								onAction={() => {
									// Alert.alert(`action for ${item.id}`);
								}}
								onPress={() => {
									if (item.ticketUrl) {
										Linking.openURL(item.ticketUrl);
									}
								}}
							/>
						);
					}}
					renderSectionHeader={({ section: { title } }) => (
						<View style={styles.sectionHeader}>
							<Header>{title}</Header>
						</View>
					)}
					sections={sections}
					keyExtractor={(item, index) => item + index}
				/>
				{SECTION_LIST_HEIGHT != 0 && (
					<View style={styles.scrollContainer}>
						<Animated.View
							{...this._panResponder.panHandlers}
							style={[styles.scrollIndicator, animatedScrollIndicator]}
						/>
					</View>
				)}
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
	sectionList: {
		overflow: "hidden",
		marginTop: IS_X ? 30 : 10
		// marginBottom: IS_X ? 90 : 70
	},
	sectionHeader: {
		width: SCREEN_WIDTH,
		paddingHorizontal: 20,
		paddingVertical: 20,
		position: "relative",
		marginBottom: 10,
		backgroundColor: "rgba(0,0,0,0.9)"
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

const mapStateToProps = state => {
	return {
		timeline: state.timeline.timeline
	};
};

const mapDispatchToProps = {
	LoadTimeline
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Timeline);
