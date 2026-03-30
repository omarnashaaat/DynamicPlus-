import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("hr_system.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS employees (
    id TEXT PRIMARY KEY,
    code TEXT UNIQUE,
    name TEXT,
    jobTitle TEXT,
    department TEXT,
    status TEXT,
    joinDate TEXT,
    nationalId TEXT,
    phone TEXT,
    address TEXT,
    baseSalary REAL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS attendance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employeeId TEXT,
    date TEXT,
    arrivalTime TEXT,
    departureTime TEXT,
    deduction REAL DEFAULT 0,
    notes TEXT,
    UNIQUE(employeeId, date)
  );

  CREATE TABLE IF NOT EXISTS candidates (
    id TEXT PRIMARY KEY,
    name TEXT,
    role TEXT,
    email TEXT,
    phone TEXT,
    status TEXT,
    priority TEXT,
    score INTEGER,
    createdAt INTEGER,
    notes TEXT
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  );
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));

  // API Routes
  app.get("/api/employees", (req, res) => {
    const employees = db.prepare("SELECT * FROM employees").all();
    res.json(employees);
  });

  app.post("/api/employees", (req, res) => {
    const { employees } = req.body;
    if (Array.isArray(employees)) {
      // Deduplicate by code to prevent UNIQUE constraint errors
      const uniqueEmployees: any[] = [];
      const seenCodes = new Set();
      for (const emp of employees) {
        if (!seenCodes.has(emp.code)) {
          uniqueEmployees.push(emp);
          seenCodes.add(emp.code);
        }
      }

      const stmt = db.prepare(`
        INSERT INTO employees (id, code, name, jobTitle, department, status, joinDate, nationalId, phone, address, baseSalary)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          code = excluded.code,
          name = excluded.name,
          jobTitle = excluded.jobTitle,
          department = excluded.department,
          status = excluded.status,
          joinDate = excluded.joinDate,
          nationalId = excluded.nationalId,
          phone = excluded.phone,
          address = excluded.address,
          baseSalary = excluded.baseSalary
      `);
      
      db.transaction(() => {
        if (uniqueEmployees.length > 0) {
          const placeholders = uniqueEmployees.map(() => '?').join(',');
          db.prepare(`DELETE FROM employees WHERE id NOT IN (${placeholders})`).run(...uniqueEmployees.map(e => e.id));
        } else {
          db.prepare("DELETE FROM employees").run();
        }
        
        for (const emp of uniqueEmployees) {
          stmt.run(emp.id, emp.code, emp.name, emp.jobTitle, emp.department, emp.status, emp.joinDate, emp.nationalId, emp.phone, emp.address, emp.baseSalary || 0);
        }
      })();
      res.json({ success: true });
    } else {
      res.status(400).json({ error: "Expected an array of employees" });
    }
  });

  // Attendance
  app.get("/api/attendance", (req, res) => {
    const records = db.prepare("SELECT * FROM attendance").all();
    const formatted: any = {};
    records.forEach((r: any) => {
      if (!formatted[r.date]) formatted[r.date] = {};
      formatted[r.date][r.employeeId] = {
        arrivalTime: r.arrivalTime,
        departureTime: r.departureTime,
        deduction: r.deduction,
        notes: r.notes
      };
    });
    res.json(formatted);
  });

  app.post("/api/attendance", (req, res) => {
    const { attendance } = req.body;
    if (typeof attendance === 'object' && attendance !== null) {
      const stmt = db.prepare(`
        INSERT INTO attendance (employeeId, date, arrivalTime, departureTime, deduction, notes)
        VALUES (?, ?, ?, ?, ?, ?)
        ON CONFLICT(employeeId, date) DO UPDATE SET
          arrivalTime = excluded.arrivalTime,
          departureTime = excluded.departureTime,
          deduction = excluded.deduction,
          notes = excluded.notes
      `);
      
      db.transaction(() => {
        db.prepare("DELETE FROM attendance").run();
        
        for (const [date, records] of Object.entries(attendance)) {
          for (const [employeeId, record] of Object.entries(records as Record<string, any>)) {
            stmt.run(employeeId, date, record.arrivalTime, record.departureTime, record.deduction || 0, record.notes || '');
          }
        }
      })();
      res.json({ success: true });
    } else {
      res.status(400).json({ error: "Expected an attendance object" });
    }
  });

  // Settings
  app.get("/api/settings", (req, res) => {
    const records = db.prepare("SELECT * FROM settings").all();
    const settings: any = {};
    records.forEach((r: any) => {
      try {
        settings[r.key] = JSON.parse(r.value);
      } catch {
        settings[r.key] = r.value;
      }
    });
    res.json(settings);
  });

  app.post("/api/settings", (req, res) => {
    const { settings } = req.body;
    if (typeof settings === 'object' && settings !== null) {
      const stmt = db.prepare(`
        INSERT INTO settings (key, value) VALUES (?, ?)
        ON CONFLICT(key) DO UPDATE SET value = excluded.value
      `);
      
      db.transaction(() => {
        for (const [key, value] of Object.entries(settings)) {
          stmt.run(key, typeof value === 'string' ? value : JSON.stringify(value));
        }
      })();
      res.json({ success: true });
    } else {
      res.status(400).json({ error: "Expected a settings object" });
    }
  });

  // Candidates
  app.get("/api/candidates", (req, res) => {
    const candidates = db.prepare("SELECT * FROM candidates ORDER BY createdAt DESC").all();
    res.json(candidates);
  });

  app.post("/api/candidates", (req, res) => {
    const { id, name, role, email, phone, status, priority, score, createdAt, notes } = req.body;
    db.prepare(`
      INSERT INTO candidates (id, name, role, email, phone, status, priority, score, createdAt, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        role = excluded.role,
        email = excluded.email,
        phone = excluded.phone,
        status = excluded.status,
        priority = excluded.priority,
        score = excluded.score,
        notes = excluded.notes
    `).run(id, name, role, email, phone, status, priority, score, createdAt, notes);
    res.json({ success: true });
  });

  app.delete("/api/candidates/:id", (req, res) => {
    db.prepare("DELETE FROM candidates WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
