import React, { Component } from "react";
import { Animated, View, Text, StyleSheet } from "react-native";

import Filter from "./Filter";
import EventCard from "../EventCard";
import Swipeable from "../EventCard/Swipeable";

import { SCREEN_WIDTH, SCREEN_HEIGHT } from "../../lib/constants";

const randomColor = () => {
	let r = Math.round(255 * Math.random());
	let g = Math.round(255 * Math.random());
	let b = Math.round(255 * Math.random());
	return `rgba(${r}, ${g}, ${b}, 0.9)`;
};

class Feed extends Component {
	state = {
		count: 1,
		queue: [
			{
				id: 1,
				backgroundColor: randomColor()
			},
			{
				id: 0,
				backgroundColor: randomColor()
			}
		]
	};

	filterDrag = new Animated.Value(0);
	swipeAmount = new Animated.Value(0);

	componentDidMount() {}

	generateCard = () => {
		return {
			id: this.state.count + 1,
			backgroundColor: randomColor()
		};
	};

	fetchCards = () => {
		let newCard = this.generateCard();

		let queue = [...this.state.queue.slice(0, 1), newCard].sort((a, b) => b.id - a.id);
		// console.log("queue:", queue);
		this.setState({
			count: this.state.count + 1,
			queue
		});
	};

	onSwipeCardRight = card => {
		// this.popCard(card);
		this.fetchCards();
	};

	onSwipeCardLeft = card => {
		// this.popCard(card);
		this.fetchCards();
	};

	render() {
		const { queue } = this.state;

		const firstCardIndex = queue.length - 1;
		return (
			<View style={styles.container}>
				<Filter filterDrag={this.filterDrag} />
				{queue.map((card, i) => (
					<Swipeable
						key={card.id}
						firstCard={i == firstCardIndex}
						secondCard={i == firstCardIndex - 1}
						filterDrag={this.filterDrag}
						swipeAmount={this.swipeAmount}
						onSwipeRight={() => this.onSwipeCardRight(card)}
						onSwipeLeft={() => this.onSwipeCardLeft(card)}
					>
						<EventCard {...card} />
					</Swipeable>
				))}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		width: SCREEN_WIDTH,
		height: SCREEN_HEIGHT,
		// backgroundColor: "rgba(0, 0, 255, 0.2)",
		alignItems: "center",
		justifyContent: "center"
	}
});

export default Feed;
