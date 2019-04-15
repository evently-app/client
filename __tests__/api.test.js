import { WatchTimeline } from "../src/api";

jest.mock("react-native-firebase");

test("WatchTimeline", () => {
	const watchTimeline = WatchTimeline(
		"test eventId",
		userData => {},
		error => {}
	);
	return expect(typeof watchTimeline).toBe("function");
});
