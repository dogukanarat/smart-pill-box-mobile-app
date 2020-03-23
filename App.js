import React from "react";
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet,
  View
} from "react-native";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import OneSignal from "react-native-onesignal";

import SignInScreen from "./screens/SignInScreen";
import SignUpScreen from "./screens/SignUpScreen";
import AdminScreen from "./screens/AdminScreen";
import SignInOperation from "./screens/SignInOperation";
import SignUpOperation from "./screens/SignUpOperation";

console.disableYellowBox = true;

class AuthLoadingScreen extends React.Component {
  constructor() {
    super();
    this._bootstrapAsync();
    OneSignal.init("1c547fbb-907b-4429-9d2f-20184356b974", {
      kOSSettingsKeyAutoPrompt: true
    }); // set kOSSettingsKeyAutoPrompt to false prompting manually on iOS

    OneSignal.addEventListener("received", this.onReceived);
    OneSignal.addEventListener("opened", this.onOpened);
    OneSignal.addEventListener("ids", this.onIds);
  }

  componentWillUnmount() {
    OneSignal.removeEventListener("received", this.onReceived);
    OneSignal.removeEventListener("opened", this.onOpened);
    OneSignal.removeEventListener("ids", this.onIds);
  }

  onReceived(notification) {
    console.log("Notification received: ", notification);
  }

  onOpened(openResult) {
    console.log("Message: ", openResult.notification.payload.body);
    console.log("Data: ", openResult.notification.payload.additionalData);
    console.log("isActive: ", openResult.notification.isAppInFocus);
    console.log("openResult: ", openResult);
  }

  onIds(device) {
    console.log("Device info: ", device);
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    const userToken = await AsyncStorage.getItem("userToken");

    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    this.props.navigation.navigate(userToken ? "AdminScreen" : "SignIn");
  };

  // Render any loading content that you like here
  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

const AppAdmin = createStackNavigator({
  AppAdmin: AdminScreen
});
const AppSignIn = createStackNavigator({
  SignIn: SignInScreen
});
const AppSignUp = createStackNavigator({
  SignIn: SignUpScreen
});
const OperationSignUp = createStackNavigator({
  SignIn: SignUpOperation
});
const OperationSignIn = createStackNavigator({
  SignIn: SignInOperation
});

export default createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: AuthLoadingScreen,
      AdminScreen: AppAdmin,
      SignIn: AppSignIn,
      SignUp: AppSignUp,
      SignUpOperation: OperationSignUp,
      SignInOperation: OperationSignIn
    },
    {
      initialRouteName: "AuthLoading"
    }
  )
);

const styles = StyleSheet.create({
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
    resizeMode: "contain"
  },
  loginInput: {
    width: 20
  },
  loginButton: {
    paddingTop: 20
  }
});
