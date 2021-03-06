import React, { Component } from "react";
import { Animated, Easing, View, Alert, StyleSheet } from "react-native";
import { connect } from "react-redux";
import _ from "lodash";

import Spinner from "../universal/Spinner";
import Filter from "./Filter";
import EventCard from "../EventCard";
import Swipeable from "../EventCard/Swipeable";
import Permissions from "react-native-permissions";

import { SCREEN_WIDTH, SCREEN_HEIGHT, SB_HEIGHT } from "../../lib/constants";
import { LoadQueue, UpdateQueue } from "../../redux/queue";
import { SwipeRight, SwipeLeft } from "../../redux/timeline";

export class Feed extends Component {
	state = {
		animatedValues: {},
		newFilterSetting: false
	};

	animatedEntry = new Animated.Value(1);
	filterDrag = new Animated.Value(0);

	componentDidMount() {
		const { LoadQueue, selectedTime, selectedType } = this.props;

		Permissions.request("location", { type: "whenInUse" })
			.then(status => {
				if (status == "authorized") {
					LoadQueue({
						filterTime: selectedTime,
						filterType: selectedType
					}).then(this.entryAnimation);
				} else {
					Alert.alert(
						"You must enable location in order to discover nearby events",
						[
							{
								text: "Open Settings",
								onPress: () => {
									Permissions.openSettings();
								}
							}
						],
						{ cancelable: false }
					);
				}
			})
			.catch(error => {
				console.log(error);
			});
	}

	static getDerivedStateFromProps(props, state) {
		const {
			UpdateQueue,
			queue,
			currentTypeFilter,
			currentTimeFilter,
			selectedType,
			selectedTime
		} = props;
		const { animatedValues, newFilterSetting } = state;

		if (currentTypeFilter !== selectedType || currentTimeFilter !== selectedTime) {
			// if the filter has changed, update the local state to reflect the impending update
			return { newFilterSetting: true };
		} else if (queue.length !== _.size(state.animatedValues) && !newFilterSetting) {
			// update the animated values if there are new events in the queue
			let newAnimatedValues = {};
			queue.forEach(({ id }) => {
				if (animatedValues[id] == undefined) newAnimatedValues[id] = new Animated.Value(0);
			});

			return { animatedValues: { ...newAnimatedValues, ...animatedValues } };
		} else if (newFilterSetting) {
			// if there's a new filter setting and we have new props: refresh the animated values
			let newAnimatedValues = {};
			queue.forEach(({ id }) => (newAnimatedValues[id] = new Animated.Value(0)));
			return { animatedValues: newAnimatedValues, newFilterSetting: false };
		} else {
			return null;
		}
	}

	componentDidUpdate(prevProps, prevState) {
		const { UpdateQueue, selectedTime, selectedType } = this.props;
		const { newFilterSetting } = this.state;

		// if the filter state has changed, update the queue
		if (!prevState.newFilterSetting && newFilterSetting) {
			this.exitAnimation(); // add delay so that this animation completes
			UpdateQueue({ filterTime: selectedTime, filterType: selectedType }).then(this.entryAnimation);
		}
	}

	entryAnimation = () => {
		Animated.timing(this.animatedEntry, {
			toValue: 0,
			duration: 500,
			easing: Easing.quad,
			useNativeDriver: true
		}).start();
	};

	exitAnimation = () => {
		Animated.timing(this.animatedEntry, {
			toValue: 1,
			duration: 500,
			easing: Easing.quad,
			useNativeDriver: true
		}).start();
	};

	popCard = ({ id }) => {
		const { UpdateQueue, selectedTime, selectedType } = this.props;
		const { animatedValues } = this.state;

		// if fewer than five events remaining in the queue, reload
		if (_.size(animatedValues) < 10)
			UpdateQueue({ filterTime: selectedTime, filterType: selectedType });

		this.setState({
			animatedValues: _.omit(animatedValues, id)
		});
	};

	onSwipeCardRight = card => {
		this.props.SwipeRight(card);
		this.popCard(card);
	};

	onSwipeCardLeft = card => {
		this.props.SwipeLeft(card);
		this.popCard(card);
	};

	handleOnStartSwipe = () => {
		// this.fetchCards();
	};

	render() {
		const { animatedValues } = this.state;
		const { queue, loading, userLocation } = this.props;

		const cardContainerStyle = {
			opacity: this.animatedEntry.interpolate({
				inputRange: [0, 1],
				outputRange: [1, 0]
			}),
			transform: [
				{
					translateY: this.filterDrag.interpolate({
						inputRange: [0, 100],
						outputRange: [0, 100]
					})
				},
				{
					scale: this.animatedEntry.interpolate({
						inputRange: [0, 1],
						outputRange: [1, 0.9]
					})
				}
			]
		};

		const first = queue.length - 1;
		const cards = (
			<Animated.View style={[styles.center, cardContainerStyle]}>
				{queue.map((card, i) => (
					<Swipeable
						key={card.id}
						id={card.id}
						index={queue.length - i}
						swipeAmount={animatedValues[card.id]}
						scaleAmount={i !== first ? animatedValues[queue[i + 1].id] : null}
						onStartSwipe={this.handleOnStartSwipe}
						onSwipeRight={() => this.onSwipeCardRight(card)}
						onSwipeLeft={() => this.onSwipeCardLeft(card)}
					>
						<EventCard userLocation={userLocation} {...card} />
					</Swipeable>
				))}
			</Animated.View>
		);

		return (
			<View style={styles.container}>
				{loading ? <Spinner /> : cards}
				<Filter filterDrag={this.filterDrag} />
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		width: SCREEN_WIDTH,
		height: SCREEN_HEIGHT,
		overflow: "hidden",
		alignItems: "center",
		justifyContent: "center"
	},
	center: {
		alignItems: "center",
		justifyContent: "center"
	}
});

const mapStateToProps = ({ queue, filter, user }) => {
	return {
		queue: queue.queue,
		currentTypeFilter: queue.currentTypeFilter,
		currentTimeFilter: queue.currentTimeFilter,
		loading: queue.isLoadingQueue,
		selectedTime: filter.timeSelection,
		selectedType: filter.typeSelection,
		userLocation: user.location
	};
};

const mapDispatchToProps = {
	LoadQueue,
	UpdateQueue,
	SwipeRight,
	SwipeLeft
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Feed);
