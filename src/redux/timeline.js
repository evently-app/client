// redux module for timeline
import axios from "axios";
import { pop } from "./queue";
import { RegisterSwipeRight, RegisterSwipeLeft, WatchTimeline } from "../api";

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
			const newTimeline = [...state.timeline, action.event];
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

export const push = event => {
	return {
		type: PUSH,
		event
	};
};

// complex functions which dispatch multiple action and can be asynchronous

export const SwipeRight = event => {
	return (dispatch, getState) => {
		return new Promise((resolve, reject) => {
			// move from redux queue to timeline
			dispatch(pop());
			dispatch(push(event));

			const state = getState();

			let eventData = event;
			const eventId = event.id;
			delete eventData.id;

			// add to firebase
			RegisterSwipeRight(state.user.uid, eventId, eventData)
				.then(() => resolve())
				.catch(error => reject(error));
		});
	};
};

export const SwipeLeft = event => {
	return (dispatch, getState) => {
		return new Promise((resolve, reject) => {
			// remove from redux queue
			dispatch(pop());

			const state = getState();

			let eventData = event;
			const eventId = event.id;
			delete eventData.id;

			// add to firebase
			RegisterSwipeLeft(state.user.uid, eventId, eventData)
				.then(() => resolve())
				.catch(error => reject(error));
		});
	};
};

export const LoadTimeline = () => {
	return (dispatch, getState) => {
		return new Promise((resolve, reject) => {
			dispatch(loadTimelineInit());

			const state = getState();
			const uid = state.user.uid;

			WatchTimeline(
				uid,
				data => {
					dispatch(loadTimelineSuccess(data));
				},
				error => {
					dispatch(loadTimelineFailure(error));
				}
			);
		});
	};
};
