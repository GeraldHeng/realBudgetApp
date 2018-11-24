import { View, FlatList, TouchableNativeFeedback } from "react-native";
import React, { Component, PureComponent } from "react";
import {
  Container,
  Header,
  Content,
  ListItem,
  Text,
  Body,
  Button,
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

class BudgetItem extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      totalSpent: 0.0
    };
  }
  componentWillMount() {
    this._calculateTotalSpent();
  }

  componentWillUpdate() {
    this._calculateTotalSpent();
  }

  _onItemClicked = () => {
    this.props.navigation.navigate("BudgetDetails", {
      id: this.props.item.id,
      _getAllBudgetItem: this.props._getAllBudgetItem
    });
  };

  _onAddClicked = () => {
    this.props._toggleUpdateModalIsVisible("addExpense");
    this.props._setSelectedItem(this.props.item);
  };

  _calculateTotalSpent = () => {
    var totalSpent = 0.0;
    Realm.open({ schema: [budgetSchema, expenseSchema, timelineSchema] }).then(
      realm => {
        const expenseItemByBudget = realm
          .objects("Expense")
          .filtered("budgetId = '" + this.props.item.id + "'");
        for (var i = 0; expenseItemByBudget.length > i; i++) {
          totalSpent += expenseItemByBudget[i].amount;
        }
        this.setState({
          totalSpent: totalSpent
        });
      }
    );
  };
  render() {
    return (
      <ListItem onPress={() => this._onItemClicked()}>
        <Body>
          <Text>{this.props.item.title}</Text>
          <Text note numberOfLines={1}>
            Budget Amount: {this.props.item.amount.toString()}
          </Text>
          <Text note numberOfLines={1}>
            Amount Spent: {this.state.totalSpent.toString()}
          </Text>
          <Text note numberOfLines={1}>
            Amount Left to Spend:{" "}
            {(this.props.item.amount - this.state.totalSpent).toString()}
          </Text>
        </Body>
        <Right>
          <Button transparent primary onPress={() => this._onAddClicked()}>
            <Text>Add</Text>
          </Button>
        </Right>
      </ListItem>
    );
  }
}

export default class BudgetList extends Component {
  render() {
    if (this.props.realm) {
      return (
        <Container>
          <FlatList
            data={this.props.realm.objects("Budget")}
            keyExtractor={item => item.id}
            extraData={this.props}
            renderItem={({ item }) => (
              <BudgetItem
                item={item}
                _setSelectedItem={this.props._setSelectedItem}
                navigation={this.props.navigation}
                _toggleUpdateModalIsVisible={
                  this.props._toggleUpdateModalIsVisible
                }
                _getAllBudgetItem={this.props._getAllBudgetItem}
              />
            )}
          />
        </Container>
      );
    } else {
      return null;
    }
  }
}
