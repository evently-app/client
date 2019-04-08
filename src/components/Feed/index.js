import React, { Component, Fragment } from "react";
import { Animated, Easing, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { connect } from "react-redux";
import _ from "lodash";

import Spinner from "../universal/Spinner";
import Filter from "./Filter";
import EventCard from "../EventCard";
import Swipeable from "../EventCard/Swipeable";

import { SCREEN_WIDTH, SCREEN_HEIGHT, SB_HEIGHT } from "../../lib/constants";
import { LoadQueue, UpdateQueue } from "../../redux/queue";
import { SwipeRight, SwipeLeft } from "../../redux/timeline";

class Feed extends Component {
	state = {
		animatedValues: {}
	};

	animatedEntry = new Animated.Value(1);
	filterDrag = new Animated.Value(0);

	componentDidMount() {
		const { LoadQueue, filterTime, filterType } = this.props;
		LoadQueue({ filterTime, filterType }).then(this.entryAnimation);
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
		const { animatedValues } = state;

		// if there's a mismatch then new events have been loaded
		if (queue.length !== _.size(state.animatedValues)) {
			let newAnimatedValues = {};
			queue.forEach(({ id }) => {
				if (animatedValues[id] == undefined) newAnimatedValues[id] = new Animated.Value(0);
			});

			return { animatedValues: { ...newAnimatedValues, ...animatedValues } };
		}

		// if the filter has changed hide the cards and update the queue
		if (currentTypeFilter !== selectedType || currentTimeFilter != selectedTime) {
			console.log("updating queue");

			this.exitAnimation();
			UpdateQueue({ filterTime: selectedTime, filterType: selectedType }).then(this.entryAnimation);

			return { animatedValues: {} };
		}

		return null;
	}

	entryAnimation = () => {
		Animated.timing(this.animatedEntry, {
			toValue: 0,
			duration: 300,
			easing: Easing.quad,
			useNativeDriver: true
		}).start();
	};

	exitAnimation = () => {
		Animated.timing(this.animatedEntry, {
			toValue: 1,
			duration: 300,
			easing: Easing.quad,
			useNativeDriver: true
		}).start();
	};

	popCard = ({ id }) => {
		const { UpdateQueue, filterTime, filterType } = this.props;
		const { animatedValues } = this.state;

		// if fewer than five events remaining in the queue, reload
		if (_.size(animatedValues) < 5) UpdateQueue({ filterTime, filterType });

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
		selectedTime: filter.selectedTime,
		selectedType: filter.selectedType,
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
