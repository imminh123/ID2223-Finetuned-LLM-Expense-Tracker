import React from "react";
import { Expense } from "./types";

interface ExpenseWidgetProps {
  data: Expense;
}

const ExpenseWidget: React.FC<ExpenseWidgetProps> = ({ data }) => (
  <div className="alert alert-info mt-2">
    <div>
      <p className="font-bold">Expense Logged</p>
      <p>Name: {data.name}</p>
      <p>Amount: SEK {data.amount}</p>
      <p>Date: {new Date(data.date).toLocaleDateString()}</p>
    </div>
  </div>
);

export default ExpenseWidget;