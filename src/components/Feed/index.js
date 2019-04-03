import React, { Component, Fragment } from "react";
import { Animated, Easing, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { connect } from "react-redux";
import _ from "lodash";

import Spinner from "../universal/Spinner";
import Filter from "./Filter";
import EventCard from "../EventCard";
import Swipeable from "../EventCard/Swipeable";

import { SCREEN_WIDTH, SCREEN_HEIGHT, SB_HEIGHT } from "../../lib/constants";
import { LoadQueue } from "../../redux/queue";
import { BeginTransition } from "../../redux/filter";
import { SwipeRight, SwipeLeft } from "../../redux/timeline";

class Feed extends Component {
	state = {
		loading: true,
		count: 0,
		animatedValues: {},
		userLocation: {}
	};

	animatedEntry = new Animated.Value(1);
	filterDrag = new Animated.Value(0);

	componentWillMount() {
		navigator.geolocation.getCurrentPosition(
			({ coords }) => {
				this.setState({ userLocation: coords });
			},
			error => Alert.alert(error.message),
			{ enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
		);

		this.props
			.LoadQueue()
			.then(() => {
				const { queue } = this.props;
				let animatedValues = {};
				queue.forEach(({ id }) => {
					animatedValues[id] = new Animated.Value(0);
				});

				this.setState({ animatedValues, loading: false }, this.entryAnimation);
			})
			.catch(error => {
				console.log(error);
			});
	}

	componentDidMount() {}

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

	// shouldComponentUpdate() {
	// 	return false;
	// }

	popCard = ({ id }) => {
		const { queue, animatedValues } = this.state;
		// let index = queue.findIndex(c => c.id === id);
		this.setState({
			// queue: [...queue.slice(0, index), ...queue.slice(index + 1)],
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
		const { animatedValues, loading, userLocation } = this.state;
		const { filter, queue } = this.props;

		const cardContainerStyle = {
			opacity: this.animatedEntry.interpolate({
				inputRange: [0, 1],
				outputRange: [1, 0]
			}),
			transform: [
				// {
				// 	translateY: this.animatedEntry.interpolate({
				// 		inputRange: [0, 1],
				// 		outputRange: [0, SCREEN_HEIGHT]
				// 	})
				// },
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

const mapStateToProps = state => {
	return {
		queue: state.queue.queue,
		filter: state.filter
	};
};

const mapDispatchToProps = {
	LoadQueue,
	SwipeRight,
	SwipeLeft,
	BeginTransition
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Feed);
