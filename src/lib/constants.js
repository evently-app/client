import { Dimensions, Platform } from "react-native";

const { width, height } = Dimensions.get("window");

const SB_HEIGHT = Platform.OS === "ios" && (height === 812 || height === 896) ? 40 : 20;
const IS_X = SB_HEIGHT === 40;

const CATEGORIES = [
	{ title: "Anything", name: "anything" },
	{ title: "Free", name: "free" },
	{ title: "Shows", name: "shows" },
	{ title: "Sports", name: "sports" },
	{ title: "Art", name: "art" },
	{ title: "Nightlife", name: "clubs" },
	{ title: "Family", name: "family" },
	{ title: "Professional", name: "professional" }
];

const PREFERENCES = [
	{ title: "Lit", name: "lit" },
	{ title: "Active", name: "active" },
	{ title: "Relaxing", name: "relaxing" },
	{ title: "Cultural", name: "cultural" }
];

const TIME_TYPES = [
	{ title: "Upcoming", name: "upcoming" },
	{ title: "Next Week", name: "next week" },
	{ title: "This Month", name: "this month" }
];

module.exports = {
	SCREEN_WIDTH: width,
	SCREEN_HEIGHT: height,
	SB_HEIGHT,
	IS_X,
	CATEGORIES,
	TIME_TYPES,
	PREFERENCES
};
