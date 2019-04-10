import axios from "axios";
import firebase from "react-native-firebase";
import _ from "lodash";

import { setLocation } from "./user";
import { CATEGORIES } from "../lib/constants";

let firestore = firebase.firestore();

// redux pattern: https://github.com/erikras/ducks-modular-redux

// define starting state
const initialState = {
	isLoadingQueue: false,
	successLoadingQueue: false,
	errorLoadingQueue: false,
	currentTimeFilter: 0,
	currentTypeFilter: 0,
	queue: [],
	lastDoc: null
};

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
			// if the filter state has been updated, we need to replace the queue completely
			// otherwise we merge with the events still in the queue
			const filterUpdated =
				state.currentTypeFilter != action.typeFilter ||
				state.currentTimeFilter != action.timeFilter;

			return {
				...state,
				isLoadingQueue: false,
				successLoadingQueue: true,
				currentTypeFilter: action.filterType,
				currentTimeFilter: action.filterTime,
				lastDoc: action.lastDoc,
				queue: filterUpdated ? action.events : _.unionBy(action.events, state.queue, ({ id }) => id)
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
export const loadQueueInit = () => ({
	type: LOAD_QUEUE_INIT
});

export const loadQueueSuccess = ({ events, lastDoc, filterTime, filterType }) => ({
	type: LOAD_QUEUE_SUCCESS,
	events,
	lastDoc,
	filterTime,
	filterType
});

export const loadQueueFailure = error => ({
	type: LOAD_QUEUE_FAILURE,
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
			// console.log("filter time type in load Queue", filterTime, filterType);

			const state = getState();
			const { user, queue } = state;

			const { uid } = user;
			const { lastDoc: startAt } = queue;

			navigator.geolocation.getCurrentPosition(
				({ coords }) => {
					const { latitude, longitude } = coords;

					// OVERRIDE FOR DEV
					// const latitude = 41.310726;
					// const longitude = -72.929916;

					dispatch(setLocation({ latitude, longitude }));

					if (queue.queue.length < 5) {
						// .post("http://localhost:3000/ping_events_queue", {
						axios
							.post("https://event-queue-service.herokuapp.com/ping_events_queue", {
								coordinates: { latitude, longitude },
								radius: 100,
								uid
							})
							.then(response => {
								FetchEvents({
									uid,
									startAt,
									filter: { filterTime, filterType },
									amount: 25
								})
									.then(({ events, lastDoc }) => {
										resolve();
										dispatch(
											loadQueueSuccess({
												events,
												lastDoc,
												filterTime,
												filterType
											})
										);
									})
									.catch(error => {
										reject();
										dispatch(loadQueueFailure(error));
									});
							})
							.catch(error => {
								// console.log("post error", error);
								reject();
								dispatch(loadQueueFailure(error));
							});
					} else {
						const {
							queue: events,
							currentTimeFilter: filterTime,
							currentTypeFilter: filterType,
							lastDoc
						} = queue;

						resolve();
						dispatch(
							loadQueueSuccess({
								events,
								lastDoc,
								filterTime,
								filterType
							})
						);
					}
				},
				error => {
					dispatch(loadQueueFailure(error));
					reject(error);
				},
				{ enableHighAccuracy: false, timeout: 20000, maximumAge: 1000 }
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
			const { lastDoc: startAt, currentTimeFilter, currentTypeFilter } = queue;

			const filterChanged = currentTimeFilter !== filterTime || currentTypeFilter !== filterType;

			if (filterChanged) dispatch(loadQueueInit());

			FetchEvents({
				uid,
				startAt: filterChanged ? null : startAt, // if the filter has changed we need to start looking from the top of the queue
				filter: { filterTime, filterType },
				amount: 15
			})
				.then(({ events, lastDoc }) => {
					resolve();
					dispatch(loadQueueSuccess({ events, lastDoc, filterTime, filterType }));
				})
				.catch(error => {
					reject();
					dispatch(loadQueueFailure(error));
				});
		});
	};
};

const generateQuery = ({ ref, startAtDoc, amount, filterType }) => {
	// console.log(ref, startAtDoc, amount, filterType);
	if (startAtDoc.exists && filterType)
		return (
			ref
				.where("swiped", "==", false)
				// .where("tags", "array-contains", CATEGORIES[filterType].title)
				.orderBy("score", "desc")
				.startAt(startAtDoc)
				.limit(amount)
		);
	else if (!startAtDoc.exists && filterType)
		return (
			ref
				.where("swiped", "==", false)
				// .where("tags", "array-contains", CATEGORIES[filterType].title)
				.orderBy("score", "desc")
				.limit(amount)
		);
	else if (startAtDoc.exists && !filterType)
		return ref
			.where("swiped", "==", false)
			.orderBy("score", "desc")
			.startAt(startAtDoc)
			.limit(amount);
	else if (!startAtDoc.exists && !filterType)
		return ref
			.where("swiped", "==", false)
			.orderBy("score", "desc")
			.limit(amount);
};

const FetchEvents = ({ uid, amount, startAt, filter: { filterType } }) => {
	return new Promise(async (resolve, reject) => {
		// const eventsRef = firestore.collection("events");
		const userEventsRef = firestore
			.collection("users")
			.doc(uid)
			.collection("eventQueue");

		const startAtDoc =
			startAt === null ? { exists: false } : await userEventsRef.doc(startAt).get();

		const query = generateQuery({
			ref: userEventsRef,
			startAtDoc,
			amount,
			filterType
		});

		query
			.get()
			.then(snapshot => {
				let events = [];

				snapshot.forEach(doc => {
					events.push({ id: doc.id, ...doc.data() });
				});

				const lastDoc = snapshot.docs[snapshot.docs.length - 1].data().id;

				resolve({ events, lastDoc });

				// 				let eventIds = [];
				// 				snapshot.forEach(doc => {
				// 					eventIds.push(doc.id);
				// 				});
				//
				// console.log(eventIds);
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
