/**
 * @format
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

// import { AppRegistry } from "react-native";
// import App from "./src";
// import { name as appName } from "./app.json";

// AppRegistry.registerComponent(appName, () => App);

import { Provider } from "react-redux";
import { Navigation } from "react-native-navigation";
import { persistStore } from "redux-persist";

import store from "./src/redux/store";
import registerScreens from "./src/screens";

// import App from "./components/App";

// handle code push, redux store initialization, navigation, authenticate w/ firebase

persistStore(store, null, () => {
	registerScreens(Provider, store);

	Navigation.events().registerAppLaunchedListener(() => {
		Navigation.setRoot({
			root: {
				component: {
					name: "evently.App"
				}
			}
		});
	});
});
