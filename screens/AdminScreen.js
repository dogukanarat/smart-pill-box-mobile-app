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
  TouchableOpacity
} from "react-native";
import {
  Badge,
  Input,
  Button,
  Card,
  ListItem,
  Icon,
  ButtonGroup
} from "react-native-elements";
import Constants from "expo-constants";
import { bold } from "ansi-colors";

import * as firebase from "firebase";

var batterystatus = "None";
var classamount = "None";
var iserroroccured = "None";
var powermode = "None";
var useramount = "None";

var SP = firebase.database().ref("StatusParameters");
SP.on("value", function(snapshot) {
  batterystatus = snapshot.val().BatteryStatus;
  classamount = snapshot.val().ClassAmount;
  iserroroccured = snapshot.val().IsErrorOccured;
  powermode = snapshot.val().PowerMode;
  useramount = snapshot.val().UserAmount;
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
    title: "Smart Pill Box"
  };

  constructor(props) {
    super(props);
    this.state = {
      date: new Date(),
      powermode: powermode,
      DATA: [
        {
          title: "Device Informations",
          data: [
            "Power Mode: " + powermode,
            "Battery Status: " + batterystatus,
            "Total Class Amount: " + classamount,
            "Total User Amount: " + useramount,
            "Error:" + iserroroccured
          ]
        },
        {
          title: "Pill Classes",
          data: ["Class A: 12", "Class B: 2"]
        },
        {
          title: "Patient",
          data: ["Doğukan", "Saad", "Yasemin"]
        },
        {
          title: "Warnings",
          data: ["Class B Pill is running out"]
        }
      ]
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
      selectedIndex: [0, 1, 2],
      date: new Date(),
      DATA: [
        {
          title: "Device Informations",
          data: [
            "Power Mode: " + powermode,
            "Battery Status: " + batterystatus,
            "Total Class Amount: " + classamount,
            "Total User Amount: " + useramount,
            "Error: " + iserroroccured
          ]
        },
        {
          title: "Pill Classes",
          data: ["Class A: 12", "Class B: 2"]
        },
        {
          title: "Patient",
          data: ["Doğukan", "Saad", "Yasemin"]
        },
        {
          title: "Warnings",
          data: ["Class B Pill is running out"]
        }
      ]
    });
  }

  render() {
    const buttons = ["New Pill", "New Patient", "Logout"];
    const { selectedIndex } = this.state;

    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.contentContainer}>
          <SectionList
            sections={this.state.DATA}
            keyExtractor={(item, index) => item + index}
            renderItem={({ item }) => <Item title={item} />}
            renderSectionHeader={({ section: { title } }) => (
              <Text style={styles.header}>{title}</Text>
            )}
          />
        </SafeAreaView>
        <ButtonGroup
          onPress={this.updateIndex}
          selectedIndex={selectedIndex}
          buttons={buttons}
          containerStyle={{ height: 50 }}
        />
      </View>
    );
  }

  updateIndex = async selectedIndex => {
    if (selectedIndex == 2) {
      await AsyncStorage.clear();
      this.props.navigation.navigate("SignIn");
    }
  };

  _showMoreApp = () => {
    this.props.navigation.navigate("Other");
  };

  _signOutAsync = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate("SignIn");
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center"
  },
  contentContainer: {
    flex: 1,

    marginLeft: 16,
    alignSelf: "stretch",
    marginBottom: 10
  },
  button: {
    width: 100,
    marginVertical: 10
  },
  item: {
    padding: 8,
    marginVertical: 2
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    backgroundColor: "white",
    paddingTop: 16,
    paddingBottom: 16
  },
  title: {
    fontSize: 16
  },
  logoutButton: {
    backgroundColor: "black",
    marginVertical: 10,
    width: 300,
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 25
  },
  logoutText: {
    fontSize: 16,
    color: "white"
  }
});
