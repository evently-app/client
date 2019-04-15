import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import {
	initialState,
	resetUser,
	authInit,
	authSuccess,
	authFailure,
	setLocation,
	watchUserInit,
	watchUserSuccess,
	watchUserFailure,
	AUTH_INIT,
	AUTH_SUCCESS,
	AUTH_FAILURE,
	SET_LOCATION,
	WATCH_USER_INIT,
	WATCH_USER_SUCCESS,
	WATCH_USER_FAILURE,
	RESET_USER,
	Auth
} from "../../src/redux/user";

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

jest.mock("moment", () => {
	unix: () => {
		return 1555289366;
	};
});

describe("actions", () => {
	it("Test reset user", () => {
		const expectedAction = {
			type: RESET_USER
		};
		expect(resetUser()).toEqual(expectedAction);
	});
	it("Test auth_init ", () => {
		const expectedAction = {
			type: AUTH_INIT
		};
		expect(authInit()).toEqual(expectedAction);
	});
	it("Test auth_success ", () => {
		const expectedAction = {
			type: AUTH_SUCCESS
			// data,
			// userId
		};
		expect(authSuccess()).toEqual(expectedAction);
	});
	it("Test auth_failure ", () => {
		const error = "error message";
		const expectedAction = {
			type: AUTH_FAILURE
			//error
		};
		expect(authFailure()).toEqual(expectedAction);
	});
	it("Test set location ", () => {
		const location = "location!";
		const expectedAction = {
			type: SET_LOCATION
			//location
		};
		expect(setLocation()).toEqual(expectedAction);
	});
	it("Test watch user init ", () => {
		const expectedAction = {
			type: WATCH_USER_INIT
		};
		expect(watchUserInit()).toEqual(expectedAction);
	});
	it("Test watch user success  ", () => {
		const data = "data";
		const expectedAction = {
			type: WATCH_USER_SUCCESS
			//data
		};
		expect(watchUserSuccess()).toEqual(expectedAction);
	});
	it("Test watch user failure  ", () => {
		const error = "data";
		const expectedAction = {
			type: WATCH_USER_FAILURE
			//error
		};
		expect(watchUserFailure()).toEqual(expectedAction);
	});
});

it("Auth", () => {
	const expectedActions = [
		{
			type: AUTH_INIT
		},
		{
			type: AUTH_SUCCESS,
			userId: "testUserId",
			data: {
				joinedTime: 1555289366
			}
		}
	];

	const store = mockStore(initialState);
	store.dispatch(Auth()).then(() => {
		expect(store.getActions()).toEqual(expectedActions);
	});
});
