import { View, FlatList, TouchableNativeFeedback, Alert } from "react-native";
import React, { Component, PureComponent } from "react";
import {
  Container,
  Header,
  Content,
  ListItem,
  Text,
  Body,
  Button,
  Icon,
  Right
} from "native-base";
import {
  utils,
  budgetSchema,
  expenseSchema,
  timelineSchema
} from "../utils/Utils";
const shortid = require("shortid");
const Realm = require("realm");

class ExpenseItem extends PureComponent {
  _onItemClicked = () => {
    // this.props.navigation.navigate("BudgetDetails", {
    //   id: this.props.item.id,
    //   _getAllBudgetItem: this.props._getAllBudgetItem
    // });
  };

  _onItemEditClicked = () => {
    this.props._setSelectedItem(this.props.item);
    this.props._toggleUpdateModalIsVisible("editExpense");
  };

  _onItemDeleteClicked = () => {
    Alert.alert(
      "Delete Item",
      "Are you sure you want to delete?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { text: "Ok", onPress: () => this._deleteExpenseItem() }
      ],
      { cancelable: true }
    );
  };

  _deleteExpenseItem = () => {
    Realm.open({ schema: [budgetSchema, expenseSchema, timelineSchema] }).then(
      realm => {
        realm.write(() => {
          realm.delete(
            realm.objectForPrimaryKey("Expense", this.props.item.id)
          );
        });
      }
    );
    this.props._getAllExpenseItem();
  };

  render() {
    return (
      <TouchableNativeFeedback onPress={() => this._onItemClicked()}>
        <ListItem>
          <Body>
            <Text>{this.props.item.title}</Text>
            <Text note numberOfLines={1}>
              Expense Amount: {this.props.item.amount.toString()}
            </Text>
          </Body>
          <Right>
            <Button
              transparent
              primary
              full
              onPress={() => this._onItemEditClicked()}
            >
              <Icon name="edit" type="Feather" />
            </Button>
            <Button
              transparent
              primary
              full
              onPress={() => this._onItemDeleteClicked()}
            >
              <Icon name="trash-2" type="Feather" />
            </Button>
          </Right>
        </ListItem>
      </TouchableNativeFeedback>
    );
  }
}

export default class ExpenseList extends Component {
  render() {
    if (this.props.realm) {
      return (
        <FlatList
          data={this.props.realm
            .objects("Expense")
            .filtered("budgetId = '" + this.props.budgetItem.id + "'")}
          keyExtractor={item => item.id}
          extraData={this.props}
          renderItem={({ item }) => (
            <ExpenseItem
              item={item}
              _setSelectedItem={this.props._setSelectedItem}
              _toggleUpdateModalIsVisible={
                this.props._toggleUpdateModalIsVisible
              }
              _getAllExpenseItem={this.props._getAllExpenseItem}
            />
          )}
        />
      );
    } else {
      return <View />;
    }
  }
}
