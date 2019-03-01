import React, { Component } from "react";
import { Auth } from "../redux/user";
import { connect } from "react-redux";
import {
  Platform,
  Dimensions,
  StyleSheet,
  Text,
  View,
  Alert
} from "react-native";

class App extends Component {
  componentWillMount() {
    // log in / sign up anonymously
    this.props
      .Auth()
      .then(() => {
        Alert.alert("successfully authenticated");
      })
      .catch(error => {
        console.log(error);
      });
  }

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

const mapDispatchToProps = {
  Auth
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
