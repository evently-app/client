import "react-native";
import React from "react";
import Timeline from "../src/components/Timeline";
import renderer from "react-test-renderer";
import EventCardPreview from "../src/components/Timeline/EventCardPreview";
import CalendarButton from "../src/components/Timeline/CalendarButton";

// test("Timeline renders correctly", () => {
// 	const tree = renderer.create(<Timeline />).toJSON();
// 	expect(tree).toMatchSnapshot();
// });

it("Timeline renders correctly", () => {
	const snap = shallow(<Timeline timeline={[]} />);
	expect(snap).toMatchSnapshot();
});

it("Event card preview renders correctly", () => {
	const snap = shallow(<EventCardPreview />);
	expect(snap).toMatchSnapshot();
});

it("Add to calendar button renders correctly", () => {
	const snap = shallow(<CalendarButton />);
	expect(snap).toMatchSnapshot();
});
