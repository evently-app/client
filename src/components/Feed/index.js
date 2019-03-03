import React, { Component } from "react";
import { Animated, View, Text, TouchableOpacity, StyleSheet } from "react-native";

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
		filterOpen: false,
		dragging: false,
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

	openFilter = () => {
		this.setState({ filterOpen: true }, () => this.Filter.snapTo({ index: 1 }));
	};

	closeFilter = () => {
		this.setState({ filterOpen: false }, () => this.Filter.snapTo({ index: 0 }));
	};

	onDrag = event => {
		this.setState({ dragging: !this.state.dragging });
	};

	render() {
		const { queue, filterOpen } = this.state;

		const firstCardIndex = queue.length - 1;
		return (
			<View style={styles.container}>
				<Filter
					interactableRef={Filter => (this.Filter = Filter)}
					onDrag={this.onDrag}
					onPress={filterOpen ? this.closeFilter : this.openFilter}
					filterDrag={this.filterDrag}
				/>
				<TouchableOpacity
					activeOpacity={1}
					pointerEvents={filterOpen ? "auto" : "box-none"}
					style={styles.center}
					onPressIn={this.closeFilter}
				>
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
				</TouchableOpacity>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		width: SCREEN_WIDTH,
		height: SCREEN_HEIGHT,
		justifyContent: "center"
	},
	center: {
		alignItems: "center",
		justifyContent: "center"
	}
});

export default Feed;
