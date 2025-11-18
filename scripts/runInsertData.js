require("dotenv").config();
const { pool } = require("../db");
const fs = require("fs");
const path = require("path");

async function runInsertData() {
	const client = await pool.connect();
	try {
		const sqlFile = path.join(__dirname, "../insert_2025_data.sql");
		const sql = fs.readFileSync(sqlFile, "utf8");
		
		console.log("Inserting test data for 2025 (Jan-Nov)...");
		await client.query(sql);
		console.log("✅ Successfully inserted all transactions!");
		console.log("   - January through November 2025");
		console.log("   - Both income and expense types");
	} catch (error) {
		console.error("❌ Error:", error.message);
		process.exit(1);
	} finally {
		client.release();
		await pool.end();
	}
}

runInsertData();

