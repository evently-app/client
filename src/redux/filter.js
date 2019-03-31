// filter redux module
const initialState = {
	open: false,
	dragging: false,
	timeSelection: 0,
	typeSelection: 0
};

const BEGIN_DRAG = "evently/filter/BEGIN_DRAG";
const END_DRAG = "evently/filter/END_DRAG";
const SNAP_OPEN = "evently/filter/SNAP_OPEN";
const SNAP_CLOSED = "evently/filter/SNAP_CLOSED";
const SCROLL_TIME_SELECTION = "evently/filter/SCROLL_TIME_SELECTION";
const SCROLL_TYPE_SELECTION = "evently/filter/SCROLL_TYPE_SELECTION";

export default (state = initialState, action) => {
	switch (action.type) {
		case BEGIN_DRAG:
			return {
				...state,
				dragging: true
			};

		case END_DRAG:
			return {
				...state,
				dragging: false
			};

		case SNAP_OPEN:
			return {
				...state,
				open: true
			};

		case SNAP_CLOSED:
			return {
				...state,
				open: false
			};

		case SCROLL_TIME_SELECTION:
			return {
				...state,
				timeSelection: action.selection
			};

		case SCROLL_TYPE_SELECTION:
			return {
				...state,
				typeSelection: action.selection
			};

		default:
			return state;
	}
};

// functions which return the actions that affects the state
export const BeginDrag = () => {
	return {
		type: BEGIN_DRAG
	};
};

export const EndDrag = () => {
	return {
		type: END_DRAG
	};
};

export const SnapOpen = () => {
	return {
		type: SNAP_OPEN
	};
};

export const SnapClosed = () => {
	return {
		type: SNAP_CLOSED
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
