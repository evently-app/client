import axios from "axios";

import firebase from "react-native-firebase";
import { GeoFirestore } from "geofirestore";

let firestore = firebase.firestore();
let geofirestore = new GeoFirestore(firestore);

// redux pattern: https://github.com/erikras/ducks-modular-redux

// define starting state
const initialState = {
	isLoadingQueue: false,
	successLoadingQueue: false,
	errorLoadingQueue: null,
	queue: []
};

var coordinates = null;

// define actions against state
const RESET_QUEUE = "evently/queue/RESET_QUEUE";
const LOAD_QUEUE_INIT = "evently/queue/LOAD_QUEUE_INIT";
const LOAD_QUEUE_SUCCESS = "evently/queue/LOAD_QUEUE_SUCCESS";
const LOAD_QUEUE_FAILURE = "evently/queue/LOAD_QUEUE_FAILURE";
const POP = "evently/queue/POP";

/* 
function that takes initial state and an action and returns next state
must be deterministic 
*/
export default (state = initialState, action) => {
	switch (action.type) {
		case RESET_QUEUE:
			return initialState;

		case LOAD_QUEUE_INIT:
			return {
				...state,
				isLoadingQueue: true
			};

		case LOAD_QUEUE_SUCCESS:
			// console.log("action data", action.data)
			return {
				...state,
				isLoadingQueue: false,
				queue: action.data,
				successLoadingQueue: true
			};

		case LOAD_QUEUE_FAILURE:
			return {
				...state,
				isLoadingQueue: false,
				errorLoadingQueue: action.error
			};

		case POP:
			// pop item off queue
			let newQueue = state.queue;
			if (newQueue.length > 0) {
				newQueue.pop();
			}
			return {
				...state,
				queue: newQueue
			};

		default:
			return state;
	}
};

// functions which return the actions that affects the state

export const loadQueueInit = () => {
	return {
		type: LOAD_QUEUE_INIT
	};
};

export const loadQueueSuccess = data => {
	return {
		type: LOAD_QUEUE_SUCCESS,
		data
	};
};

export const loadQueueFailure = error => {
	return {
		type: LOAD_QUEUE_FAILURE,
		error
	};
};

export const resetQueue = () => {
	return {
		type: RESET_QUEUE
	};
};

export const pop = () => {
	return {
		type: POP
	};
};

// complex functions which dispatch multiple action and can be asynchronous

export const LoadQueue = eventType => {
	return (dispatch, getState) => {
		return new Promise((resolve, reject) => {
			dispatch(loadQueueInit());

			const state = getState();
			const uid = state.user.uid;
			const alreadySwiped = !!state.user.entity.events
				? state.user.entity.events
				: {};

			//get user location and grab events
			navigator.geolocation.getCurrentPosition(
				position => {
					const { latitude, longitude } = position.coords;

					const geocollection = geofirestore.collection("eventsLocations");

					const query = geocollection.near({
						center: new firebase.firestore.GeoPoint(latitude, longitude),
						radius: 1000
					});

					query.onSnapshot(
						snapshot => {
							const eventIdsToPresent = [];

							// filter out events that the user has already swiped on
							for (let i = 0; i < snapshot.docs.length; i++) {
								const eventId = snapshot.docs[i].id;
								if (alreadySwiped[eventId] != true) {
									// user has not swiped on this event
									eventIdsToPresent.push(eventId);
								}
							}

							// get all new events' data
							const getEventPromises = [];
							for (let i = 0; i < eventIdsToPresent.length; i++) {
								const eventId = eventIdsToPresent[i];
								getEventPromises.push(
									firestore
										.collection("events")
										.doc(eventId)
										.get()
								);
							}

							//
							Promise.all(getEventPromises).then(results => {
								const eventsData = results.map(doc => {
									return {
										...doc.data(),
										id: doc.id
									};
								});
								dispatch(loadQueueSuccess(eventsData));
								resolve();
							});
						},
						error => {
							dispatch(loadQueueFailure(error));
							reject(error);
						}
					);
				},
				error => {
					dispatch(loadQueueFailure(error));
					reject(error);
				},
				{ enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
			);
		});
	};
};
