import "react-native";
import React from "react";
import { Feed } from "../src/components/Feed";
import { Filter } from "../src/components/Feed/Filter";

jest.mock("@mapbox/react-native-mapbox-gl");
jest.mock("react-native-permissions");

const Animated = {
	Value: class {
		constructor(initialValue) {
			this._value = initialValue;
		}

		interpolate() {}
	}
};

it("Feed renders correctly", () => {
	const snap = shallow(<Feed queue={[]} />);
	expect(snap).toMatchSnapshot();
});

it("Filters renders correctly", () => {
	const snap = shallow(<Filter filterDrag={new Animated.Value(0)} />);
	expect(snap).toMatchSnapshot();
});
