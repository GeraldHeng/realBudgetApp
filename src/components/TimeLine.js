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
var moment = require("moment");

export default class TimeLine extends Component {
  constructor(props) {
    super(props);

    this.state = {
      startDate: new Date(),
      endDate: "-",
      differenceInDays: 0
    };
  }
  _setDate = newDate => {
    if (newDate !== undefined) {
      console.log(newDate + " is new date");
      var startDateMoment = moment(newDate);
      var endDate = startDateMoment.add(1, "months").format("DD/MM/YYYY");
      var differenceInDays = startDateMoment.diff(endDate, "days");
      this.setState({
        startDate: newDate,
        endDate: endDate,
        differenceInDays: differenceInDays
      });
    }
  };

  render() {
    return (
      <Card style={{ marginLeft: 10, marginRight: 10, marginBottom: 10 }}>
        <CardItem header bordered>
          <DatePicker
            locale={"en"}
            modalTransparent={false}
            animationType={"fade"}
            androidMode={"default"}
            placeHolderText="Select date"
            textStyle={{ color: "blue" }}
            placeHolderTextStyle={{ color: "#d3d3d3" }}
            onDateChange={date => this._setDate(date)}
          />
          <Text> - {this.state.endDate.toString()}</Text>
          <Text> - {this.state.differenceInDays.toString()}Days Left</Text>
        </CardItem>
        <CardItem>
          <Body>
            <Text>Total Budget: </Text>
            <Text>Total Spent: </Text>
            <Text>Total Left: </Text>
          </Body>
        </CardItem>
      </Card>
    );
  }
}
