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
import { CheckBox } from "react-native-elements";

import * as firebase from "firebase";

var userInfo;

firebase
  .database()
  .ref("Users")
  .once("value")
  .then(function (snapshot) {
    userInfo = snapshot.val();
  });

export default class UserScreen extends React.Component {
  static navigationOptions = {
    title: "User",
  };

  constructor(props) {
    super(props);

    const { navigation } = this.props;
    const userName = JSON.stringify(navigation.getParam("user", null));

    this.state = {
      userName: userName,
    };
  }

  componentDidMount() {
    for (var key in userInfo) {
      if (JSON.stringify(userInfo[key].user_name) == this.state.userName) {
        var is_admin = userInfo[key].is_admin ? true : false;
        this.setState({
          user_key: key,
          user_name: userInfo[key].user_name,
          is_admin: is_admin,
        });
        break; // If you want to break out of the loop once you've found a match
      }
    }
  }

  Save(user_name, is_admin) {
    var ref = "Users/" + this.state.user_key + "/";
    var user = firebase.database().ref(ref);
    user.update({ user_name: user_name, is_admin: Boolean(is_admin) });
  }

  render() {
    const { navigation } = this.props;
    return (
      <View style={styles.container}>
        <ScrollView>
          <Text>User Key</Text>
          <TextInput
            style={styles.loginInput}
            placeholder={this.state.user_key}
            maxLength={20}
            editable={false}
          />
          <Text>User Name</Text>
          <TextInput
            style={styles.loginInput}
            placeholder={this.state.user_name}
            maxLength={50}
            onChangeText={(user_name) => this.setState({ user_name })}
          />

          <CheckBox
            checked={this.state.is_admin}
            onPress={() => this.setState({ is_admin: !this.state.is_admin })}
            title="Is Admin"
          />
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => this.Save(this.state.user_name, this.state.is_admin)}
          >
            <Text style={styles.loginText}>SAVE</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  _signUpAsync = async () => {
    this.props.navigation.navigate("SignUp");
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 50,
  },
  contentContainer: {
    flex: 1,
    marginLeft: 16,
    marginRight: 16,
    alignSelf: "stretch",
    marginBottom: 10,
  },
  inputContainer: {
    paddingTop: 15,
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
