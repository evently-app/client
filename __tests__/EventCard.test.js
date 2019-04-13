import "react-native";
import React from "react";
import EventCard from "../src/components/EventCard";
import renderer from "react-test-renderer";
import ActionButton from "../src/components/EventCard/ActionButton";
import Description from "../src/components/EventCard/Description";

jest.mock("@mapbox/react-native-mapbox-gl");

const yOffset = {
	interpolate: () => {}
};

test("EventCard renders correctly", () => {
	const tree = renderer.create(<EventCard />).toJSON();
	expect(tree).toMatchSnapshot();
});

it("Description renders correctly", () => {
	const snap = shallow(<Description />);
	expect(snap).toMatchSnapshot();
});

it("Action Button renders correctly", () => {
	const snap = shallow(<ActionButton yOffset={yOffset} />);
	expect(snap).toMatchSnapshot();
});
