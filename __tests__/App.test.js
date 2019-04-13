import "react-native";
import React from "react";
import { App } from "../src/components/App";

jest.mock("react-native-code-push");

it("App renders correctly", () => {
	const snap = shallow(
		<App
			Auth={() => {
				return Promise.resolve();
			}}
			WatchUser={() => {
				return () => {};
			}}
		/>
	);
	expect(snap).toMatchSnapshot();
});
