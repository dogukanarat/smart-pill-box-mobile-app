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

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBCzObI1ul0sB61TIi_XA83vpmsi30DGJQ",
  authDomain: "pill-classification.firebaseapp.com",
  databaseURL: "https://pill-classification.firebaseio.com",
  storageBucket: "pill-classification.appspot.com",
};

firebase.initializeApp(firebaseConfig);

export default class SignInScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      message: "No Message",
    };
  }

  LogIn = (email, password) => {
    try {
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then((res) => {
          AsyncStorage.setItem("userToken", res.user.uid);
          firebase
            .database()
            .ref("Users")
            .orderByKey()
            .once("value")
            .then((snapshot) => {
              snapshot.forEach(function (childSnapshot) {
                var is_admin = childSnapshot.val().is_admin;
                var user_unique_id = childSnapshot.val().user_unique_id;

                if (res.user.uid == user_unique_id) {
                  AsyncStorage.setItem("userTokenIsAdmin", is_admin);
                }
              });
            });
          this.props.navigation.navigate("Main");
        });
    } catch (error) {
      console.log(error.toString(error));
      //Alert.alert("Sign In Alert", error.toString(error));
    }
  };

  static navigationOptions = {
    title: "Sign In",
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
            onPress={() => this.LogIn(this.state.email, this.state.password)}
          >
            <Text style={styles.loginText}>SIGN IN</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={this._signUpAsync}
          >
            <Text style={styles.loginText}>SIGN UP</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  _signUpAsync = async () => {
    this.props.navigation.navigate("Register");
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
