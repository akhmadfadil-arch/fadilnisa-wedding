const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_PATH = path.join(__dirname, 'db.json');

app.use(cors());
app.use(bodyParser.json());

function readDB() {
  try {
    const raw = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    return { entries: [] };
  }
}

function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
}

// Health
app.get('/api/health', (req, res) => res.json({ ok: true }));

// Get entries (optional ?type=guestbook or ?type=rsvp)
app.get('/api/entries', (req, res) => {
  const db = readDB();
  const type = req.query.type;
  let entries = Array.isArray(db.entries) ? db.entries : [];
  if (type) entries = entries.filter((e) => e.type === type);
  // return newest first
  entries = entries.slice().reverse();
  res.json(entries);
});

// Post entry
app.post('/api/entries', (req, res) => {
  const db = readDB();
  const payload = req.body || {};
  const entry = Object.assign({}, payload, { createdAt: new Date().toISOString() });
  if (!Array.isArray(db.entries)) db.entries = [];
  db.entries.push(entry);
  writeDB(db);
  res.json({ ok: true, entry });
});

// Summary (rsvp counts)
app.get('/api/summary', (req, res) => {
  const db = readDB();
  const entries = Array.isArray(db.entries) ? db.entries : [];
  const rsvps = entries.filter((e) => e.type === 'rsvp');
  const hadir = rsvps.filter((r) => r.status === 'Insya Allah Hadir').length;
  const belum = rsvps.filter((r) => r.status === 'Belum Pasti').length;
  const tidak = rsvps.filter((r) => r.status === 'Maaf Tidak Bisa Hadir').length;
  res.json({ hadir, belum, tidak });
});

app.listen(PORT, () => {
  console.log(`Wedding API server running on http://localhost:${PORT}`);
});
