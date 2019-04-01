// exports combined reducer

import { combineReducers } from "redux";

import user from "./user";
import filter from "./filter";
import queue from "./queue";
import timeline from "./timeline";

export default combineReducers({
	user,
	filter,
	queue,
	timeline
});
