import React from "react";
import {
  AsyncStorage,
  StyleSheet,
  View,
  SectionList,
  SafeAreaView,
  Text,
  Image
} from "react-native";
import {
  Badge,
  Input,
  Button,
  Card,
  ListItem,
  Icon
} from "react-native-elements";
import Constants from "expo-constants";
import { bold } from "ansi-colors";

const DATA = [
  {
    title: "Device Informations",
    data: ["Power Mode: Stable", "No Error"]
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
];

function Item({ title }) {
  return (
    <View style={styles.item}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    title: "Smart Pill Box"
  };

  render() {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.contentContainer}>
          <SectionList
            sections={DATA}
            keyExtractor={(item, index) => item + index}
            renderItem={({ item }) => <Item title={item} />}
            renderSectionHeader={({ section: { title } }) => (
              <Text style={styles.header}>{title}</Text>
            )}
          />
        </SafeAreaView>
        <Button
          title="Sing Out"
          onPress={this._signOutAsync}
          style={styles.button}
        />
      </View>
    );
  }

  _showMoreApp = () => {
    this.props.navigation.navigate("Other");
  };

  _signOutAsync = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate("Auth");
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center"
  },
  contentContainer: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
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
    marginVertical: 8
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    backgroundColor: "white",
    paddingTop: 12,
    paddingBottom: 12
  },
  title: {
    fontSize: 16
  }
});
