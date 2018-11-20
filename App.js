import { StackNavigator } from "react-navigation"; // 1.0.0-beta.27
import React, { Component } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import BudgetHome from "./src/screens/BudgetHome";
import BudgetDetails from "./src/screens/BudgetDetails";

const RootStack = StackNavigator(
  {
    BudgetHome: {
      screen: BudgetHome
    },
    BudgetDetails: {
      screen: BudgetDetails
    }
  },
  {
    initialRouteName: "BudgetHome",
    headerMode: "none"
  }
);

export default class App extends React.Component {
  render() {
    return <RootStack />;
  }
}
