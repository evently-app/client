import { resetUser } from "../src/redux/user";
import { RESET_USER } from "../src/redux/user";
//import * as types from "../../constants/ActionTypes";

describe("actions", () => {
	it("should do something?", () => {
		const initialState = [];
		const expectedAction = {
			type: "evently/user/RESET_USER"
		};
		expect(resetUser()).toEqual(expectedAction);
	});
});
