import {
	BEGIN_TRANSITION,
	END_TRANSITION,
	SNAP_OPEN,
	SNAP_CLOSED,
	SCROLL_TIME_SELECTION,
	SCROLL_TYPE_SELECTION,
	beginTransition,
	endTransition,
	snapOpen,
	snapClosed,
	scrollTimeSelection,
	scrollTypeSelection
} from "../../src/redux/filter";

describe("actions", () => {
	it("Test begin transition", () => {
		const expectedAction = {
			type: BEGIN_TRANSITION
		};
		expect(beginTransition()).toEqual(expectedAction);
	});
	it("Test end transition ", () => {
		const expectedAction = {
			type: END_TRANSITION
		};
		expect(endTransition()).toEqual(expectedAction);
	});
	it("Test snapOpen ", () => {
		const expectedAction = {
			type: SNAP_OPEN
		};
		expect(snapOpen()).toEqual(expectedAction);
	});
	it("Test snap closed ", () => {
		const time = "sometime";
		const type = "some type";
		const expectedAction = {
			type: SNAP_CLOSED
			//timeSelection: time,
			//typeSelection: type
		};
		expect(snapClosed(time, type)).toEqual(expectedAction);
	});
	// it("Test scroll time selection", () => {
	// 	const selection = "someSelection";
	// 	const expectedAction = {
	// 		type: SCROLL_TIME_SELECTION,
	// 		selection: selection
	// 	};
	// 	expect(scrollTimeSelection(selection)).toEqual(expectedAction);
	// });
	// it("Test scroll type selection", () => {
	// 	const selection = "someSelection";
	// 	const expectedAction = {
	// 		type: SCROLL_TYPE_SELECTION,
	// 		selection: selection
	// 	};
	// 	expect(scrollTypeSelection(selection)).toEqual(expectedAction);
	// });
});
