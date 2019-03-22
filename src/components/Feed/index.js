import React, { Component } from "react";
import { Animated, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import _ from "lodash";
import { connect } from "react-redux";
import {Alert} from "react-native";

import Filter from "./Filter";
import EventCard from "../EventCard";
import Swipeable from "../EventCard/Swipeable";

import { SCREEN_WIDTH, SCREEN_HEIGHT } from "../../lib/constants";
import { LoadQueue } from "../../redux/queue";


const randomColor = () => {
	let r = Math.round(255 * Math.random());
	let g = Math.round(255 * Math.random());
	let b = Math.round(255 * Math.random());
	return `rgba(${r}, ${g}, ${b}, 0.9)`;
};

const DUMMY_DATA = [
	{
		id: "event1",
		eventName: "Khalid Summer Tour",
		startTime: "8:00pm",
		action: "Tickets from $20",
		startTime: "2019-03-03T22:00:00",
		endTime: "2019-03-4T05:00:00",
		imageUrl:
			"https://media.gq.com/photos/5a625821df8e105e64e8df4b/16:9/w_1280%2Cc_limit/Khalid_Shot_01-edit.jpg"
	},
	{
		id: "event2",
		eventName: "Yale Art Exhibit",
		startTime: "2019-03-04T22:00:00",
		endTime: "2019-03-5T05:00:00",
		action: "Add to Calendar",
		imageUrl: "http://assets.saatchiart.com/saatchi/882784/art/3164475/2234366-ECTUFHAI-8.jpg"
	},
	{
		id: "event3",
		eventName: "Branford College Tea",
		startTime: "2019-03-08T22:00:00",
		endTime: "2019-03-9T05:00:00",
		action: "Add to Calendar",
		imageUrl:
			"https://news.yale.edu/sites/default/files/styles/featured_media/public/2010_05_10_19_03_37_central_campus_1.jpg?itok=dFqc-hAD&c=07307e7d6a991172b9f808eb83b18804"
	}
];

class Feed extends Component {
	// constructor(props) {
 //    	super(props);
 //    	console.log("PROPS", props.queue)

	// }

	componentWillMount() {
 
	    this.props
	      .LoadQueue()
	      .then(() => {
	        Alert.alert("successfully got queue");
	        console.log("MOUNT LOG", this.props)
	      })
	      .catch(error => {
	        console.log(error);
	      });
  	}


	state = {
		count: 0,
		filterOpen: false,
		dragging: false,
		queue: this.props.queue,//[
		// 	{
		// 		id: "event1",
		// 		eventName: "Khalid Summer Tour",
		// 		tags: ["concert", "pop", "hip/hop"],
		// 		startTime: "8:00pm",
		// 		action: "Tickets from $20",
		// 		startTime: "2019-03-03T22:00:00",
		// 		endTime: "2019-03-4T05:00:00",
		// 		imageUrl:
		// 			"https://media.gq.com/photos/5a625821df8e105e64e8df4b/16:9/w_1280%2Cc_limit/Khalid_Shot_01-edit.jpg"
		// 	}
		// 	// 		{
		// 	// 			id: 1,
		// 	// 			backgroundColor: randomColor()
		// 	// 		},
		// 	// 		{
		// 	// 			id: 0,
		// 	// 			backgroundColor: randomColor()
		// 	// }
		// ],
		animatedValues: {
			event1: new Animated.Value(0),
			1: new Animated.Value(0)
		}
	};

	// swipeAmounts = [
	// 	new Animated.Value(0),
	// 	new Animated.Value(0),
	// 	new Animated.Value(0),
	// 	new Animated.Value(0),
	// 	new Animated.Value(0)
	// ];

	filterDrag = new Animated.Value(0);
	// swipeAmount = new Animated.Value(0);



	componentDidMount() {}

	// shouldComponentUpdate() {
	// 	return false;
	// }

	generateCard = () => {
		return {
			id: this.state.count + 1,
			backgroundColor: randomColor()
		};
	};

	fetchCards = () => {
		const { count, queue, animatedValues } = this.state;
		console.log("HEYYYYY^^^^^")
		console.log(this.state.queue)

		let newCard = this.generateCard();

		// let queue = ;
		this.setState({
			count: count + 1,
			queue: [...queue, newCard].sort((a, b) => b.id - a.id),
			animatedValues: { ...animatedValues, [newCard.id]: new Animated.Value(0) }
		});
	};

	popCard = ({ id }) => {
		const { queue, animatedValues } = this.state;
		let index = queue.findIndex(c => c.id === id);
		this.setState({
			queue: [...queue.slice(0, index), ...queue.slice(index + 1)],
			animatedValues: _.omit(animatedValues, id)
		});
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
		this.fetchCards();
	};

	render() {
		// console.log("render");
		const { animatedValues, filterOpen } = this.state;
		const queue = this.props.queue;
		console.log("RENDER QUEUE:" , this.props.queue);
		console.log("Queue: ", queue)

		const first = queue.length - 1;
		return (
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
