import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";

import EventCard from "../EventCard";
import Swipeable from "../EventCard/Swipeable";

import { SCREEN_WIDTH, SCREEN_HEIGHT } from "../../lib/constants";

class Feed extends Component {
	randomColor = () => {
		let r = Math.round(255 * Math.random());
		let g = Math.round(255 * Math.random());
		let b = Math.round(255 * Math.random());
		return `rgba(${r}, ${g}, ${b}, 0.9)`;
	};

	state = {
		count: 1,
		queue: [
			{
				id: 1,
				backgroundColor: this.randomColor()
			},
			{
				id: 0,
				backgroundColor: this.randomColor()
			}
		]
	};

	componentDidMount() {}

	generateCard = () => {
		return {
			id: this.state.count + 1,
			backgroundColor: this.randomColor()
		};
	};

	fetchCards = () => {
		let newCard = this.generateCard();

		let queue = [...this.state.queue.slice(0, 1), newCard].sort((a, b) => b.id - a.id);
		console.log("queue:", queue);
		this.setState({
			count: this.state.count + 1,
			queue
		});
	};

	onSwipeCardRight = card => {
		// this.popCard(card);
		this.fetchCards();
		console.log(card);
	};

	onSwipeCardLeft = card => {
		// this.popCard(card);
		this.fetchCards();
		console.log(card);
	};

	render() {
		const { queue } = this.state;
		console.log(queue);

		return (
			<View style={styles.container}>
				{queue.map(card => (
					<Swipeable
						key={card.id}
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
		backgroundColor: "rgba(0, 0, 255, 0.2)",
		justifyContent: "center",
		alignItems: "center"
	}
});

export default Feed;
