import React, { Component } from "react";
import { Auth } from "../redux/user";
import { connect } from "react-redux";
import { StyleSheet, Animated, Text, TouchableOpacity, View, Alert } from "react-native";

import Profile from "./Profile";
import Feed from "./Feed";
import Timeline from "./Timeline";

import { SCREEN_WIDTH, SCREEN_HEIGHT } from "../lib/constants";

const xOffset = new Animated.Value(SCREEN_WIDTH);
const scrollPosition = Animated.event([{ nativeEvent: { contentOffset: { x: xOffset } } }], {
  useNativeDriver: true
});

class App extends Component {
  componentWillMount() {
    // log in / sign up anonymously
    this.props
      .Auth()
      .then(() => {
        // Alert.alert("successfully authenticated");
      })
      .catch(error => {
        console.log(error);
      });
  }

  componentDidMount() {
    xOffset.setValue(SCREEN_WIDTH);
    this.ScrollView.getNode().scrollTo({ x: SCREEN_WIDTH, y: 0, animated: false });
  }

  seeProfile = () => {
    this.ScrollView.getNode().scrollTo({ x: 0, y: 0, animated: true });
  };

  seeFeed = () => {
    this.ScrollView.getNode().scrollTo({ x: SCREEN_WIDTH, y: 0, animated: true });
  };

  seeTimeline = () => {
    this.ScrollView.getNode().scrollTo({ x: 2 * SCREEN_WIDTH, y: 0, animated: true });
  };

  render() {
    return (
      <View style={styles.container}>
        <Animated.ScrollView
          horizontal
          pagingEnabled
          ref={ScrollView => (this.ScrollView = ScrollView)}
          // scrollEnabled={false}
          // centerContent={true}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={scrollPosition}
          // style={{ width: SCREEN_WIDTH, marginLeft: -SCREEN_WIDTH }}
        >
          <Profile />
          <Feed />
          <Timeline />
        </Animated.ScrollView>
        <View style={styles.tabBarContainer}>
          <TouchableOpacity style={styles.tabBarButton} onPress={this.seeProfile}>
            <Text>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabBarButton} onPress={this.seeFeed}>
            <Text>Feed</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabBarButton} onPress={this.seeTimeline}>
            <Text>Timeline</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  tabBarContainer: {
    position: "absolute",
    bottom: 5,
    left: 0,
    right: 0,
    height: 100,
    padding: 10,
    backgroundColor: "transparent",
    flexDirection: "row"
  },
  tabBarButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
    backgroundColor: "rgba(120,120,0,0.9)"
  }
});

const mapStateToProps = state => {
  return {
    uid: state.user.uid
  };
};

const mapDispatchToProps = {
  Auth
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
