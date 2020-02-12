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
import NfcManager, { NfcTech } from "react-native-nfc-manager";

export default class SignInScreen extends React.Component {
  componentDidMount() {
    NfcManager.start();
    NfcManager.setEventListener(NfcEvents.DiscoverTag, tag => {
      console.warn("tag", tag);
      NfcManager.setAlertMessageIOS("I got your tag!");
      NfcManager.unregisterTagEvent().catch(() => 0);
    });
  }

  static navigationOptions = {
    title: "Login"
  };

  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
          <Image
            source={require("../assets/images/app-logo.png")}
            style={styles.logoImage}
          />

          <TextInput
            placeholderTextColor="#003f5c"
            placeholder="Patient ID"
            style={styles.loginInput}
          />

          <TouchableOpacity
            style={styles.loginButton}
            onPress={this._signInAsync}
          >
            <Text style={styles.loginText}>LOGIN</Text>
          </TouchableOpacity>
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
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  logoImage: {
    width: 300,
    height: 100,
    resizeMode: "contain",
    marginVertical: 50
  },
  loginInput: {
    marginVertical: 10,
    width: 300,
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "black"
  },
  loginButton: {
    backgroundColor: "black",
    marginVertical: 10,
    width: 300,
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 25
  },
  loginText: {
    fontSize: 16,
    color: "white"
  }
});
