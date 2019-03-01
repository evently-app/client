import { Navigation } from "react-native-navigation";

import App from "./components/App";

export default (Provider, store) => {
	/* register components */
	Navigation.registerComponentWithRedux(
		"evently.App",
		() => App,
		Provider,
		store
	);
};
