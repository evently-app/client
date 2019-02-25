import "react-native";
import React from "react";
import EventCard from "../src/components/EventCard";
import renderer from "react-test-renderer";

test("EventCard renders correctly", () => {
	const tree = renderer.create(<EventCard />).toJSON();
	expect(tree).toMatchSnapshot();
});
