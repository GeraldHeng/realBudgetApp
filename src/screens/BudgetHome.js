import React, { Component, PureComponent } from "react";
import { View, KeyboardAvoidingView } from "react-native";
import {
  Container,
  Header,
  Title,
  Content,
  Button,
  Icon,
  Left,
  Right,
  Body,
  Text,
  Fab,
  Col,
  Row,
  Grid,
  Form,
  Item,
  Input,
  Label
} from "native-base";
import TimeLine from "../components/TimeLine";
import Modal from "react-native-modal";
import BudgetList from "../components/BudgetList";
import {
  utils,
  budgetSchema,
  expenseSchema,
  timelineSchema
} from "../utils/Utils";
import UpdateModal from "../components/UpdateModal";
const shortid = require("shortid");
const Realm = require("realm");

class BudgetHomeHeader extends PureComponent {
  render() {
    return (
      <Header noLeft>
        <Body>
          <Title>Main Page</Title>
        </Body>
      </Header>
    );
  }
}

class FAB extends PureComponent {
  _onFABClicked = () => {
    this.props._toggleUpdateModalIsVisible("addBudget");
  };

  render() {
    return (
      <Fab position="bottomRight">
        <Icon name="plus" type="Feather" onPress={() => this._onFABClicked()} />
      </Fab>
    );
  }
}

export default class BudgetHome extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isVisible: false,
      realm: null,
      action: "",
      selectedBudgetItem: null,
      totalBudget: 0,
      totalExpense: 0
    };
  }

  _toggleUpdateModalIsVisible = (action = "") => {
    this.setState({
      isVisible: !this.state.isVisible,
      action: action
    });
  };

  _setSelectedItem = (item = null) => {
    this.setState({
      selectedBudgetItem: item
    });
  };

  componentWillMount() {
    this._getAllBudgetItem();
  }

  _getAllBudgetItem = () => {
    Realm.open({ schema: [budgetSchema, expenseSchema, timelineSchema] }).then(
      realm => {
        var totalBudget = 0;
        for (var i = 0; i < realm.objects("Budget").length; i++) {
          totalBudget += realm.objects("Budget")[i].amount;
        }

        var totalExpense = 0;
        for (var i = 0; i < realm.objects("Expense").length; i++) {
          totalExpense += realm.objects("Expense")[i].amount;
        }

        this.setState({
          realm: realm,
          totalBudget: totalBudget,
          totalExpense: totalExpense
        });
      }
    );
  };

  render() {
    return (
      <Container>
        <TimeLine
          style={{ backgroundColor: "#0000FF", height: 200 }}
          realm={this.state.realm}
          totalBudget={this.state.totalBudget}
          totalExpense={this.state.totalExpense}
        />
        <BudgetList
          navigation={this.props.navigation}
          realm={this.state.realm}
          _getAllBudgetItem={this._getAllBudgetItem}
          _toggleUpdateModalIsVisible={this._toggleUpdateModalIsVisible}
          _setSelectedItem={this._setSelectedItem}
        />
        <FAB _toggleUpdateModalIsVisible={this._toggleUpdateModalIsVisible} />
        <UpdateModal
          _getAllBudgetItem={this._getAllBudgetItem}
          navigation={this.props.navigation}
          _toggleUpdateModalIsVisible={this._toggleUpdateModalIsVisible}
          selectedBudgetItem={this.state.selectedBudgetItem}
          isVisible={this.state.isVisible}
          action={this.state.action}
        />
      </Container>
    );
  }
}
