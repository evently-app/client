import MapboxGL from "@mapbox/react-native-mapbox-gl";

import env from "../../env.json";

MapboxGL.setAccessToken(config.get("accessToken"));
