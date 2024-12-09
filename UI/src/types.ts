export interface Expense {
    name: string;
    amount: number;
    date: string;
  }
  
  export interface Message {
    sender: "user" | "bot";
    text: string;
  }