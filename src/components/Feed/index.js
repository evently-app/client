import React, { Component } from "react";
import { Animated, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { connect } from "react-redux";
import _ from "lodash";

import Filter from "./Filter";
import EventCard from "../EventCard";
import Swipeable from "../EventCard/Swipeable";

import { SCREEN_WIDTH, SCREEN_HEIGHT } from "../../lib/constants";
import { LoadQueue } from "../../redux/queue";

class Feed extends Component {
	state = {
		loading: true,
		count: 0,
		filterOpen: false,
		dragging: false,
		animatedValues: {
			// event1: new Animated.Value(0),
			// 1: new Animated.Value(0)
		}
	};

	componentWillMount() {
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

	filterDrag = new Animated.Value(0);
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
		this.popCard(card);
		// this.fetchCards();
	};

	onSwipeCardLeft = card => {
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
		// console.log("render");
		const { animatedValues, filterOpen, loading } = this.state;
		const { queue } = this.props;
		// const queue = this.props.queue;
		console.log("RENDER QUEUE:", this.props.queue);
		console.log("Queue: ", queue);

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
						testID="eventCard"
						// firstCard={i == firstCardIndex}
						// secondCard={i == firstCardIndex - 1}
						filterDrag={this.filterDrag}
						// swipeAmount={this.swipeAmount}
						swipeAmount={animatedValues[card.id]}
						scaleAmount={i !== first ? animatedValues[queue[i + 1].id] : null}
						onStartSwipe={this.handleOnStartSwipe}
						onSwipeRight={() => this.onSwipeCardRight(card)}
						onSwipeLeft={() => this.onSwipeCardLeft(card)}
					>
						<EventCard {...card} />
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

		return loading ? <View style={styles.container} /> : feed;
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
	LoadQueue
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Feed);
