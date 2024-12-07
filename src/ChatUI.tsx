import React, { useState } from "react";
import axios from "axios";
import ExpenseWidget from "./ExpenseWidget";
import { parseDate } from "./util";
import { Expense, Message } from "./types";
import Together from "together-ai";
const togetherClient = new Together({
  apiKey: process.env.REACT_APP_TOGETHER_API_KEY,
});

const ChatUI: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [widgetData, setWidgetData] = useState<Expense | null>(null);
  const [popupVisible, setPopupVisible] = useState<boolean>(false);
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);

  // Together AI client

  const callTogetherAPI = async (messages: any): Promise<string> => {
    const model = "meta-llama/Llama-3.2-3B-Instruct-Turbo";
    try {
      // const response = await togetherClient.chat.completions.create({
      //   model,
      //   messages,
      // });

      // axios post to http://0.0.0.0:8000/chat
      const response = await axios.post("http://0.0.0.0:8000/chat", messages);
      return response.data['assistant'];
      // return response?.choices[0]?.message?.content || ""; // Assuming Together API follows OpenAI response format
    } catch (error) {
      console.error("Error calling Together API:", error);
      return "Oops, I encountered an issue generating a response.";
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);

    let userInput = input.toLowerCase();
    // replace today with current date in user input
    if (userInput.includes("today")) {
      userInput = input.replace("today", new Date().toLocaleDateString());
    }

    try {
      // First API call to parse user input in JSON format of name, amount, date
      const messages = [
        {
          role: "system",
          content:
            "You are a helpful assistant that take user input and return JSON.",
        },
        {
          role: "user",
          content: `Do not write code. Parse the input string and return JSON format. Here's the field: type (default "expense"), name, amount, date (dd/MM/2024). \n Input: ${userInput}`,
        },
      ];

      let parseResponse = await callTogetherAPI(messages);
      let parseExpense: {
        type: string;
        name: string;
        amount: number;
        date: string;
      };
      try {
        parseExpense = JSON.parse(parseResponse);
      } catch (error) {
        console.error("Error parsing JSON response from Together API:", error);
        throw new Error("Error parsing JSON response from Together API");
      }

      if (parseExpense.type === "expense") {
        const expense: Expense = {
          name: parseExpense.name,
          amount: parseExpense.amount,
          date: parseExpense.date || new Date().toISOString(),
        };

        // Save the expense in localStorage
        const expenses: Expense[] = JSON.parse(
          localStorage.getItem("expenses") || "[]"
        );
        expenses.push(expense);
        localStorage.setItem("expenses", JSON.stringify(expenses));

        // Call Together API to generate mocking response
        const mockResponse = await callTogetherAPI([
          {
            role: "system",
            content:
              "You are a angry and sarcastic assistant. User has been wasting money again. ",
          },
          {
            role: "user",
            content: `I spent SEK ${expense.amount} on ${expense.name}. What do you think in short?`,
          },
        ]);

        setMessages((prev) => [...prev, { sender: "bot", text: mockResponse }]);
        setWidgetData(expense);
      } else if (parseExpense.type === "summary") {
        const date = parseDate(parseExpense.date || new Date());
        const expenses: Expense[] = JSON.parse(
          localStorage.getItem("expenses") || "[]"
        );
        const summary = expenses.filter(
          (e) => parseDate(e.date) === parseDate(date)
        );

        const sumAmount = summary.reduce((acc, e) => acc + e.amount, 0);

        // Generate summary content for Together API
        const summaryContent =
          summary.length > 0
            ? `Here is my expense for ${date}: ${sumAmount} SEK.`
            : `You had no expenses logged for ${date}.`;

        const summaryResponse = await callTogetherAPI([
          {
            role: "system",
            content:
              "You are a angry and sarcastic assistant. User has been wasting money again.",
          },
          {
            role: "user",
            content: `Give me a short summary of my expenses for ${date}. \n Input: ${summaryContent}`,
          },
        ]);

        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: summaryResponse },
        ]);
      } else {
        const errorResponse = await callTogetherAPI([
          {
            role: "user",
            content: "I entered something invalid. Mock me in short.",
          },
        ]);

        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: errorResponse },
        ]);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Error processing your request." },
      ]);
    }

    setInput("");
  };

  const handleKeyPress = (event: any) => {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  };

  const handleOpenPopup = (day: string) => {
    const expenses: Expense[] = JSON.parse(
      localStorage.getItem("expenses") || "[]"
    );

    // const filtered = expenses.filter((expense) => {
    //   const expenseDate = new Date(expense.date);
    //   const selectedDate = new Date(day);
    //   return expenseDate > selectedDate;
    // });

    setFilteredExpenses(expenses);
    setPopupVisible(true);
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="chat chat-start flex flex-col space-y-2 overflow-y-auto">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`chat-bubble ${
              msg.sender === "user"
                ? "chat-bubble-primary chat-end"
                : "chat-bubble-secondary chat-start"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      {widgetData && <ExpenseWidget data={widgetData} />}

      <div className="form-control flex items-center space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="input input-bordered w-full"
          placeholder="Type a message..."
        />


      <div className="flex justify-center items-center mt-5">
        <button
          onKeyDown={handleKeyPress}
          onClick={handleSendMessage}
          className="btn btn-primary w-full"
        >
          Send
        </button>

        <button
          onClick={() => handleOpenPopup("2024-12-01")}
          className="btn btn-square btn-ghost"
          id="menu-toggle"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="inline-block w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
        </div>
      </div>


      {popupVisible && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Expenses</h3>
            <ul className="mt-4">
            {filteredExpenses.length > 0 ? (
              <table className="table table-zebra w-full mt-4">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Amount (SEK)</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredExpenses.map((expense, idx) => (
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      <td>{expense.name}</td>
                      <td>{expense.amount}</td>
                      <td>{new Date(expense.date).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-center mt-4">No expenses found.</p>
            )}
            </ul>
            <div className="modal-action">
              <button className="btn" onClick={() => setPopupVisible(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatUI;
