import "react-native";
import React from "react";
import Profile from "../src/components/Profile";
import renderer from "react-test-renderer";

test("Profile renders correctly", () => {
	const tree = renderer.create(<Profile />).toJSON();
	expect(tree).toMatchSnapshot();
});
