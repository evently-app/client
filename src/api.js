// this file handles all calls to firebase and outside api's

export const WatchUser = (userId, successCallback, errorCallback) => {
	// watches user and fires successCallback on user entity change, returns listener
	// return firestore.collection("users").doc(uid).onSnapshot(doc => {}, error => {})
};

export const WatchEvent = (eventId, successCallback, errorCallback) => {
	// watches user and fires successCallback on user entity change, returns listener
	// return firestore.collection("users").doc(uid).onSnapshot(doc => {}, error => {})
};

export const RegisterSwipe = (userId, eventId, swipedRight) => {
	// registers a users swipe
};

export const WatchTimeline = userId => {
	// watches events that should be in users timeline
	// return firestore.collection("users").doc(uid).collection("timeline").onSnapshot(doc => {}, error => {})
};
