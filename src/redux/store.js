import { createStore, applyMiddleware, compose } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/es/storage";
import reducers from "./index";
import thunkMiddleware from "redux-thunk";
// import { createLogger } from "redux-logger";

/* DEV */
import { composeWithDevTools } from "redux-devtools-extension";

export default function configureStore() {
	const config = {
		key: "root",
		blacklist: ["filter", "queue"],
		storage
	};

	const persistedReducer = persistReducer(config, reducers);

	// const loggerMiddleware = createLogger({
	// 	predicate: (getState, action) => __DEV__
	// });

	const middleware = [thunkMiddleware];

	let store = compose(composeWithDevTools(applyMiddleware(...middleware)))(createStore)(
		persistedReducer
	);

	let persistor = persistStore(store);

	return { store, persistor };
}
