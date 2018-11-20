const Realm = require("realm");

export const utils = {};

export const budgetSchema = {
  name: "Budget",
  primaryKey: "id",
  properties: {
    id: "string",
    title: "string",
    amount: "double"
  }
};

export const expenseSchema = {
  name: "Expense",
  primaryKey: "id",
  properties: {
    id: "string",
    title: "string",
    amount: "double",
    budgetId: "string"
  }
};

export const timelineSchema = {
  name: "Timeline",
  properties: {
    startDate: "date"
  }
};
