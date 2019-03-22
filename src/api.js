// this file handles all non-redux calls to firebase and outside api's
import firebase from "react-native-firebase";
let firestore = firebase.firestore();

// update user function that returns promise
export const UpdateUser = (uid, data) => {
	return firestore
		.collection("users")
		.doc(uid)
		.update(data);
};

export const WatchEvent = (eventId, successCallback, errorCallback) => {
	// watches user and fires successCallback on user entity change, returns listener
	// return firestore.collection("users").doc(uid).onSnapshot(doc => {}, error => {})
};

export const RegisterSwipe = (userId, eventId, swipedRight) => {
	// registers a users swipe
	// returns promise
};

export const WatchTimeline = userId => {
	// watches events that should be in users timeline, returns listenerr
	// return firestore.collection("users").doc(uid).collection("timeline").onSnapshot(doc => {}, error => {})
};

export const PullCalendarInfo = (startTime, endTime) => {
	// pull calendar info from local calendar / gcal auth
	// returns promise that resolves to array of calendar events within startTime and endTime
};

export const AddEventToCalendar = eventData => {
	// adds event to local calendar / pushes to gcal
	// returns promise
};
