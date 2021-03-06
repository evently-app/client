import { resetQueue } from "./queue";
import firebase from "react-native-firebase";
import moment from "moment";
import { PREFERENCES } from "../lib/constants";
let firestore = firebase.firestore();

// redux pattern: https://github.com/erikras/ducks-modular-redux

// define starting state
export const initialState = {
	uid: null,
	entity: {},
	location: { latitude: 0.0, longitude: 0.0 },
	isAuthenticating: false,
	errorAuthenticating: null,
	isWatchingUser: false,
	errorWatchingUser: null
};

// define actions against state
export const RESET_USER = "evently/user/RESET_USER";
export const AUTH_INIT = "evently/user/AUTH_INIT";
export const AUTH_SUCCESS = "evently/user/AUTH_SUCCESS";
export const AUTH_FAILURE = "evently/user/AUTH_FAILURE";
export const SET_LOCATION = "evently/user/SET_LOCATION";
export const WATCH_USER_INIT = "evently/user/WATCH_USER_INIT";
export const WATCH_USER_SUCCESS = "evently/user/WATCH_USER_SUCCESS";
export const WATCH_USER_FAILURE = "evently/user/WATCH_USER_FAILURE";

/* 
function that takes initial state and an action and returns next state
must be deterministic 
*/
export default (state = initialState, action) => {
	switch (action.type) {
		case RESET_USER:
			return initialState;

		case AUTH_INIT:
			return {
				...state,
				isAuthenticating: true
			};

		case AUTH_SUCCESS:
			return {
				...state,
				isAuthenticating: false,
				entity: action.data,
				uid: action.userId
			};

		case AUTH_FAILURE:
			return {
				...state,
				isAuthenticating: false,
				errorAuthenticating: action.error
			};

		case SET_LOCATION:
			return {
				...state,
				location: action.location
			};

		case WATCH_USER_INIT:
			return {
				...state,
				isWatchingUser: true
			};

		case WATCH_USER_SUCCESS:
			return {
				...state,
				isWatchingUser: true,
				entity: action.data
			};

		case WATCH_USER_FAILURE:
			return {
				...state,
				isWatchingUser: false,
				errorWatchingUser: action.error
			};

		default:
			return state;
	}
};

// functions which return the actions that affects the state

export const authInit = () => {
	return {
		type: AUTH_INIT
	};
};

export const authSuccess = (userId, data) => {
	return {
		type: AUTH_SUCCESS,
		data,
		userId
	};
};

export const authFailure = error => {
	return {
		type: AUTH_FAILURE,
		error
	};
};

export const setLocation = location => ({
	type: SET_LOCATION,
	location
});

export const watchUserInit = () => {
	return {
		type: WATCH_USER_INIT
	};
};

export const watchUserSuccess = data => {
	return {
		type: WATCH_USER_SUCCESS,
		data
	};
};

export const watchUserFailure = () => {
	return {
		type: WATCH_USER_FAILURE
	};
};

export const resetUser = () => {
	return {
		type: RESET_USER
	};
};

// complex functions which dispatch multiple action and can be asynchronous

export const Auth = () => {
	return (dispatch, getState) => {
		return new Promise((resolve, reject) => {
			dispatch(authInit());

			// watch firebase auth for authentication
			firebase.auth().onAuthStateChanged(user => {
				if (user) {
					// check if user document already exists
					firestore
						.collection("users")
						.doc(user.uid)
						.get()
						.then(userDoc => {
							if (userDoc.exists) {
								// user already exists, log them in
								dispatch(authSuccess(user.uid, userDoc.data()));
								resolve();
							} else {
								// user doesn't exist, create an account

								// generate initial preferences
								let newPreferences = {};
								PREFERENCES.forEach(preference => {
									newPreferences[preference] = 0.5;
								});

								const userData = {
									joinedTime: moment().unix(),
									preferences: newPreferences
								};

								firestore
									.collection("users")
									.doc(user.uid)
									.set(userData)
									.then(() => {
										// user created!
										dispatch(authSuccess(user.uid, userData));
										resolve();
									})
									.catch(error => {
										dispatch(authFailure(error));
										reject(error);
									});
							}
						});
				}
			});

			// authenticate anonymously
			firebase
				.auth()
				.signInAnonymously()
				.catch(error => {
					dispatch(authFailure(error));
					reject(error);
				});
		});
	};
};

export const WatchUser = data => {
	return (dispatch, getState) => {
		dispatch(watchUserInit());

		const state = getState();

		if (!state.user.uid) {
			dispatch(watchUserFailure("no authenticated user"));
			return null;
		}

		return firestore
			.collection("users")
			.doc(state.user.uid)
			.onSnapshot(
				doc => {
					dispatch(watchUserSuccess(doc.data()));
				},
				error => {
					dispatch(watchUserFailure(error));
				}
			);
	};
};
