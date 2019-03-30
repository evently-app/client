import React, { Component } from "react";
import { Animated, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { connect } from "react-redux";
import _ from "lodash";

import Spinner from "../universal/Spinner";
import Filter from "./Filter";
import EventCard from "../EventCard";
import Swipeable from "../EventCard/Swipeable";

import { SCREEN_WIDTH, SCREEN_HEIGHT } from "../../lib/constants";
import { LoadQueue } from "../../redux/queue";
import { SwipeRight, SwipeLeft } from "../../redux/timeline";

class Feed extends Component {
	state = {
		loading: true,
		count: 0,
		filterOpen: false,
		dragging: false,
		animatedValues: {},
		userLocation: {}
	};

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

				this.setState({ animatedValues, loading: false });

				// Alert.alert("successfully got queue");
				console.log("MOUNT LOG", this.props);
			})
			.catch(error => {
				console.log(error);
			});
	}

	// swipeAmount = new Animated.Value(0);

	componentDidMount() {}

	// shouldComponentUpdate() {
	// 	return false;
	// }

	fetchCards = () => {
		const { count, queue, animatedValues } = this.state;

		let newCard = this.generateCard();
		this.setState({
			count: count + 1,
			queue: [...queue, newCard].sort((a, b) => b.id - a.id),
			animatedValues: { ...animatedValues, [newCard.id]: new Animated.Value(0) }
		});
	};

	popCard = ({ id }) => {
		const { queue, animatedValues } = this.state;
		// let index = queue.findIndex(c => c.id === id);
		this.setState(
			{
				// queue: [...queue.slice(0, index), ...queue.slice(index + 1)],
				animatedValues: _.omit(animatedValues, id)
			},
			() => {
				console.log("YOYO", this.state);
			}
		);
	};

	onSwipeCardRight = card => {
		this.props.SwipeRight(card);
		this.popCard(card);

		// this.fetchCards();
	};

	onSwipeCardLeft = card => {
		this.props.SwipeLeft(card);
		this.popCard(card);

		// this.fetchCards();
	};

	openFilter = () => {
		this.setState({ filterOpen: true }, () => this.Filter.snapTo({ index: 1 }));
	};

	closeFilter = () => {
		this.setState({ filterOpen: false }, () => this.Filter.snapTo({ index: 0 }));
	};

	onDrag = event => {
		// this.setState({ dragging: !this.state.dragging });
	};

	handleOnSnap = ({ nativeEvent }) => {
		const { index } = nativeEvent;

		if (index == 0) {
			this.setState({ filterOpen: false });
		} else {
			this.setState({ filterOpen: true });
		}
	};

	handleOnStartSwipe = () => {
		// this.fetchCards();
	};

	render() {
		const { animatedValues, filterOpen, loading, userLocation } = this.state;
		const { queue } = this.props;

		const first = queue.length - 1;
		const feed = (
			<View style={styles.container}>
				<Filter
					interactableRef={Filter => (this.Filter = Filter)}
					onDrag={this.onDrag}
					onSnap={this.handleOnSnap}
					onPress={filterOpen ? this.closeFilter : this.openFilter}
					filterDrag={this.filterDrag}
				/>
				{queue.map((card, i) => (
					<Swipeable
						key={card.id}
						id={card.id}
						index={queue.length - i}
						filterDrag={this.filterDrag}
						swipeAmount={animatedValues[card.id]}
						scaleAmount={i !== first ? animatedValues[queue[i + 1].id] : null}
						onStartSwipe={this.handleOnStartSwipe}
						onSwipeRight={() => this.onSwipeCardRight(card)}
						onSwipeLeft={() => this.onSwipeCardLeft(card)}
					>
						<EventCard userLocation={userLocation} {...card} />
					</Swipeable>
				))}
				{filterOpen && (
					<TouchableOpacity
						activeOpacity={1}
						style={styles.closeFilterButton}
						onPressIn={this.closeFilter}
					/>
				)}
			</View>
		);

		const spinner = (
			<View style={styles.container}>
				<Spinner />
			</View>
		);

		return loading ? spinner : feed;
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
	closeFilterButton: {
		position: "absolute",
		top: 200,
		bottom: 0,
		left: 0,
		right: 0
	}
});

const mapStateToProps = state => {
	return {
		queue: state.queue.queue
	};
};

const mapDispatchToProps = {
	LoadQueue,
	SwipeRight,
	SwipeLeft
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Feed);
