import React from "react";
import {
  Image,
  AsyncStorage,
  StyleSheet,
  View,
  ScrollView
} from "react-native";
import { Input, Button } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";

export default class SignInScreen extends React.Component {
  static navigationOptions = {
    title: "Please Sign In"
  };

  render() {
    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
        >
          <Image
            source={require("../assets/images/logo.png")}
            style={styles.logoImage}
          />

          <Input
            placeholder="Please enter ID"
            leftIcon={
              <Icon name="user" size={18} color="gray" style={styles.icon} />
            }
            inputContainerStyle={styles.loginInput}
          />
          <Button
            title="Login"
            style={styles.loginButton}
            onPress={this._signInAsync}
          />
        </ScrollView>
      </View>
    );
  }

  _signInAsync = async () => {
    await AsyncStorage.setItem("userToken", "abc");
    this.props.navigation.navigate("App");
  };
}

const styles = StyleSheet.create({
  icon: {
    paddingRight: 10
  },
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  contentContainer: {
    alignItems: "center",
    paddingTop: 30
  },
  logoImage: {
    width: 100,
    height: 100,
    resizeMode: "contain",
    paddingVertical: 100
  },
  loginInput: {
    alignSelf: "stretch",
    borderColor: "gray",
    borderWidth: 1
  },
  loginButton: {
    padding: 20
  }
});
