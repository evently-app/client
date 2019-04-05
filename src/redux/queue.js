import axios from "axios";

import firebase from "react-native-firebase";

import { setLocation } from "./user";
// import { GeoFirestore } from "geofirestore";

let firestore = firebase.firestore();
// let geofirestore = new GeoFirestore(firestore);

// redux pattern: https://github.com/erikras/ducks-modular-redux

// define starting state
const initialState = {
	isLoadingQueue: false,
	successLoadingQueue: false,
	errorLoadingQueue: false,
	queue: []
};

// define actions against state
const RESET_QUEUE = "evently/queue/RESET_QUEUE";
const LOAD_QUEUE_INIT = "evently/queue/LOAD_QUEUE_INIT";
const LOAD_QUEUE_SUCCESS = "evently/queue/LOAD_QUEUE_SUCCESS";
const LOAD_QUEUE_FAILURE = "evently/queue/LOAD_QUEUE_FAILURE";
const UPDATE_QUEUE_SUCCESS = "evently/queue/UPDATE_QUEUE_SUCCESS";
const UPDATE_QUEUE_FAILURE = "evently/queue/UPDATE_QUEUE_FAILURE";
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

		case UPDATE_QUEUE_SUCCESS:
			const { queue } = state;
			console.log("hi", [...action.data, ...queue]);

			return {
				...state,
				queue: [...action.data, ...queue]
			};

		case UPDATE_QUEUE_FAILURE:
			return {
				...state,
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

export const loadQueueInit = () => ({
	type: LOAD_QUEUE_INIT
});

export const loadQueueSuccess = data => ({
	type: LOAD_QUEUE_SUCCESS,
	data
});

export const loadQueueFailure = error => ({
	type: LOAD_QUEUE_FAILURE,
	error
});

export const updateQueueSuccess = data => ({
	type: UPDATE_QUEUE_SUCCESS,
	data
});

export const updateQueueFailure = error => ({
	type: UPDATE_QUEUE_FAILURE,
	error
});

export const resetQueue = () => ({
	type: RESET_QUEUE
});

export const pop = () => ({
	type: POP
});

// complex functions which dispatch multiple action and can be asynchronous
export const LoadQueue = ({ filterTime, filterType }) => {
	return (dispatch, getState) => {
		return new Promise((resolve, reject) => {
			dispatch(loadQueueInit());

			const state = getState();
			const { user } = state;
			const { uid } = user;

			navigator.geolocation.getCurrentPosition(
				({ coords }) => {
					// const { latitude, longitude } = coords;

					// OVERRIDE FOR DEV
					const latitude = 41.310726;
					const longitude = -72.929916;

					dispatch(setLocation({ latitude, longitude }));

					// .post("http://localhost:3000/ping_events_queue", {

					axios
						.post("https://event-queue-service.herokuapp.com/ping_events_queue", {
							coordinates: { latitude, longitude },
							radius: 100,
							uid: uid
						})
						.then(response => {
							console.log(response);
							FetchEvents({ uid, amount: 15 })
								.then(events => {
									resolve();
									dispatch(loadQueueSuccess(events));
								})
								.catch(error => {
									reject();
									dispatch(loadQueueFailure(error));
								});
						})
						.catch(loadQueueFailure);
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

// fired every 10 swipes
export const UpdateQueue = ({ filterTime, filterType }) => {
	return (dispatch, getState) => {
		return new Promise((resolve, reject) => {
			const state = getState();
			const { user, queue } = state;
			const { uid } = user;

			const last = queue.queue[0];

			console.log("startAt:", last.id);

			FetchEvents({ uid, amount: 10, startAt: last.id })
				.then(events => {
					console.log("new events:", events);
					resolve();
					dispatch(updateQueueSuccess(events));
				})
				.catch(error => {
					reject();
					dispatch(updateQueueFailure(error));
				});
		});
	};
};

const FetchEvents = ({ uid, amount, startAt }) => {
	return new Promise((resolve, reject) => {
		// const eventsRef = firestore.collection("events");
		const userEventsRef = firestore
			.collection("users")
			.doc(uid)
			.collection("eventQueue");

		const query = startAt
			? userEventsRef
					.where("swiped", "==", false)
					.orderBy("score")
					.startAt(startAt)
					.limit(amount)
			: userEventsRef
					.where("swiped", "==", false)
					.orderBy("score")
					.limit(amount);

		query
			.get()
			.then(snapshot => {
				let events = [];

				snapshot.forEach(doc => {
					events.push({ id: doc.id, ...doc.data() });
				});

				resolve(events);

				// 				let eventIds = [];
				// 				snapshot.forEach(doc => {
				// 					eventIds.push(doc.id);
				// 				});
				//
				// 				console.log(eventIds);
				//
				// 				let promises = [];
				// 				eventIds.forEach(id => {
				// 					promises.push(eventsRef.doc(id).get());
				// 				});
				//
				// 				Promise.all(promises)
				// 					.then(data => {
				// 						const events = data.map(doc => ({
				// 							...doc.data(),
				// 							id: doc.id
				// 						}));
				//
				// 						console.log(events);
				//
				// 						resolve(events);
				// 					})
				// 					.catch(reject);
			})
			.catch(reject);
	});
};
