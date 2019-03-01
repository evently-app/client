import { resetQueue } from "./queue";
import firebase from "react-native-firebase";
import moment from "moment";
let firestore = firebase.firestore();

// redux pattern: https://github.com/erikras/ducks-modular-redux

// define starting state
const initialState = {
	uid: null,
	entity: null,
	isAuthenticating: false,
	successAuthenticating: false,
	errorAuthenticating: null,
	isUpdatingUser: false,
	successUpdatingUser: false,
	errorUpdatingUser: null
};

// define actions against state
const LOG_IN = "evently/user/LOG_IN";
const RESET_USER = "evently/user/RESET_USER";
const AUTH_INIT = "evently/user/AUTH_INIT";
const AUTH_SUCCESS = "evently/user/AUTH_SUCCESS";
const AUTH_FAILURE = "evently/user/AUTH_FAILURE";
const UPDATE_USER_INIT = "evently/user/UPDATE_USER_INIT";
const UPDATE_USER_SUCCESS = "evently/user/UPDATE_USER_SUCCESS";
const UPDATE_USER_FAILURE = "evently/user/UPDATE_USER_FAILURE";

/* 
function that takes initial state and an action and returns next state
must be deterministic 
*/
export default (state = initialState, action) => {
	switch (action.type) {
		case LOG_IN:
			return {
				...state,
				entity: action.data,
				uid: action.userId
			};

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
				uid: action.userId,
				successAuthenticating: true
			};

		case AUTH_FAILURE:
			return {
				...state,
				isAuthenticating: false,
				errorAuthenticating: action.error
			};

		case UPDATE_USER_INIT:
			return {
				...state,
				isUpdatingUser: true
			};

		case UPDATE_USER_SUCCESS:
			return {
				...state,
				isUpdatingUser: false,
				entity: {
					...state.user.entity,
					...action.data
				}
			};

		case UPDATE_USER_FAILURE:
			return {
				...state,
				isUpdatingUser: false,
				errorUpdatingUser: action.error
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

export const updateUserInit = () => {
	return {
		type: UPDATE_USER_INIT
	};
};

export const updateUserSuccess = data => {
	return {
		type: UPDATE_USER_SUCCESS,
		data
	};
};

export const updateUserFailure = error => {
	return {
		type: UPDATE_USER_FAILURE,
		error
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

								const userData = {
									joinedTime: moment().unix()
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

export const UpdateUser = data => {
	return (dispatch, getState) => {
		return new Promise((resolve, reject) => {
			dispatch(updateUserInit());

			const state = getState();

			if (!state.user.uid) {
				dispatch(updateUserFailure("no authenticated user"));
				reject("no authenticated user");
			}

			firestore
				.collection("users")
				.doc(state.user.uid)
				.set(data, { merge: true })
				.then(() => {
					dispatch(updateUserSuccess(data));
					resolve();
				})
				.catch(error => {
					dispatch(updateUserFailure(error));
					reject(error);
				});
		});
	};
};
