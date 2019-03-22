import axios from "axios";

// redux pattern: https://github.com/erikras/ducks-modular-redux

// define starting state
const initialState = {
	isLoadingQueue: false,
	successLoadingQueue: false,
	errorLoadingQueue: null,
};

var coordinates = null

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
			console.log("action data", action.data)
			return {
				...state,
				isLoadingQueue: false,
				queue: action.data.data,
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
			const newQueue = state.queue;
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


// complex functions which dispatch multiple action and can be asynchronous

export const LoadQueue = () => {
	return (dispatch, getState) => {
		return new Promise((resolve, reject) => {
			dispatch(loadQueueInit());

			const state = getState();
			const postData = {
				uid: state.user.uid
			};

			//get user location and grab events 
			navigator.geolocation.getCurrentPosition(
			  (position) => {
		      	coordinates = (String(position.coords.latitude) + "/" + String(position.coords.longitude))
		      	console.log(coordinates)
			  	const request = "http://event-queue-service.herokuapp.com/grab_events/" + coordinates + "/1000km"
			  	console.log(request)

			  	axios
				.get(request)
				.then(response => {
					dispatch(loadQueueSuccess(response.data));
					resolve();
				})
				.catch(error => {
					dispatch(loadQueueFailure(error));
					reject(error);
				});
			  },
			  (error) => {result =  error},
			  { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
			);
			
		});
	};
};
