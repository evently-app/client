import { resetQueue } from "./queue";
import firebase from "react-native-firebase";
let firestore = firebase.firestore();

// redux pattern: https://github.com/erikras/ducks-modular-redux

// define starting state
const initialState = {
	uid: null,
	entity: null,
	isCreatingUser: false,
	successCreatingUser: false,
	errorCreatingUser: null,
	isUpdatingUser: false,
	successUpdatingUser: false,
	errorUpdatingUser: null
};

// define actions against state
const LOG_IN = "evently/user/LOG_IN";
const RESET_USER = "evently/user/RESET_USER";
const CREATE_USER_INIT = "evently/user/CREATE_USER_INIT";
const CREATE_USER_SUCCESS = "evently/user/CREATE_USER_SUCCESS";
const CREATE_USER_FAILURE = "evently/user/CREATE_USER_FAILURE";
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

		case CREATE_USER_INIT:
			return {
				...state,
				isCreatingUser: true
			};

		case CREATE_USER_SUCCESS:
			return {
				...state,
				isCreatingUser: false,
				entity: action.data,
				uid: action.userId,
				successCreatingUser: true
			};

		case CREATE_USER_FAILURE:
			return {
				...state,
				isCreatingUser: false,
				errorCreatingUser: action.error
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

export const createUserInit = () => {
	return {
		type: CREATE_USER_INIT
	};
};

export const createUserSuccess = (userId, data) => {
	return {
		type: CREATE_USER_SUCCESS,
		data,
		userId
	};
};

export const createUserFailure = error => {
	return {
		type: CREATE_USER_FAILURE,
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

export const logIn = (userId, data) => {
	return {
		type: LOG_IN,
		userId,
		data
	};
};

export const resetUser = () => {
	return {
		type: RESET_USER
	};
};

// complex functions which dispatch multiple action and can be asynchronous

export const CreateUser = data => {
	return (dispatch, getState) => {
		return new Promise((resolve, reject) => {
			dispatch(createUserInit());

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
								dispatch(logIn(user.uid, userDoc.data()));
								resolve();
							} else {
								// user doesn't exist, create an account
								firestore
									.collection("users")
									.doc(user.uid)
									.set(userData)
									.then(() => {
										// user created!
										dispatch(createUserSuccess(user.uid, userData));
										resolve();
									})
									.catch(error => {
										dispatch(createUserFailure(error));
										reject(error);
									});
							}
						});
				} else {
					// user logged out
					// dispatch logout action
					// uneccessary with anonymous authentication
				}
			});

			// authenticate anonymously
			firebase
				.auth()
				.signInAnonymously()
				.catch(error => {
					dispatch(createUserFailure(error));
					reject(error);
				});
		});
	};
};

/*
log in function, to be used if we want to do phone or email auth instead of anonymous

export const LogIn = (email, password) => {
	return (dispatch, getState) => {
		return new Promise((resolve, reject) => {
			// firebase auth

			firebase
				.auth()
				.signInWithEmailAndPassword(email, password)
				.then(data => {
					const uid = data.uid;
					firestore
						.collection("users")
						.doc(uid)
						.get()
						.then(userDoc => {
							dispatch(logIn(uid, userDoc.data()));
							resolve();
						})
						.catch(error => {
							reject(error);
						});
				})
				.catch(error => {
					reject(error);
				});
		});
	};
};
*/
