import { Dimensions, Platform } from "react-native";

const { width, height } = Dimensions.get("window");

const SB_HEIGHT =
	Platform.OS === "ios" && (height === 812 || height === 896) ? 40 : 20;
const IS_X = SB_HEIGHT === 40;

const CATEGORIES = [
	{ title: "Concerts", name: "concerts" },
	{ title: "Sports", name: "sports" },
	{ title: "Shows", name: "shows" },
	{ title: "Comedy", name: "comedy" },
	{ title: "Art", name: "art" },
	{ title: "Nightlife", name: "clubs" },
	{ title: "Free", name: "free" },
	{ title: "Family Friendly", name: "family" },
	{ title: "Professional", name: "professional" }
];

const PREFERENCES = [
	{ title: "Lit", name: "lit" },
	{ title: "Active", name: "active" },
	{ title: "Relaxing", name: "relaxing" },
	{ title: "Outdoor", name: "outdoor" },
	{ title: "Cultural", name: "cultural" }
];

module.exports = {
	SCREEN_WIDTH: width,
	SCREEN_HEIGHT: height,
	SB_HEIGHT,
	IS_X,
	CATEGORIES,
	PREFERENCES
};
