import React, { Component } from "react";
import { StyleSheet, StatusBar, Animated, View } from "react-native";
import { connect } from "react-redux";
import Interactable from "react-native-interactable";
import LinearGradient from "react-native-linear-gradient";
import Haptics from "react-native-haptic-feedback";

import Profile from "./Profile";
import Feed from "./Feed";
import Timeline from "./Timeline";
import TouchableScale from "./universal/TouchableScale";

import ProfileLogo from "../assets/profile.svg";
import FeedLogo from "../assets/logo.svg";
import TimelineLogo from "../assets/timeline.svg";

import { SCREEN_WIDTH, SCREEN_HEIGHT, IS_X } from "../lib/constants";
import { WatchUser, Auth } from "../redux/user";

class App extends Component {
  xOffset = new Animated.Value(-SCREEN_WIDTH);

  componentWillMount() {
    // log in / sign up anonymously
    this.props
      .Auth()
      .then(() => {
        // sync user entity in redux with firestore
        this.watchUser = this.props.WatchUser();
      })
      .catch(error => {
        console.log(error);
      });
  }

  opacityStyle = i => ({
    opacity: this.xOffset.interpolate({
      inputRange: [-2 * SCREEN_WIDTH, -SCREEN_WIDTH, 0],
      outputRange: [i === 2 ? 1 : 0.5, i === 1 ? 1 : 0.5, i === 0 ? 1 : 0.5]
    })
  });

  render() {
    // spring config for navigator
    const spring = { tension: 600, damping: 0.5 };

    // snap points
    const profilePage = { x: 0, ...spring };
    const feedPage = { x: -SCREEN_WIDTH, ...spring };
    const timelinePage = { x: -2 * SCREEN_WIDTH, ...spring };

    const tabIcons = [<ProfileLogo />, <FeedLogo />, <TimelineLogo />];
    const tabGradientColors = ["rgba(21,2,24,0)", "rgba(21,2,24,0.95)", "rgba(21,2,24,1)"];

    return (
      <LinearGradient style={styles.container} locations={[0, 0.9]} colors={["black", "#150218"]}>
        <StatusBar barStyle="light-content" />
        <Interactable.View
          horizontalOnly
          animatedNativeDriver
          dragEnabled={false}
          ref={Interactable => (this.tabNavigator = Interactable)}
          style={styles.scrollContainer}
          snapPoints={[profilePage, feedPage, timelinePage]}
          initialPosition={feedPage}
          animatedValueX={this.xOffset}
        >
          <Profile />
          <Feed />
          <Timeline />
        </Interactable.View>
        <View style={styles.tabBarContainer}>
          <LinearGradient
            style={styles.tabBarGradient}
            locations={[0, 0.8, 1]}
            colors={tabGradientColors}
          />
          {tabIcons.map((Icon, i) => (
            <TouchableScale
              key={i}
              style={styles.tabBarButton}
              animatedStyle={this.opacityStyle(i)}
              onPress={() => {
                Haptics.trigger("impactMedium");
                this.tabNavigator.snapTo({ index: i });
              }}
            >
              {Icon}
            </TouchableScale>
          ))}
        </View>
      </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  scrollContainer: {
    position: "absolute",
    flexDirection: "row",
    width: 3 * SCREEN_WIDTH,
    height: SCREEN_HEIGHT
  },
  tabBarContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 75,
    padding: IS_X ? 25 : 15,
    paddingBottom: IS_X ? 30 : 15,
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end"
  },
  tabBarGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 100
  },
  tabBarButton: {
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center"
  }
});

const mapStateToProps = state => {
  return {
    uid: state.user.uid
  };
};

const mapDispatchToProps = {
  Auth,
  WatchUser
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
