import "react-native";
import React from "react";
import renderer from "react-test-renderer";
import Spinner from "../src/components/universal/Spinner";
import TouchableScale from "../src/components/universal/TouchableScale";
import { Header, SubHeader, Paragraph } from "../src/components/universal/Text";

test("Spinner renders correctly", () => {
	const tree = renderer.create(<Spinner />).toJSON();
	expect(tree).toMatchSnapshot();
});

it("Text -- header renders correctly", () => {
	const tree = renderer.create(<Header />).toJSON();
	expect(tree).toMatchSnapshot();
});

it("Text -- Subheader renders correctly", () => {
	const tree = renderer.create(<SubHeader />).toJSON();
	expect(tree).toMatchSnapshot();
});

it("Text -- Paragraph renders correctly", () => {
	const tree = renderer.create(<Paragraph />).toJSON();
	expect(tree).toMatchSnapshot();
});
