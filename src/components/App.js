import React, { Component } from "react";
import { Auth } from "../redux/user";
import { connect } from "react-redux";
import { StyleSheet, Animated, Text, View, Alert } from "react-native";

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
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5
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
