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

var users;
var pillClasses;

firebase
  .database()
  .ref("Users")
  .once("value")
  .then(function (snapshot) {
    users = snapshot.val();
  });

firebase
  .database()
  .ref("Classes")
  .once("value")
  .then(function (snapshot) {
    pillClasses = snapshot.val();
  });

export default class NewPeriodScreen extends React.Component {
  static navigationOptions = {
    title: "New Pill Period",
  };

  constructor(props) {
    super(props);

    const { navigation } = this.props;

    this.state = {};
  }

  componentDidMount() {}

  Set(user_name, class_name, amount, frequency) {
    var ifExistsClassName, ifExistUsername;

    for (var key in users) {
      if (users[key].user_name == user_name) {
        ifExistUsername = true;
        break;
      }
    }
    for (var key in pillClasses) {
      if (pillClasses[key].class_name == class_name) {
        ifExistsClassName = true;
        break;
      }
    }

    this.setState({
      ifExistUsername: ifExistUsername,
      ifExistsClassName: ifExistsClassName,
      complete: true,
    });

    if (ifExistUsername && ifExistsClassName) {
      var ref = "Periods/";
      var set = firebase.database().ref(ref).push();
      set.set({
        class_name: class_name,
        user_name: user_name,
        sample_amount: parseInt(amount),
        frequency: parseInt(frequency),
      });
      var ref = "StatusParameters/";
      var parameters = firebase.database().ref(ref);
      parameters.update({
        DatabaseUpdated: true,
      });
    }
  }

  render() {
    const { navigation } = this.props;
    let userNameNotCorrect, pillClassNotCorrect;

    if (!this.state.ifExistUsername && this.state.complete) {
      userNameNotCorrect = <Text> There is no such user</Text>;
    }
    if (!this.state.ifExistsClassName && this.state.complete) {
      pillClassNotCorrect = <Text> There is no such pill class</Text>;
    }

    return (
      <View style={styles.container}>
        <ScrollView>
          <Text>Patient User Name</Text>
          <TextInput
            style={styles.loginInput}
            onChangeText={(user_name) => this.setState({ user_name })}
            maxLength={50}
          />

          <Text>Pill Class Name</Text>
          <TextInput
            style={styles.loginInput}
            maxLength={50}
            onChangeText={(class_name) => this.setState({ class_name })}
          />

          <Text>Pill Amount</Text>
          <TextInput
            style={styles.loginInput}
            maxLength={50}
            onChangeText={(amount) => this.setState({ amount })}
          />

          <Text>Frequency(in hours)</Text>
          <TextInput
            style={styles.loginInput}
            maxLength={50}
            onChangeText={(frequency) => this.setState({ frequency })}
          />

          <TouchableOpacity
            style={styles.loginButton}
            onPress={() =>
              this.Set(
                this.state.user_name,
                this.state.class_name,
                this.state.amount,
                this.state.frequency
              )
            }
          >
            <Text style={styles.loginText}>ADD NEW PERIOD</Text>
          </TouchableOpacity>
          {userNameNotCorrect}
          {pillClassNotCorrect}
        </ScrollView>
      </View>
    );
  }
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
