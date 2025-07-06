"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

// Sample categories
const categories = ["Food", "Rent", "Transport", "Shopping", "Entertainment", "Other"];

export default function Home() {
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState({
    amount: "",
    date: "",
    description: "",
    category: "",
  });

  // Group by month for chart
  const monthlyData = transactions.reduce((acc, tx) => {
    const month = new Date(tx.date).toLocaleString("default", {
      month: "short",
      year: "numeric",
    });
    const amount = parseFloat(tx.amount);
    const existing = acc.find((item) => item.month === month);
    if (existing) {
      existing.total += amount;
    } else {
      acc.push({ month, total: amount });
    }
    return acc;
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { amount, date, description, category } = form;

    if (!amount || !date || !description || !category) {
      alert("All fields are required");
      return;
    }

    const newTransaction = {
      id: Date.now(),
      amount,
      date,
      description,
      category,
    };

    setTransactions([...transactions, newTransaction]);
    setForm({ amount: "", date: "", description: "", category: "" });
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Form */}
        <Card>
          <CardContent className="space-y-4 p-6">
            <h2 className="text-xl font-semibold">Add Transaction</h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  type="number"
                  id="amount"
                  value={form.amount}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  type="date"
                  id="date"
                  value={form.date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  type="text"
                  id="description"
                  value={form.description}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <Button type="submit" className="w-full">
                Add Transaction
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Transaction List */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Transactions</h3>
          {transactions.length === 0 ? (
            <p className="text-gray-500">No transactions yet.</p>
          ) : (
            transactions.map((tx) => (
              <Card key={tx.id}>
                <CardContent className="p-4 space-y-1">
                  <p>💰 ₹{tx.amount}</p>
                  <p>📅 {tx.date}</p>
                  <p>📝 {tx.description}</p>
                  <p>🏷️ {tx.category}</p>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Bar Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Monthly Expenses</h3>
          {monthlyData.length === 0 ? (
            <p className="text-gray-500">No data to show.</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </main>
  );
}
