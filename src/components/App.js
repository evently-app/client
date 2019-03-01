import React, { Component } from "react";
import { Auth } from "../redux/user";
import { connect } from "react-redux";
import { StyleSheet, Animated, Text, View, Alert } from "react-native";

import Profile from "./Profile";
import Feed from "./Feed";
import Timeline from "./Timeline";

class App extends Component {
  xOffset = new Animated.Value(0);

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

  scrollPosition = Animated.event([{ nativeEvent: { contentOffset: { x: this.xOffset } } }], {
    useNativeDriver: true
  });

  render() {
    return (
      <Animated.ScrollView
        horizontal
        pagingEnabled
        // ref={hoScrollRef}
        // scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={this.scrollPosition}
        style={styles.horizontalScroll}
      >
        <Profile />
        <Feed />
        <Timeline />
      </Animated.ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
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
