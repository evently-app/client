import "react-native";
import React from "react";
import App from "../src/components/App";
import renderer from "react-test-renderer";

it("App renders correctly", () => {
	const tree = renderer.create(<App />).toJSON();
	expect(tree).toMatchSnapshot();
});
