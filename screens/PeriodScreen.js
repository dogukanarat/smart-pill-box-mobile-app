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

var periods;

firebase
  .database()
  .ref("Periods")
  .once("value")
  .then(function (snapshot) {
    periods = snapshot.val();
  });

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

export default class PeriodScreen extends React.Component {
  static navigationOptions = {
    title: "Period",
  };

  constructor(props) {
    super(props);

    const { navigation } = this.props;
    const periodKey = JSON.stringify(navigation.getParam("period", null));

    this.state = {
      periodKey: periodKey,
    };
  }

  componentDidMount() {
    for (var key in periods) {
      if (JSON.stringify(key) == this.state.periodKey) {
        this.setState({
          class_name: periods[key].class_name,
          user_name: periods[key].user_name,
          sample_amount: periods[key].sample_amount,
          frequency: periods[key].frequency,
        });
        break; // If you want to break out of the loop once you've found a match
      }
    }
  }

  Del() {
    var ref = "Periods/" + JSON.parse(this.state.periodKey) + "/";
    var period = firebase.database().ref(ref);
    period.remove();
  }

  Save(user_name, class_name, sample_amount, frequency) {
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
      var ref = "Periods/" + JSON.parse(this.state.periodKey) + "/";
      var period = firebase.database().ref(ref);
      console.log(class_name, user_name, sample_amount, frequency);
      period.update({
        class_name: class_name,
        user_name: user_name,
        sample_amount: parseInt(sample_amount),
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
            placeholder={this.state.user_name}
          />

          <Text>Pill Class Name</Text>
          <TextInput
            style={styles.loginInput}
            maxLength={50}
            onChangeText={(class_name) => this.setState({ class_name })}
            placeholder={this.state.class_name}
          />

          <Text>Pill Amount</Text>
          <TextInput
            style={styles.loginInput}
            maxLength={50}
            onChangeText={(sample_amount) => this.setState({ sample_amount })}
            placeholder={String(this.state.sample_amount)}
          />

          <Text>Frequency(in hours)</Text>
          <TextInput
            style={styles.loginInput}
            maxLength={50}
            onChangeText={(frequency) => this.setState({ frequency })}
            placeholder={String(this.state.frequency)}
          />

          <TouchableOpacity
            style={styles.loginButton}
            onPress={() =>
              this.Save(
                this.state.user_name,
                this.state.class_name,
                this.state.sample_amount,
                this.state.frequency
              )
            }
          >
            <Text style={styles.loginText}>SAVE</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => this.Del()}
          >
            <Text style={styles.loginText}>REMOVE</Text>
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
