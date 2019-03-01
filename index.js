import { Provider } from "react-redux";
import { Navigation } from "react-native-navigation";
import { persistStore } from "redux-persist";

import configureStore from "./src/redux/store";
import registerScreens from "./src/screens";

// handle redux store initialization, navigation, authenticate w/ firebase

const store = configureStore();

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
