import "react-native";
import React from "react";
import Feed from "../src/components/Feed";
import renderer from "react-test-renderer";

it("Feed renders correctly", () => {
	const tree = renderer.create(<Feed />).toJSON();
	expect(tree).toMatchSnapshot();
});
