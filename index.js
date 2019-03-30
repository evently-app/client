import { AppRegistry } from "react-native";

import App from "./src";
import { name as appName } from "./app.json";

import MapboxGL from "@mapbox/react-native-mapbox-gl";
import env from "./env.json";

MapboxGL.setAccessToken(env["mapbox"]);

AppRegistry.registerComponent(appName, () => App);
