// redux module for timeline
import axios from "axios";

// redux pattern: https://github.com/erikras/ducks-modular-redux

// define starting state
const initialState = {
	isLoadingTimeline: false,
	successLoadingTimeline: false,
	errorLoadingTimeline: null,
	timeline: []
};

// define actions against state
const RESET_TIMELINE = "evently/timeline/RESET_TIMELINE";
const LOAD_TIMELINE_INIT = "evently/timeline/LOAD_TIMELINE_INIT";
const LOAD_TIMELINE_SUCCESS = "evently/timeline/LOAD_TIMELINE_SUCCESS";
const LOAD_TIMELINE_FAILURE = "evently/timeline/LOAD_TIMELINE_FAILURE";
const PUSH = "evently/timeline/PUSH";

/* 
function that takes initial state and an action and returns next state
must be deterministic 
*/
export default (state = initialState, action) => {
	switch (action.type) {
		case RESET_TIMELINE:
			return initialState;

		case LOAD_TIMELINE_INIT:
			return {
				...state,
				isLoadingTimeline: true
			};

		case LOAD_TIMELINE_SUCCESS:
			return {
				...state,
				isLoadingTimeline: false,
				timeline: action.data,
				successLoadingTimeline: true
			};

		case LOAD_TIMELINE_FAILURE:
			return {
				...state,
				isLoadingTimeline: false,
				errorLoadingTimeline: action.error
			};

		case PUSH:
			// push item onto timeline, when right swipe on queue card 
			const newTimeline = state.timeline;
			newTimeline.push();
			return {
				...state,
				timeline: newTimeline
			};

		default:
			return state;
	}
};

// functions which return the actions that affects the state

export const loadTimelineInit = () => {
	return {
		type: LOAD_TIMELINE_INIT
	};
};

export const loadTimelineSuccess = data => {
	return {
		type: LOAD_TIMELINE_SUCCESS,
		data
	};
};

export const loadTimelineFailure = error => {
	return {
		type: LOAD_TIMELINE_FAILURE,
		error
	};
};

export const resetTimeline = () => {
	return {
		type: RESET_TIMELINE
	};
};


// complex functions which dispatch multiple action and can be asynchronous

export const LoadTimeline = () => {
	return (dispatch, getState) => {
		return new Promise((resolve, reject) => {
			dispatch(loadTimelineInit());

			const state = getState();
			const postData = {
				uid: state.user.uid
			};
			
		});
	};
};
