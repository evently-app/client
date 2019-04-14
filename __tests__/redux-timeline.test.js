import {
	RESET_TIMELINE,
	LOAD_TIMELINE_INIT,
	LOAD_TIMELINE_SUCCESS,
	LOAD_TIMELINE_FAILURE,
	PUSH,
	loadTimelineInit,
	loadTimelineSuccess,
	loadTimelineFailure,
	resetTimeline,
	push
} from "../src/redux/timeline";

describe("actions", () => {
	it("Test reset Timeline", () => {
		const expectedAction = {
			type: RESET_TIMELINE
		};
		expect(resetTimeline()).toEqual(expectedAction);
	});
	it("Test load Timeline init ", () => {
		const expectedAction = {
			type: LOAD_TIMELINE_INIT
		};
		expect(loadTimelineInit()).toEqual(expectedAction);
	});
	it("Test loadTimeline_success ", () => {
		const data = [];
		const expectedAction = {
			type: LOAD_TIMELINE_SUCCESS,
			data
		};
		expect(loadTimelineSuccess(data)).toEqual(expectedAction);
	});
	it("Test load Timeline failure ", () => {
		const error = "error message";
		const expectedAction = {
			type: LOAD_TIMELINE_FAILURE,
			error
		};
		expect(loadTimelineFailure(error)).toEqual(expectedAction);
	});
	it("Test push ", () => {
		const event = [];
		const expectedAction = {
			type: PUSH,
			event
		};
		expect(push(event)).toEqual(expectedAction);
	});
});
