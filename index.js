const path = require("path");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables if a .env file exists
dotenv.config();

const { checkDatabaseConnection } = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

// Simple request logger (method + url)
app.use((req, _res, next) => {
	// eslint-disable-next-line no-console
	console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
	next();
});

// Serve static frontend from /public
const publicDir = path.join(__dirname, "public");
app.use(express.static(publicDir));

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// DB health check
app.get("/api/health/db", async (_req, res) => {
  const status = await checkDatabaseConnection();
  if (status.ok) {
    return res.json({ status: "ok" });
  }
  return res.status(500).json({ status: "error", error: status.error });
});

// API routes
const categoriesRouter = require("./routes/categories");
const transactionsRouter = require("./routes/transactions");
app.use("/api", categoriesRouter);
app.use("/api", transactionsRouter);

// Fallback to index.html for non-API routes only (SPA support)
app.use((req, res, next) => {
	if (req.path.startsWith("/api")) {
		return res.status(404).json({ error: "Not found" });
	}
	res.sendFile(path.join(publicDir, "index.html"));
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on http://localhost:${PORT}`);
});


