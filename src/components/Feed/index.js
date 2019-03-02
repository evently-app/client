import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";

import Card from "../EventCard";
import Swipeable from "../EventCard/Swipeable";

import { SCREEN_WIDTH, SCREEN_HEIGHT } from "../../lib/constants";

class Feed extends Component {
	randomColor = () => Math.round(255 * Math.random());

	state = {
		queue: [
			{
				name: "Khalid Concert",
				id: Math.random(), // obviously temporary
				backgroundColor: `rgba(${this.randomColor()}, ${this.randomColor()}, ${this.randomColor()} ,0.9)`
			},
			{
				name: "Khalid Concert",
				id: Math.random(), // obviously temporary
				backgroundColor: `rgba(${this.randomColor()}, ${this.randomColor()}, ${this.randomColor()} ,0.9)`
			}
		]
	};

	componentDidMount() {}

	generateCard = () => {
		return {
			name: "Khalid Concert",
			id: Math.random(), // obviously temporary
			backgroundColor: `rgba(${this.randomColor()}, ${this.randomColor()}, ${255 *
				Math.random()} ,0.9)`
		};
	};

	fetchCards = () => {
		this.setState({ queue: [...this.state.queue, this.generateCard()] });
	};

	popCard = () => {};

	onSwipeCardRight = card => {
		this.fetchCards();
		console.log(card);
	};

	onSwipeCardLeft = card => {
		this.fetchCards();
		console.log(card);
	};

	render() {
		const { queue } = this.state;

		return (
			<View style={styles.container}>
				{queue.map(card => (
					<Swipeable
						id={card.id}
						onSwipeRight={() => this.onSwipeCardRight(card)}
						onSwipeLeft={() => this.onSwipeCardLeft(card)}
					>
						<Card {...card} />
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
