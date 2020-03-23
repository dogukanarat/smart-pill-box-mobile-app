import React from "react";
import {
  Image,
  AsyncStorage,
  StyleSheet,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Text
} from "react-native";
import {} from "react-native-elements";

import * as firebase from "firebase";

export default class SignUpOperation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  static navigationOptions = {
    title: "Sign Up Operation"
  };

  render() {
    return <View></View>;
  }

  _signInAsync = async () => {
    AsyncStorage.setItem("userToken", this.state.userid);
    this.props.navigation.navigate("AdminScreen");
  };

  _signUpAsync = async () => {
    AsyncStorage.setItem("userToken", this.state.userid);
    this.props.navigation.navigate("SignUp");
  };
}
