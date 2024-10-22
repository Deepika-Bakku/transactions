// routes/transactions.js

const express = require('express');
const router = express.Router();
const db = require('../db/database');

// POST /transactions - Add a new transaction
router.post('/', (req, res) => {
  const { type, category, amount, date, description } = req.body;
  const query = `INSERT INTO transactions (type, category, amount, date, description) VALUES (?, ?, ?, ?, ?)`;
  db.run(query, [type, category, amount, date, description], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: this.lastID });
  });
});

// GET /transactions - Retrieve all transactions
router.get('/', (req, res) => {
  const query = `SELECT * FROM transactions`;
  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
  
    res.json(rows);
  });
});

// GET /transactions/:id - Retrieve a transaction by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const query = `SELECT * FROM transactions WHERE id = ?`;
  db.get(query, [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.json(row);
  });
});

// PUT /transactions/:id - Update a transaction by ID
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { type, category, amount, date, description } = req.body;
  const query = `UPDATE transactions SET type = ?, category = ?, amount = ?, date = ?, description = ? WHERE id = ?`;
  db.run(query, [type, category, amount, date, description, id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.json({ message: 'Transaction updated successfully' });
  });
});

// DELETE /transactions/:id - Delete a transaction by ID
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const query = `DELETE FROM transactions WHERE id = ?`;
  db.run(query, [id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.json({ message: 'Transaction deleted successfully' });
  });
});



module.exports = router;
