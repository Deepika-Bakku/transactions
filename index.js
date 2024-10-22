// index.js

const express = require('express');
const db = require('./db/database');
const transactionRoutes = require('./routes/transactions');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

app.get('/summary', (req, res) => {
  const { startDate, endDate, category } = req.query; // Get optional query parameters

  // Base query to calculate total income and expenses
  let query = `
    SELECT
      SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS total_income,
      SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS total_expense
    FROM transactions
  `;

  // Add conditions for date range and category if provided
  const conditions = [];
  if (startDate) {
    conditions.push(`date >= ?`);
  }
  if (endDate) {
    conditions.push(`date <= ?`);
  }
  if (category) {
    conditions.push(`category = ?`);
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  const params = [];
  if (startDate) params.push(startDate);
  if (endDate) params.push(endDate);
  if (category) params.push(category);

  db.get(query, params, (err, row) => { // Execute the query
    if (err) {
      return res.status(500).json({ error: err.message }); // Handle SQL errors
    }

    const totalIncome = row.total_income || 0; // Handle null values
    const totalExpense = row.total_expense || 0; // Handle null values
    const balance = totalIncome - totalExpense; // Calculate balance

    res.json({
      total_income: totalIncome,
      total_expense: totalExpense,
      balance: balance
    }); // Return the summary
  });
});

// Routes
app.use('/transactions', transactionRoutes);

// Server Listening
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});