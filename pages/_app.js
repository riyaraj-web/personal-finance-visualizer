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
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

// Predefined categories
const categories = ["Food", "Rent", "Transport", "Shopping", "Entertainment", "Other"];

export default function Home() {
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState({
    amount: "",
    date: "",
    description: "",
    category: "",
  });

  const [budgets, setBudgets] = useState(
    categories.reduce((acc, cat) => {
      acc[cat] = "";
      return acc;
    }, {})
  );

  // Group transactions by month
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

  // Category-wise aggregation
  const categoryData = categories
    .map((category) => {
      const total = transactions
        .filter((tx) => tx.category === category)
        .reduce((sum, tx) => sum + parseFloat(tx.amount), 0);
      return { name: category, value: total };
    })
    .filter((item) => item.value > 0);

  // Budget comparison data
  const budgetComparisonData = categories.map((cat) => ({
    category: cat,
    Budget: parseFloat(budgets[cat]) || 0,
    Spent: categoryData.find((c) => c.name === cat)?.value || 0,
  }));

  // Form handlers
  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
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
      <div className="max-w-xl mx-auto space-y-8">
        {/* Transaction Form */}
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

        {/* Budget Inputs */}
        <Card>
          <CardContent className="space-y-4 p-6">
            <h2 className="text-xl font-semibold">Set Monthly Budgets</h2>
            {categories.map((cat) => (
              <div key={cat} className="flex items-center gap-2">
                <Label className="w-1/3">{cat}</Label>
                <Input
                  type="number"
                  value={budgets[cat]}
                  onChange={(e) =>
                    setBudgets((prev) => ({ ...prev, [cat]: e.target.value }))
                  }
                  placeholder="Enter budget"
                  className="w-2/3"
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-gray-600">Total Expenses</p>
              <p className="text-2xl font-semibold text-red-600">
                ₹
                {transactions.reduce(
                  (sum, tx) => sum + parseFloat(tx.amount),
                  0
                ).toFixed(2)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <p className="text-gray-600">Recent Transaction</p>
              {transactions.length > 0 ? (
                <>
                  <p className="text-sm">
                    {transactions[transactions.length - 1].description}
                  </p>
                  <p className="text-sm text-gray-500">
                    {transactions[transactions.length - 1].date}
                  </p>
                </>
              ) : (
                <p className="text-sm text-gray-500">No data</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <p className="text-gray-600">Top Category</p>
              {categoryData.length > 0 ? (
                <p className="text-sm font-medium">
                  {
                    categoryData.reduce(
                      (top, item) => (item.value > top.value ? item : top),
                      categoryData[0]
                    ).name
                  }
                </p>
              ) : (
                <p className="text-sm text-gray-500">No data</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Budget vs Actual Bar Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Budget vs Actual</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={budgetComparisonData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Budget" fill="#82ca9d" />
              <Bar dataKey="Spent" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Expenses Chart */}
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

     {/* Spending Insights */}
     <div className="bg-white rounded-lg shadow p-6 mt-6">
     <h3 className="text-lg font-semibold mb-4">Spending Insights</h3>
     <div className="space-y-3">
    {categories.map((cat) => {
      const actual = transactions
        .filter((tx) => tx.category === cat)
        .reduce((sum, tx) => sum + parseFloat(tx.amount), 0);
      const budget = parseFloat(budgets[cat]) || 0;
      const difference = budget - actual;
      const isOver = actual > budget;

      return (
        <div
          key={cat}
          className={`border-l-4 p-4 rounded bg-gray-50 ${
            isOver ? "border-red-500" : "border-green-500"
          }`}
        >
          <p className="font-medium">{cat}</p>
          <p className="text-sm">
            {isOver ? (
              <span className="text-red-600">
                Over Budget by ₹{Math.abs(difference).toFixed(2)}
              </span>
            ) : (
              <span className="text-green-600">
                Under Budget by ₹{difference.toFixed(2)}
              </span>
            )}
          </p>
        </div>
      );
    })}
  </div>
</div>
        {/* Category-wise Pie Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Category Breakdown</h3>
          {categoryData.length === 0 ? (
            <p className="text-gray-500">No category data to display.</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        [
                          "#8884d8",
                          "#82ca9d",
                          "#ffc658",
                          "#ff7f50",
                          "#a29bfe",
                          "#f8c291",
                        ][index % 6]
                      }
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </main>
  );
}
