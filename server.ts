import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import Database from "better-sqlite3";

const db = new Database("hr_system.db");

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS candidates (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT,
    experience TEXT,
    email TEXT,
    phone TEXT,
    status TEXT,
    priority TEXT,
    score INTEGER,
    createdAt INTEGER,
    notes TEXT
  );

  CREATE TABLE IF NOT EXISTS employees (
    id TEXT PRIMARY KEY,
    data TEXT NOT NULL,
    updatedAt INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS attendance (
    date TEXT PRIMARY KEY,
    data TEXT NOT NULL,
    updatedAt INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS app_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updatedAt INTEGER NOT NULL
  );
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));

  // API Routes
  app.get("/api/candidates", (req, res) => {
    try {
      const candidates = db.prepare("SELECT * FROM candidates ORDER BY createdAt DESC").all();
      res.json(candidates);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch candidates" });
    }
  });

  app.post("/api/candidates", (req, res) => {
    const { id, name, role, experience, email, phone, status, priority, score, createdAt, notes } = req.body;
    try {
      const stmt = db.prepare(`
        INSERT OR REPLACE INTO candidates 
        (id, name, role, experience, email, phone, status, priority, score, createdAt, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      stmt.run(id, name, role, experience, email, phone, status, priority, score, createdAt, notes);
      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to save candidate" });
    }
  });

  app.delete("/api/candidates/:id", (req, res) => {
    const { id } = req.params;
    try {
      db.prepare("DELETE FROM candidates WHERE id = ?").run(id);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete candidate" });
    }
  });

  // Employees Sync
  app.get("/api/employees", (req, res) => {
    try {
      const employees = db.prepare("SELECT * FROM employees").all();
      res.json(employees.map(e => JSON.parse(e.data)));
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch employees" });
    }
  });

  app.post("/api/employees", (req, res) => {
    const { employees } = req.body;
    try {
      const stmt = db.prepare("INSERT OR REPLACE INTO employees (id, data, updatedAt) VALUES (?, ?, ?)");
      const transaction = db.transaction((emps) => {
        for (const emp of emps) {
          stmt.run(emp.id, JSON.stringify(emp), Date.now());
        }
      });
      transaction(employees);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Failed to sync employees" });
    }
  });

  // Attendance Sync
  app.get("/api/attendance", (req, res) => {
    try {
      const attendance = db.prepare("SELECT * FROM attendance").all();
      const result = {};
      attendance.forEach(row => {
        result[row.date] = JSON.parse(row.data);
      });
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch attendance" });
    }
  });

  app.post("/api/attendance", (req, res) => {
    const { attendance } = req.body;
    try {
      const stmt = db.prepare("INSERT OR REPLACE INTO attendance (date, data, updatedAt) VALUES (?, ?, ?)");
      const transaction = db.transaction((data) => {
        for (const date in data) {
          stmt.run(date, JSON.stringify(data[date]), Date.now());
        }
      });
      transaction(attendance);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Failed to sync attendance" });
    }
  });

  // Settings Sync
  app.get("/api/settings", (req, res) => {
    try {
      const settings = db.prepare("SELECT * FROM app_settings").all();
      const result = {};
      settings.forEach(row => {
        result[row.key] = JSON.parse(row.value);
      });
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch settings" });
    }
  });

  app.post("/api/settings", (req, res) => {
    const { settings } = req.body;
    try {
      const stmt = db.prepare("INSERT OR REPLACE INTO app_settings (key, value, updatedAt) VALUES (?, ?, ?)");
      const transaction = db.transaction((data) => {
        for (const key in data) {
          stmt.run(key, JSON.stringify(data[key]), Date.now());
        }
      });
      transaction(settings);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Failed to sync settings" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
