import {
	WatchUser,
	WatchEvent,
	RegisterSwipe,
	WatchTimeline,
	PullCalendarInfo,
	AddEventToCalendar
} from "../src/api";

test("WatchUser", () => {
	const watchUser = WatchUser("test userId", userData => {}, error => {});
	return expect(typeof watchUser).toBe("function");
});

test("WatchEvent", () => {
	const watchEvent = WatchEvent("test eventId", userData => {}, error => {});
	return expect(typeof watchEvent).toBe("function");
});

test("WatchTimeline", () => {
	const watchTimeline = WatchTimeline(
		"test eventId",
		userData => {},
		error => {}
	);
	return expect(typeof watchTimeline).toBe("function");
});

test("RegisterSwipe", async () => {
	await expect(RegisterSwipe("real userId", "real eventId", true)).resolves;
	await expect(RegisterSwipe("real userId", "fake eventId", true)).rejects;
	await expect(RegisterSwipe("fake userId", "real eventId", true)).rejects;
	await expect(RegisterSwipe("fake userId", "fake eventId", true)).rejects;
});
