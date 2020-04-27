import React from "react";
import {
  Image,
  AsyncStorage,
  StyleSheet,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
} from "react-native";
import {} from "react-native-elements";

import * as firebase from "firebase";

export default class SignUpScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
    };
  }

  SignUp = (email, password) => {
    try {
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then((res) => {
          firebase
            .database()
            .ref("Users")
            .push({
              is_admin: false,
              user_name: email.split("@")[0],
              user_unique_id: res.user.uid,
            });
          console.log(res.user.email);
          //Alert.alert("Sign Up Alert", res.user.email);
          AsyncStorage.setItem("userToken", res.user.email);
          this.props.navigation.navigate("AdminScreen");
        });
    } catch (error) {
      //console.log(error.toString(error));
      Alert.alert("Sign In Alert", error.toString(error));
    }
  };

  static navigationOptions = {
    title: "Sign Up",
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
            placeholder="Email"
            style={styles.loginInput}
            value={this.state.userid}
            onChangeText={(email) => this.setState({ email })}
          />

          <TextInput
            secureTextEntry={true}
            placeholderTextColor="#003f5c"
            placeholder="Password"
            style={styles.loginInput}
            value={this.state.userid}
            onChangeText={(password) => this.setState({ password })}
          />

          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => this.SignUp(this.state.email, this.state.password)}
          >
            <Text style={styles.loginText}>SIGN UP</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={this._signInAsync}
          >
            <Text style={styles.loginText}>SIGN IN</Text>
          </TouchableOpacity>

          <Text>{this.state.message}</Text>
        </ScrollView>
      </View>
    );
  }

  _signInAsync = async () => {
    this.props.navigation.navigate("SignIn");
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  logoImage: {
    width: 300,
    height: 100,
    resizeMode: "contain",
    marginVertical: 50,
  },
  loginInput: {
    marginVertical: 10,
    width: 300,
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "black",
  },
  loginButton: {
    backgroundColor: "black",
    marginVertical: 10,
    width: 300,
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  loginText: {
    fontSize: 16,
    color: "white",
  },
});
