import React, { Component, PureComponent } from "react";
import { View } from "react-native";
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
const shortid = require("shortid");
const Realm = require("realm");

export default class UpdateModal extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      title: "",
      amount: "",
      initialTitle: "",
      initialAmt: ""
    };
  }

  componentDidUpdate() {
    if (this.props.action === "editBudget") {
      this.setState({
        initialTitle: this.props.item.title,
        initialAmt: this.props.item.amount.toString()
      });
    } else if (this.props.action === "editExpense") {
      this.setState({
        title: this.props.selectedExpenseItem.title,
        amount: this.props.selectedExpenseItem.amount.toString()
      });
    }
  }

  _addNewBudgetItem = () => {
    Realm.open({ schema: [budgetSchema, expenseSchema, timelineSchema] }).then(
      realm => {
        realm.write(() => {
          realm.create("Budget", {
            id: shortid.generate(),
            title: this.state.title,
            amount: parseFloat(this.state.amount)
          });
        });
        this.setState({
          title: "",
          amount: ""
        });
      }
    );
  };

  _addNewExpenseItem = () => {
    Realm.open({ schema: [budgetSchema, expenseSchema, timelineSchema] }).then(
      realm => {
        realm.write(() => {
          realm.create("Expense", {
            id: shortid.generate(),
            title: this.state.title,
            amount: parseFloat(this.state.amount),
            budgetId: this.props.selectedBudgetItem.id
          });
        });
        this.setState({
          title: "",
          amount: ""
        });
      }
    );
  };

  _editBudgetItem = () => {
    const title = this.state.title;
    const amount = parseFloat(this.state.amount);
    Realm.open({ schema: [budgetSchema, expenseSchema, timelineSchema] }).then(
      realm => {
        const budgetFilteredItem = realm
          .objects("Budget")
          .filtered("id = '" + this.props.item.id + "'")[0];
        realm.write(() => {
          budgetFilteredItem.title = title;
          budgetFilteredItem.amount = amount;
        });
      }
    );
  };

  _editExpenseItem = () => {
    const title = this.state.title;
    const amount = parseFloat(this.state.amount);
    Realm.open({ schema: [budgetSchema, expenseSchema, timelineSchema] }).then(
      realm => {
        const expenseFilteredItem = realm
          .objects("Expense")
          .filtered("id = '" + this.props.selectedExpenseItem.id + "'")[0];
        realm.write(() => {
          expenseFilteredItem.title = title;
          expenseFilteredItem.amount = amount;
        });
      }
    );
  };

  _onDoneClicked = () => {
    if (this.props.action == "addBudget") {
      this._addNewBudgetItem();
      this.props._toggleUpdateModalIsVisible();
      this.props._getAllBudgetItem();
    } else if (this.props.action === "editBudget") {
      this._editBudgetItem();
      this.props._toggleUpdateModalIsVisible();
      this.props._getItemDetails();
      this.props._getAllBudgetItem();
    } else if (this.props.action == "addExpense") {
      this._addNewExpenseItem();
      this.props._toggleUpdateModalIsVisible();
    } else if (this.props.action === "editExpense") {
      this._editExpenseItem();
      this.props._toggleUpdateModalIsVisible();
      this.props._getAllExpenseItem();
    }
    //   this.props.navigation.navigate("BudgetDetails");
  };

  _onCancelClicked = () => {
    this.props._toggleUpdateModalIsVisible();
  };

  render() {
    return (
      <Modal
        style={{
          flex: 1
        }}
        isVisible={this.props.isVisible}
        onBackdropPress={() => this.props._toggleUpdateModalIsVisible()}
      >
        <Container
          style={{
            flex: 1,
            justifyContent: "center",
            flexDirection: "column",
            maxHeight: 170
          }}
        >
          <Content padder>
            <Form>
              <Item inlineLabel>
                <Label>Title</Label>
                <Input
                  defaultValue={this.state.initialTitle}
                  onChangeText={text => this.setState({ title: text })}
                />
              </Item>
              <Item inlineLabel last>
                <Label>Amount</Label>
                <Input
                  defaultValue={this.state.initialAmt}
                  keyboardType="numeric"
                  onChangeText={text => this.setState({ amount: text })}
                />
              </Item>
              <View style={{ flexDirection: "row-reverse" }}>
                <Button
                  transparent
                  primary
                  style={{ padding: 10 }}
                  onPress={() => this._onDoneClicked()}
                >
                  <Text>Done</Text>
                </Button>
                <Button
                  transparent
                  primary
                  style={{ padding: 10 }}
                  onPress={() => this._onCancelClicked()}
                >
                  <Text>Cancel</Text>
                </Button>
              </View>
            </Form>
          </Content>
        </Container>
      </Modal>
    );
  }
}
