import React, { Component } from "react";
import { View } from "react-native";
import {
  Container,
  Text,
  Card,
  CardItem,
  Body,
  Content,
  DatePicker
} from "native-base";
import {
  utils,
  budgetSchema,
  expenseSchema,
  timelineSchema
} from "../utils/Utils";
var moment = require("moment");
const Realm = require("realm");

export default class TimeLine extends Component {
  constructor(props) {
    super(props);

    this.state = {
      startDate: moment(new Date()).format("DD/MM/YYYY"),
      endDate: "-",
      differenceInDays: 0,
      realm: null,
      totalBudget: 0,
      diffInAmt: this.props.totalBudget - this.props.totalExpense
    };
  }
  _getDate = newDate => {
    if (newDate !== undefined) {
      const startDateMoment = moment(newDate);
      const endDate = moment(startDateMoment);
      endDate.add(1, "months");

      const currentDate = moment(new Date());
      var differenceInDays = parseInt(endDate.diff(currentDate, "days")) + 1;

      this.setState({
        startDate: startDateMoment.format("DD/MM/YYYY"),
        endDate: endDate.format("DD/MM/YYYY"),
        differenceInDays: differenceInDays
      });
    }
  };

  _setDate = newDate => {
    if (newDate !== undefined) {
      Realm.open({
        schema: [budgetSchema, expenseSchema, timelineSchema]
      }).then(realm => {
        realm.write(() => {
          realm.deleteAll();
          realm.create("Timeline", {
            startDate: newDate
          });
        });
      });

      this._getDate(newDate);
    }
  };

  _getStartDate = () => {
    Realm.open({ schema: [budgetSchema, expenseSchema, timelineSchema] }).then(
      realm => {
        const startDate = realm.objects("Timeline")[0].startDate;
        this._getDate(startDate);
      }
    );
  };

  componentWillMount() {
    this._getStartDate();
  }

  render() {
    if (this.props.realm) {
      return (
        <Card style={{ marginLeft: 10, marginRight: 10, marginBottom: 10 }}>
          <CardItem header bordered>
            <DatePicker
              locale={"en"}
              modalTransparent={false}
              animationType={"fade"}
              androidMode={"default"}
              placeHolderText={this.state.startDate.toString()}
              textStyle={{ color: "blue" }}
              placeHolderTextStyle={{ color: "#d3d3d3" }}
              onDateChange={date => this._setDate(date)}
            />
            <Text> - {this.state.endDate.toString()}</Text>
            <Text> - {this.state.differenceInDays.toString()}Days Left</Text>
          </CardItem>
          <CardItem>
            <Body>
              <Text>Total Budget: {this.props.totalBudget}</Text>
              <Text>Total Spent: {this.props.totalExpense}</Text>
              <Text>
                Total Left:
                {(this.props.totalBudget - this.props.totalExpense).toString()}
              </Text>
            </Body>
          </CardItem>
        </Card>
      );
    } else {
      return <View />;
    }
  }
}
