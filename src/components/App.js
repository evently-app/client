import React, { Component } from "react";
import { connect } from "react-redux";
import { Platform, Dimensions, StyleSheet, Text, View } from "react-native";

class App extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Evently app</Text>
        <Text style={styles.instructions}>
          Current user id: {this.props.uid}
        </Text>
      </View>
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

// const mapDispatchToProps = { }

export default connect(mapStateToProps)(App);
