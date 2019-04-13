import "react-native";
import React from "react";
import { Profile } from "../src/components/Profile";
import Dial from "../src/components/Profile/Dial";

test("Profile renders correctly", () => {
	const tree = shallow(<Profile userEntity={{}} />);
	expect(tree).toMatchSnapshot();
});

test("Dial renders correctly", () => {
	const tree = shallow(<Dial title="test dial" />);
	expect(tree).toMatchSnapshot();
});
