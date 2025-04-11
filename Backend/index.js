// File: BE-Tabungan/index.js
const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

const app = express();
app.use(cors());
app.use(express.json());

// Inisialisasi database SQLite
const db = new sqlite3.Database("tabungan.db");

db.serialize(() => {
  // Buat tabel transaksi
  db.run(`CREATE TABLE IF NOT EXISTS transaksi (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nama TEXT,
    jumlah INTEGER,
    tanggal TEXT
  )`);

  // Buat tabel target
  db.run(`CREATE TABLE IF NOT EXISTS target (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nama TEXT,
    jumlah INTEGER
  )`);
});

// Endpoint Transaksi
app.get("/api/transaksi", (req, res) => {
  db.all("SELECT * FROM transaksi", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post("/api/transaksi", (req, res) => {
  const { nama, jumlah, tanggal } = req.body;
  db.run(
    "INSERT INTO transaksi (nama, jumlah, tanggal) VALUES (?, ?, ?)",
    [nama, jumlah, tanggal],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
    }
  );
});

// Endpoint Target
app.get("/api/target", (req, res) => {
  db.all("SELECT * FROM target", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post("/api/target", (req, res) => {
  const { nama, jumlah } = req.body;
  db.run(
    "INSERT INTO target (nama, jumlah) VALUES (?, ?)",
    [nama, jumlah],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
    }
  );
});

app.put("/api/target/:id", (req, res) => {
  const { jumlah } = req.body;
  db.run(
    "UPDATE target SET jumlah = ? WHERE id = ?",
    [jumlah, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ updated: this.changes });
    }
  );
});

// Endpoint Saldo
app.get("/api/saldo", (req, res) => {
  db.get("SELECT SUM(jumlah) AS saldo FROM transaksi", [], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(row);
  });
});

// Endpoint Jadwal Transaksi
app.get("/api/jadwal", (req, res) => {
  db.all("SELECT tanggal, COUNT(*) AS jumlah_transaksi FROM transaksi GROUP BY tanggal", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server BE-Tabungan berjalan di http://localhost:${PORT}`);
});
