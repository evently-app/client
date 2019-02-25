import "react-native";
import React from "react";
import Timeline from "../src/components/Timeline";
import renderer from "react-test-renderer";

test("Timeline renders correctly", () => {
	const tree = renderer.create(<Timeline />).toJSON();
	expect(tree).toMatchSnapshot();
});
