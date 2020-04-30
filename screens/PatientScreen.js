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

var periods = [];
var message;

function Item({ title }) {
  return (
    <View style={styles.item}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

export default class PatientScreen extends React.Component {
  static navigationOptions = {
    title: "Smart Pill Box: Patient Screen",
  };

  constructor(props) {
    super(props);
    this.navigation = props.navigation;
    this.state = {
      date: new Date(),
      selectedIndex: -1,
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
      periods: [
        {
          title: "Periods",
          data: periods,
        },
      ],
      message: message,
    });

    periods = [];

    firebase
      .database()
      .ref("Periods")
      .orderByKey()
      .once("value")
      .then(async (snapshot) => {
        var token = await AsyncStorage.getItem("userTokenUserName");
        var count_message = 0;
        snapshot.forEach((childSnapshot) => {
          var key = childSnapshot.key;
          var user_name = childSnapshot.val().user_name;
          var class_name = childSnapshot.val().class_name;
          var frequency = childSnapshot.val().frequency;
          var user_message = childSnapshot.val().message;

          if (token == user_name) {
            periods.push(
              key +
                ":" +
                class_name +
                " for " +
                user_name +
                " every " +
                frequency +
                " hours"
            );
            if (user_message) {
              count_message += 1;
            }
          }
        });

        message = count_message == 0 ? false : true;
      });
  }

  render() {
    const buttons = ["Logout"];
    const { selectedIndex } = this.state;

    var print_message;

    if (this.state.message) {
      print_message = (
        <Badge
          status="warning"
          value="Go to machine to take the pill!"
          badgeStyle={styles.badge}
          textStyle={styles.badgeText}
        />
      );
    } else {
      print_message = null;
    }

    return (
      <View style={styles.container}>
        <ScrollView style={styles.contentContainer}>
          {print_message}
          <SectionList
            sections={this.state.periods}
            keyExtractor={(item, index) => item + index}
            renderItem={({ item }) => (
              <TouchableOpacity>
                <Item title={item.split(":")[1]} />
              </TouchableOpacity>
            )}
            renderSectionHeader={({ section: { title } }) => (
              <Text style={styles.header}>{title}</Text>
            )}
          />
          <ButtonGroup
            onPress={this.updateIndex}
            selectedIndex={selectedIndex}
            buttons={buttons}
            containerStyle={{ height: 50, minWidth: 150 }}
          />
        </ScrollView>
      </View>
    );
  }
  updateIndex = async (selectedIndex) => {
    if (selectedIndex == 0) {
      await AsyncStorage.clear();
      this.props.navigation.navigate("Auth");
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
    marginRight: 16,
    alignSelf: "stretch",
    marginBottom: 10,
  },
  badge: {
    margin: 20,
    padding: 15,
  },
  badgeText: {
    fontSize: 18,
    fontStyle: "bold",
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
