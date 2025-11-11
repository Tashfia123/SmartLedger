const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();
const { pool } = require("../db");

async function runSqlFile(filePath) {
	const sql = fs.readFileSync(filePath, "utf-8");
	await pool.query(sql);
}

async function main() {
	try {
		const schemaPath = path.join(__dirname, "..", "sql", "schema.sql");
		const seedPath = path.join(__dirname, "..", "sql", "seed.sql");
		await runSqlFile(schemaPath);
		await runSqlFile(seedPath);
		console.log("Database initialized (schema + seed).");
		process.exit(0);
	} catch (err) {
		console.error("Init failed:", err);
		process.exit(1);
	}
}

main();


