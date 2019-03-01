import { createStore, applyMiddleware, compose } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/es/storage";
import reducers from "./index";
import thunkMiddleware from "redux-thunk";
import { createLogger } from "redux-logger";

export default function configureStore() {
	const config = {
		key: "root",
		storage
	};

	const persistedReducer = persistReducer(config, reducers);

	const loggerMiddleware = createLogger({
		predicate: (getState, action) => __DEV__
	});

	const middleware = [loggerMiddleware, thunkMiddleware];

	let store = compose(applyMiddleware(...middleware))(createStore)(
		persistedReducer
	);

	return store;
}
