import React, { Component, PureComponent } from "react";
import { View, FlatList, TouchableNativeFeedback, Alert } from "react-native";
import {
  Container,
  Header,
  Left,
  Body,
  Right,
  Button,
  Icon,
  Title
} from "native-base";
import {
  utils,
  budgetSchema,
  expenseSchema,
  timelineSchema
} from "../utils/Utils";
import UpdateModal from "../components/UpdateModal";
import ExpenseList from "../components/ExpenseList";
const Realm = require("realm");
const shortid = require("shortid");

class BudgetDetailsHeader extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      budgetItem: this.props.budgetItem
    };
  }
  _onDeleteClicked = () => {
    Alert.alert(
      "Delete Item",
      "Are you sure you want to delete?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { text: "Ok", onPress: () => this._deleteBudgetItem() }
      ],
      { cancelable: true }
    );
  };

  _deleteBudgetItem = () => {
    const budgetId = this.props.budgetItem.id;
    Realm.open({ schema: [budgetSchema, expenseSchema, timelineSchema] }).then(
      realm => {
        const expenseItemFromBudget = realm
          .objects("Expense")
          .filtered("budgetId = '" + budgetId + "'");

        realm.write(() => {
          realm.delete(expenseItemFromBudget);
          realm.delete(realm.objectForPrimaryKey("Budget", budgetId));
        });
      }
    );
    this.props.navigation.state.params._getAllBudgetItem();
    this.props.navigation.goBack();
  };

  _onEditClicked = () => {
    this.props._toggleUpdateModalIsVisible("editBudget");
  };
  render() {
    var budgetTitle = "Budget Details";
    if (this.props.budgetItem) {
      budgetTitle = this.props.budgetItem.title;
    }
    return (
      <Header>
        <Left>
          <Button transparent onPress={() => this.props.navigation.goBack()}>
            <Icon name="arrow-back" />
          </Button>
        </Left>
        <Body>
          <Title>{budgetTitle}</Title>
        </Body>
        <Right>
          <Button transparent onPress={() => this._onEditClicked()}>
            <Icon name="edit" type="Feather" />
          </Button>
          <Button transparent onPress={() => this._onDeleteClicked()}>
            <Icon name="trash-2" type="Feather" />
          </Button>
        </Right>
      </Header>
    );
  }
}

export default class BudgetDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      budgetItem: null,
      isVisible: false,
      realm: null,
      action: "",
      selectedExpenseItem: null
    };
  }

  _getAllExpenseItem = () => {
    Realm.open({ schema: [budgetSchema, expenseSchema, timelineSchema] }).then(
      realm => {
        this.setState({ realm: realm });
      }
    );
  };

  componentWillMount() {
    this._getItemDetails();
    this._getAllExpenseItem();
  }

  _toggleUpdateModalIsVisible = (action = "") => {
    this.setState({
      isVisible: !this.state.isVisible,
      action: action
    });
  };

  _setSelectedItem = (item = null) => {
    this.setState({
      selectedExpenseItem: item
    });
  };

  _getItemDetails = () => {
    const itemId = this.props.navigation.getParam("id", "");
    Realm.open({ schema: [budgetSchema, expenseSchema, timelineSchema] }).then(
      realm => {
        const budgetItem = realm
          .objects("Budget")
          .filtered("id = '" + itemId + "'")[0];
        this.setState({ budgetItem: budgetItem });
      }
    );
  };

  render() {
    return (
      <Container>
        <BudgetDetailsHeader
          navigation={this.props.navigation}
          budgetItem={this.state.budgetItem}
          _toggleUpdateModalIsVisible={this._toggleUpdateModalIsVisible}
        />
        <ExpenseList
          navigation={this.props.navigation}
          _toggleUpdateModalIsVisible={this._toggleUpdateModalIsVisible}
          realm={this.state.realm}
          budgetItem={this.state.budgetItem}
          _setSelectedItem={this._setSelectedItem}
          _getAllExpenseItem={this._getAllExpenseItem}
        />
        <UpdateModal
          navigation={this.props.navigation}
          item={this.state.budgetItem}
          _getItemDetails={this._getItemDetails}
          _toggleUpdateModalIsVisible={this._toggleUpdateModalIsVisible}
          isVisible={this.state.isVisible}
          selectedExpenseItem={this.state.selectedExpenseItem}
          action={this.state.action}
          _getAllBudgetItem={
            this.props.navigation.state.params._getAllBudgetItem
          }
          _getAllExpenseItem={this._getAllExpenseItem}
        />
      </Container>
    );
  }
}
