import { Navigation } from "react-native-navigation";

import App from "./components/App";

export default (Provider, store) => {
	/* register components */
	// Navigation.registerComponent("evently.App", () => App, Provider, store);
	Navigation.registerComponent("evently.App", () => App);
};
