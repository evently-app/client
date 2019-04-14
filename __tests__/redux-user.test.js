import {
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
	RESET_USER
} from "../src/redux/user";
//import * as types from "../../constants/ActionTypes";

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
