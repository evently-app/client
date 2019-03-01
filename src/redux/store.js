import { createStore, applyMiddleware, compose } from "redux";
import { persistCombineReducers, persistStore } from "redux-persist";
import storage from "redux-persist/es/storage";
import reducers from "./index";
import thunkMiddleware from "redux-thunk";
import { createLogger } from "redux-logger";

const config = {
    key: "root",
    storage
};

const persistReducers = persistCombineReducers(config, reducers);

const loggerMiddleware = createLogger({
    predicate: (getState, action) => __DEV__
});

export default function configureStore() {
    const middleware = [loggerMiddleware, thunkMiddleware];

    let store = compose(applyMiddleware(...middleware))(createStore)(
        persistReducers
    );

    let persistor = persistStore(store);

    return { store, persistor };
}
