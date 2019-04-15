import {
	RESET_QUEUE,
	LOAD_QUEUE_INIT,
	LOAD_QUEUE_SUCCESS,
	LOAD_QUEUE_FAILURE,
	POP,
	loadQueueInit,
	loadQueueSuccess,
	loadQueueFailure,
	resetQueue,
	pop
} from "../../src/redux/queue";

describe("actions", () => {
	it("Test reset queue", () => {
		const expectedAction = {
			type: RESET_QUEUE
		};
		expect(resetQueue()).toEqual(expectedAction);
	});
	it("Test load queue init ", () => {
		const expectedAction = {
			type: LOAD_QUEUE_INIT
		};
		expect(loadQueueInit()).toEqual(expectedAction);
	});
	it("Test loadQueue_success ", () => {
		const events = [];
		const lastDoc = [];
		const filterType = "";
		const filterTime = "";
		const expectedAction = {
			type: LOAD_QUEUE_SUCCESS,
			events,
			lastDoc,
			filterTime,
			filterType
		};
		expect(
			loadQueueSuccess({ events, lastDoc, filterTime, filterType })
		).toEqual(expectedAction);
	});
	it("Test load queue failure ", () => {
		const error = "error message";
		const expectedAction = {
			type: LOAD_QUEUE_FAILURE,
			error
		};
		expect(loadQueueFailure(error)).toEqual(expectedAction);
	});
	it("Test pop ", () => {
		const expectedAction = {
			type: POP
		};
		expect(pop()).toEqual(expectedAction);
	});
});
