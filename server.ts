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
  )
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

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
