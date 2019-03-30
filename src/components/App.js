import React, { Component } from "react";
import { Auth } from "../redux/user";
import { connect } from "react-redux";
import { StyleSheet, StatusBar, Animated, View } from "react-native";

import LinearGradient from "react-native-linear-gradient";
import Haptics from "react-native-haptic-feedback";

import Profile from "./Profile";
import Feed from "./Feed";
import Timeline from "./Timeline";
import TouchableScale from "./universal/TouchableScale";

import ProfileLogo from "../assets/profile.svg";
import FeedLogo from "../assets/logo.svg";
import TimelineLogo from "../assets/timeline.svg";

import { SCREEN_WIDTH, SCREEN_HEIGHT } from "../lib/constants";
import { WatchUser } from "../redux/user";

const xOffset = new Animated.Value(SCREEN_WIDTH);
const scrollPosition = Animated.event([{ nativeEvent: { contentOffset: { x: xOffset } } }], {
  useNativeDriver: true
});

const opacityStyle = index => {
  const inputRange = [0, SCREEN_WIDTH, 2 * SCREEN_WIDTH];
  switch (index) {
    case 0:
      return {
        opacity: xOffset.interpolate({
          inputRange,
          outputRange: [1, 0.5, 0.5]
        })
      };
    case 1:
      return {
        opacity: xOffset.interpolate({
          inputRange,
          outputRange: [0.5, 1, 0.5]
        })
      };
    case 2:
      return {
        opacity: xOffset.interpolate({
          inputRange,
          outputRange: [0.5, 0.5, 1]
        })
      };
  }
};

class App extends Component {
  state = {
    currentPage: 1
  };

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

  componentDidMount() {
    xOffset.setValue(SCREEN_WIDTH);
    setTimeout(
      () =>
        this.ScrollView.getNode().scrollTo({
          x: SCREEN_WIDTH,
          y: 0,
          animated: false
        }),
      1
    );
  }

  /* navigation functions */
  seeProfile = () => {
    Haptics.trigger("impactMedium");
    this.ScrollView.getNode().scrollTo({ x: 0, y: 0, animated: true });
  };

  seeFeed = () => {
    Haptics.trigger("impactMedium");
    this.ScrollView.getNode().scrollTo({
      x: SCREEN_WIDTH,
      y: 0,
      animated: true
    });
  };

  seeTimeline = () => {
    Haptics.trigger("impactMedium");
    this.ScrollView.getNode().scrollTo({
      x: 2 * SCREEN_WIDTH,
      y: 0,
      animated: true
    });
  };

  handleScrollEnd = ({ nativeEvent }) => {
    const { x } = nativeEvent.contentOffset;
    if (x === 0) this.setState({ currentPage: 0 });
    else if (x === SCREEN_WIDTH) this.setState({ currentPage: 1 });
    else this.setState({ currentPage: 2 });
  };

  render() {
    const { currentPage } = this.state;
    // console.log(this.props);

    return (
      <LinearGradient style={styles.container} locations={[0, 0.9]} colors={["black", "#150218"]}>
        <StatusBar barStyle="light-content" />
        <Animated.ScrollView
          horizontal
          pagingEnabled
          bounces={false}
          ref={ScrollView => (this.ScrollView = ScrollView)}
          // scrollEnabled={currentPage !== 1}
          scrollEnabled={false}
          onMomentumScrollEnd={this.handleScrollEnd}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={scrollPosition}
        >
          <Profile />
          <Feed />
          <Timeline />
        </Animated.ScrollView>
        <View style={styles.tabBarContainer}>
          <LinearGradient
            style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 100 }}
            locations={[0, 0.8, 1]}
            colors={["rgba(21,2,24,0)", "rgba(21,2,24,0.95)", "rgba(21,2,24,1)"]}
          />
          <TouchableScale
            style={styles.tabBarButton}
            animatedStyle={opacityStyle(0)}
            onPress={this.seeProfile}
          >
            <ProfileLogo />
          </TouchableScale>
          <TouchableScale
            style={styles.tabBarButton}
            animatedStyle={opacityStyle(1)}
            onPress={this.seeFeed}
          >
            <FeedLogo />
          </TouchableScale>
          <TouchableScale
            style={styles.tabBarButton}
            animatedStyle={opacityStyle(2)}
            onPress={this.seeTimeline}
          >
            <TimelineLogo />
          </TouchableScale>
        </View>
      </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  tabBarContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    padding: 25,
    paddingBottom: 30,
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
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
