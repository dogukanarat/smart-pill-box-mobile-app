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

var powermode, classamount, iserroroccured, batterystatus, useramount;

firebase
  .database()
  .ref("StatusParameters")
  .on("value", function (snapshot) {
    batterystatus = snapshot.val().BatteryStatus;
    classamount = snapshot.val().ClassAmount;
    iserroroccured = snapshot.val().IsErrorOccured;
    powermode = snapshot.val().PowerMode;
    useramount = snapshot.val().UserAmount;
  });

var classes = [];

firebase
  .database()
  .ref("Classes")
  .orderByKey()
  .once("value")
  .then(function (snapshot) {
    snapshot.forEach(function (childSnapshot) {
      var key = childSnapshot.key;
      var class_name = childSnapshot.val().class_name;
      var sample_amount = childSnapshot.val().sample_amount;

      classes.push(class_name + ": " + sample_amount);
    });
  });

var users = [];

firebase
  .database()
  .ref("Users")
  .orderByKey()
  .once("value")
  .then(function (snapshot) {
    snapshot.forEach(function (childSnapshot) {
      var key = childSnapshot.key;
      var user_name = childSnapshot.val().user_name;
      var is_admin = childSnapshot.val().is_admin;

      if (!is_admin) {
        users.push(user_name);
      }
    });
  });

function Item({ title }) {
  return (
    <View style={styles.item}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}
export default class AdminScreen extends React.Component {
  static navigationOptions = {
    title: "Smart Pill Box",
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: 2,
      date: new Date(),
      powermode: powermode,
      statusParameter: [
        {
          title: "Device Informations",
          data: [
            "Power Mode: " + powermode,
            "Battery Status: " + batterystatus,
            "Total Class Amount: " + classamount,
            "Total User Amount: " + useramount,
            "Error: " + iserroroccured,
          ],
        },
      ],
      pillClasses: [
        {
          title: "Pill Classes",
          data: classes,
        },
      ],
      users: [
        {
          title: "Users",
          data: users,
        },
      ],
    };
  }

  componentDidMount() {
    this.timerID = setInterval(() => this.tick(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    this.setState({
      selectedIndex: 2,
      date: new Date(),
      statusParameter: [
        {
          title: "Device Informations",
          data: [
            "Power Mode: " + powermode,
            "Battery Status: " + batterystatus,
            "Total Class Amount: " + classamount,
            "Total User Amount: " + useramount,
            "Error: " + iserroroccured,
          ],
        },
      ],
      pillClasses: [
        {
          title: "Pill Classes",
          data: classes,
        },
      ],
      users: [
        {
          title: "Users",
          data: users,
        },
      ],
    });
  }

  render() {
    const buttons = ["New Pill", "Logout"];
    const { selectedIndex } = this.state;

    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.contentContainer}>
          <SectionList
            sections={this.state.statusParameter}
            keyExtractor={(item, index) => item + index}
            renderItem={({ item }) => <Item title={item} />}
            renderSectionHeader={({ section: { title } }) => (
              <Text style={styles.header}>{title}</Text>
            )}
          />
          <SectionList
            sections={this.state.pillClasses}
            keyExtractor={(item, index) => item + index}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate("PillClass", {
                    itemId: 86,
                    otherParam: "anything you want here",
                  });
                }}
              >
                <Item title={item} />
              </TouchableOpacity>
            )}
            renderSectionHeader={({ section: { title } }) => (
              <Text style={styles.header}>{title}</Text>
            )}
          />
          <SectionList
            sections={this.state.users}
            keyExtractor={(item, index) => item + index}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate("User", {
                    user: item,
                  });
                }}
              >
                <Item title={item} />
              </TouchableOpacity>
            )}
            renderSectionHeader={({ section: { title } }) => (
              <Text style={styles.header}>{title}</Text>
            )}
          />
        </SafeAreaView>
        <ButtonGroup
          onPress={this.updateIndex}
          selectedIndex={selectedIndex}
          buttons={buttons}
          containerStyle={{ height: 50, minWidth: 150 }}
        />
      </View>
    );
  }

  updateIndex = async (selectedIndex) => {
    if (selectedIndex == 0) {
      // Set Status Parameter for New Pill Image
    }
    if (selectedIndex == 1) {
      await AsyncStorage.clear();
      this.props.navigation.navigate("SignIn");
    }
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  contentContainer: {
    flex: 1,
    marginLeft: 16,
    alignSelf: "stretch",
    marginBottom: 10,
  },
  button: {
    width: 100,
    marginVertical: 10,
  },
  item: {
    padding: 8,
    marginVertical: 2,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    backgroundColor: "white",
    paddingTop: 16,
    paddingBottom: 16,
  },
  title: {
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: "black",
    marginVertical: 10,
    width: 300,
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  logoutText: {
    fontSize: 16,
    color: "white",
  },
});
