import React from "react";
import {
  AsyncStorage,
  StyleSheet,
  View,
  SectionList,
  SafeAreaView,
  Text,
  Image,
  Alert,
  TouchableOpacity,
  FlatList,
  ScrollView,
  TextInput,
} from "react-native";
import {
  Badge,
  Input,
  Button,
  Card,
  ListItem,
  Icon,
  ButtonGroup,
} from "react-native-elements";
import Constants from "expo-constants";
import { bold } from "ansi-colors";

import * as firebase from "firebase";

var classInfo;

firebase
  .database()
  .ref("Classes")
  .once("value")
  .then(function (snapshot) {
    classInfo = snapshot.val();
  });

export default class PillClassScreen extends React.Component {
  static navigationOptions = {
    title: "Pill Class",
  };
  constructor(props) {
    super(props);

    const { navigation } = this.props;
    const className = JSON.stringify(navigation.getParam("class", null));

    this.state = {
      pillClassName: className,
    };
  }

  componentDidMount() {
    for (var key in classInfo) {
      if (
        JSON.stringify(classInfo[key].class_name) == this.state.pillClassName
      ) {
        this.setState({
          class_key: key,
          class_name: classInfo[key].class_name,
          sample_amount: classInfo[key].sample_amount,
        });
        break; // If you want to break out of the loop once you've found a match
      }
    }
  }

  Save(class_name) {
    var ref = "Classes/" + this.state.class_key + "/";
    var user = firebase.database().ref(ref);
    user.update({ class_name: class_name });
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
          <Text>Class Key</Text>
          <TextInput
            style={styles.loginInput}
            placeholder={this.state.class_key}
            maxLength={20}
            editable={false}
          />
          <Text>Class Name</Text>
          <TextInput
            style={styles.loginInput}
            placeholder={String(this.state.class_name)}
            maxLength={50}
            onChangeText={(class_name) => this.setState({ class_name })}
          />
          <Text>Sample Amount</Text>
          <TextInput
            style={styles.loginInput}
            placeholder={String(this.state.sample_amount)}
            maxLength={20}
            editable={false}
          />
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => this.Save(this.state.class_name)}
          >
            <Text style={styles.loginText}>SAVE</Text>
          </TouchableOpacity>
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
