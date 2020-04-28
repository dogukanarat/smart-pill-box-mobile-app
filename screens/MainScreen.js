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

      if (is_admin) {
        users.push(user_name + ": Admin");
      } else {
        users.push(user_name + ": Patient");
      }
    });
  });

var periods = [];

firebase
  .database()
  .ref("Periods")
  .orderByKey()
  .once("value")
  .then(function (snapshot) {
    snapshot.forEach(function (childSnapshot) {
      var key = childSnapshot.key;
      var user_name = childSnapshot.val().user_name;
      var class_name = childSnapshot.val().class_name;

      periods.push(key + ":" + class_name + " for " + user_name);
    });
  });

function Item({ title }) {
  return (
    <View style={styles.item}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}
export default class MainScreen extends React.Component {
  static navigationOptions = {
    title: "Smart Pill Box",
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: -1,
      isLoading: true,
    };
  }

  componentDidMount() {
    AsyncStorage.getItem("userTokenIsAdmin").then((token) => {
      this.setState({
        isLoading: false,
        userIsAdmin: token,
      });
    });
  }

  render() {
    const buttons = ["Refresh", "New Pill", "New Period", "Logout"];
    const { selectedIndex } = this.state;

    console.log("Render:", this.state.userIsAdmin);

    var willRender = null;

    if (true) {
      willRender = (
        <View>
          <AdminScreen navigation={this.props.navigation} />
          <ButtonGroup
            onPress={this.updateIndex}
            selectedIndex={selectedIndex}
            buttons={buttons}
            containerStyle={{ height: 50, minWidth: 150 }}
          />
        </View>
      );
    } else {
      willRender = <PatientScreen navigation={this.props.navigation} />;
    }

    if (this.state.isLoading) {
      return (
        <View style={styles.container}>
          <ScrollView style={styles.contentContainer}>
            <Text>Loading...</Text>
          </ScrollView>
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <ScrollView style={styles.contentContainer}>{willRender}</ScrollView>
        </View>
      );
    }
  }

  updateIndex = async (selectedIndex) => {
    if (selectedIndex == 0) {
      // Refresh
      location.reload();
    }
    if (selectedIndex == 1) {
      var ref = "StatusParameters/";
      var parameters = firebase.database().ref(ref);
      parameters.update({
        NewPillCmd: true,
      });
    }
    if (selectedIndex == 2) {
      this.props.navigation.navigate("NewPeriod");
    }
    if (selectedIndex == 3) {
      await AsyncStorage.clear();
      this.props.navigation.navigate("Auth");
    }
  };
}
class AdminScreen extends React.Component {
  constructor(props) {
    super(props);
    this.navigation = props.navigation;
    this.state = {
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
      periods: [
        {
          title: "Periods",
          data: periods,
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
      periods: [
        {
          title: "Periods",
          data: periods,
        },
      ],
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.contentContainer}>
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
                  this.navigation.navigate("PillClass", {
                    class: item.split(":")[0],
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
                  this.navigation.navigate("User", {
                    user: item.split(":")[0],
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
            sections={this.state.periods}
            keyExtractor={(item, index) => item + index}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  this.navigation.navigate("Period", {
                    period: item.split(":")[0],
                  });
                }}
              >
                <Item title={item.split(":")[1]} />
              </TouchableOpacity>
            )}
            renderSectionHeader={({ section: { title } }) => (
              <Text style={styles.header}>{title}</Text>
            )}
          />
        </ScrollView>
      </View>
    );
  }
}

class PatientScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.contentContainer}>
          <Text>Patient Screen</Text>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  contentContainer: {
    flex: 1,
    marginLeft: 16,
    marginRight: 16,
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
});
