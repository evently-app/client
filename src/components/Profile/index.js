import React, { Component } from "react";
import { View, StyleSheet } from "react-native";
import { Header } from "../universal/Text";
import Dial from "./Dial";
import { WatchUser } from "../../redux/user";
import { UpdateUser } from "../../api";
import { connect } from "react-redux";

import {
	SCREEN_WIDTH,
	SCREEN_HEIGHT,
	IS_X,
	CATEGORIES
} from "../../lib/constants";

export class Profile extends Component {
	render() {
		const Dials = [];
		for (let i = 0; i < CATEGORIES.length; i++) {
			const category = CATEGORIES[i];
			const fill =
				!!this.props.userEntity.preferences &&
				!!this.props.userEntity.preferences[category.name]
					? this.props.userEntity.preferences[category.name]
					: 0;
			Dials.push(
				<Dial
					key={`dial-${category.name}`}
					title={category.title}
					fill={fill}
					onChange={value => {
						UpdateUser(this.props.uid, {
							[`preferences.${category.name}`]: value
						}).then(() => {
							// successfully updated
							console.log(`updated ${category.name} to ${value}`);
						});
					}}
				/>
			);
		}

		return (
			<View style={styles.wrapper}>
				<Header style={styles.header}>Preferences</Header>
				<View style={styles.dials}>{Dials}</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	wrapper: {
		flex: 1,
		width: SCREEN_WIDTH,
		height: SCREEN_HEIGHT,
		flexDirection: "column",
		justifyContent: "flex-start",
		alignItems: "flex-start",
		paddingBottom: 20,
		paddingTop: IS_X ? 60 : 40
	},
	header: {
		marginLeft: 20
	},
	dials: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "space-around",
		paddingTop: 20
	}
});

const mapStateToProps = state => {
	return {
		uid: state.user.uid,
		userEntity: state.user.entity
	};
};

const mapDispatchToProps = {
	WatchUser
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Profile);
