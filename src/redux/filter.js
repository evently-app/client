// filter redux module
const initialState = {
	open: false,
	transitioning: false,
	timeSelection: 0,
	typeSelection: 0
};

const BEGIN_TRANSITION = "evently/filter/BEGIN_TRANSITION";
const END_TRANSITION = "evently/filter/END_TRANSITION";
const SNAP_OPEN = "evently/filter/SNAP_OPEN";
const SNAP_CLOSED = "evently/filter/SNAP_CLOSED";
// const SCROLL_TIME_SELECTION = "evently/filter/SCROLL_TIME_SELECTION";
// const SCROLL_TYPE_SELECTION = "evently/filter/SCROLL_TYPE_SELECTION";

export default (state = initialState, action) => {
	switch (action.type) {
		case BEGIN_TRANSITION:
			return {
				...state,
				transitioning: true
			};

		case END_TRANSITION:
			return {
				...state,
				transitioning: false
			};

		case SNAP_OPEN:
			return {
				...state,
				transitioning: false,
				open: true
			};

		case SNAP_CLOSED:
			return {
				...state,
				timeSelection: action.timeSelection,
				typeSelection: action.typeSelection,
				transitioning: false,
				open: false
			};

		default:
			return state;
	}
};

// functions which return the actions that affects the state
export const BeginTransition = () => {
	return {
		type: BEGIN_TRANSITION
	};
};

export const EndTransition = () => {
	return {
		type: END_TRANSITION
	};
};

export const SnapOpen = () => {
	return {
		type: SNAP_OPEN
	};
};

export const SnapClosed = ({ time, type }) => {
	return {
		type: SNAP_CLOSED,
		timeSelection: time,
		typeSelection: type
	};
};

export const ScrollTimeSelection = selection => {
	return {
		type: SCROLL_TIME_SELECTION,
		selection
	};
};

export const ScrollTypeSelection = selection => {
	return {
		type: SCROLL_TYPE_SELECTION,
		selection
	};
};
