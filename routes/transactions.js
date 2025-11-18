const express = require("express");
const router = express.Router();
const { pool } = require("../db");

// Fetch all with filtering
router.get("/transactions", async (req, res) => {
	try {
		const { type, month } = req.query;

		let query = "SELECT * FROM transactions WHERE 1=1";
		const params = [];
		let paramCount = 0;

		if (type) {
			paramCount++;
			query += ` AND transaction_type = $${paramCount}`;
			params.push(type);
		}

		if (month) {
			// month format: YYYY-MM - filter for that specific month only
			// Use EXTRACT to match year and month exactly
			const [year, monthNum] = month.split("-");
			paramCount++;
			query += ` AND EXTRACT(YEAR FROM date) = $${paramCount}`;
			params.push(parseInt(year));
			paramCount++;
			query += ` AND EXTRACT(MONTH FROM date) = $${paramCount}`;
			params.push(parseInt(monthNum));
		}

		query += " ORDER BY created_at DESC";

		const { rows } = await pool.query(query, params);
		res.json(rows);
	} catch (e) {
		res.status(500).json({ error: e.message });
	}
});

// Diagnostics: count rows
router.get("/transactions-count", async (_req, res) => {
	try {
		const { rows } = await pool.query("SELECT COUNT(*)::int AS count FROM transactions");
		res.json(rows[0]);
	} catch (e) {
		res.status(500).json({ error: e.message });
	}
});

// Monthly transaction summary for dashboard (must be before /:id route)
router.get("/transactions/monthly-summary", async (req, res) => {
	try {
		const { rows } = await pool.query(`
			SELECT 
				TO_CHAR(date, 'YYYY-MM') AS month,
				EXTRACT(YEAR FROM date) AS year,
				EXTRACT(MONTH FROM date) AS month_num,
				SUM(CASE WHEN transaction_type = 'income' THEN amount ELSE 0 END) AS income,
				SUM(CASE WHEN transaction_type = 'expense' THEN amount ELSE 0 END) AS expense
			FROM transactions
			WHERE date IS NOT NULL
			GROUP BY TO_CHAR(date, 'YYYY-MM'), EXTRACT(YEAR FROM date), EXTRACT(MONTH FROM date)
			ORDER BY year DESC, month_num DESC
			LIMIT 12
		`);
		res.json(rows);
	} catch (e) {
		res.status(500).json({ error: e.message });
	}
});

// Yearly transaction summary for dashboard (last 3 years)
router.get("/transactions/yearly-summary", async (req, res) => {
	try {
		const { rows } = await pool.query(`
			SELECT 
				EXTRACT(YEAR FROM date)::int AS year,
				COALESCE(SUM(CASE WHEN transaction_type = 'income' THEN amount ELSE 0 END), 0)::numeric AS income,
				COALESCE(SUM(CASE WHEN transaction_type = 'expense' THEN amount ELSE 0 END), 0)::numeric AS expense
			FROM transactions
			WHERE date IS NOT NULL
			GROUP BY EXTRACT(YEAR FROM date)
			ORDER BY year DESC
			LIMIT 3
		`);
		console.log("Yearly summary rows:", rows);
		res.json(rows);
	} catch (e) {
		console.error("Yearly summary error:", e);
		res.status(500).json({ error: e.message });
	}
});

// Weekly transaction summary for dashboard (latest week only)
router.get("/transactions/weekly-summary", async (req, res) => {
	try {
		// First check if there's any data with dates
		const maxDateResult = await pool.query(`
			SELECT MAX(date) AS max_date
			FROM transactions
			WHERE date IS NOT NULL
		`);
		
		if (!maxDateResult.rows[0]?.max_date) {
			return res.json([]);
		}
		
		// Get the latest week's transactions
		const { rows } = await pool.query(`
			SELECT 
				DATE_TRUNC('week', date) AS week_start,
				TO_CHAR(DATE_TRUNC('week', date), 'YYYY-MM-DD') AS week,
				EXTRACT(YEAR FROM date) AS year,
				EXTRACT(WEEK FROM date) AS week_num,
				COALESCE(SUM(CASE WHEN transaction_type = 'income' THEN amount ELSE 0 END), 0)::numeric AS income,
				COALESCE(SUM(CASE WHEN transaction_type = 'expense' THEN amount ELSE 0 END), 0)::numeric AS expense
			FROM transactions
			WHERE date IS NOT NULL
				AND DATE_TRUNC('week', date) = DATE_TRUNC('week', $1::date)
			GROUP BY DATE_TRUNC('week', date), EXTRACT(YEAR FROM date), EXTRACT(WEEK FROM date)
			ORDER BY week_start DESC
		`, [maxDateResult.rows[0].max_date]);
		console.log("Weekly summary rows:", rows);
		res.json(rows);
	} catch (e) {
		console.error("Weekly summary error:", e);
		res.status(500).json({ error: e.message });
	}
});

// Today transaction summary for dashboard
router.get("/transactions/today-summary", async (req, res) => {
	try {
		const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
		const { rows } = await pool.query(`
			SELECT 
				date::date AS day,
				TO_CHAR(date, 'YYYY-MM-DD') AS day_str,
				COALESCE(SUM(CASE WHEN transaction_type = 'income' THEN amount ELSE 0 END), 0)::numeric AS income,
				COALESCE(SUM(CASE WHEN transaction_type = 'expense' THEN amount ELSE 0 END), 0)::numeric AS expense
			FROM transactions
			WHERE date IS NOT NULL
				AND date::date = $1::date
			GROUP BY date::date
		`, [today]);
		res.json(rows);
	} catch (e) {
		console.error("Today summary error:", e);
		res.status(500).json({ error: e.message });
	}
});

// This month transaction summary for dashboard (aggregated total for current month)
router.get("/transactions/this-month-summary", async (req, res) => {
	try {
		const now = new Date();
		const year = now.getFullYear();
		const month = now.getMonth() + 1; // getMonth() returns 0-11
		
		const { rows } = await pool.query(`
			SELECT 
				EXTRACT(YEAR FROM date)::int AS year,
				EXTRACT(MONTH FROM date)::int AS month,
				TO_CHAR(date, 'YYYY-MM') AS month_str,
				COALESCE(SUM(CASE WHEN transaction_type = 'income' THEN amount ELSE 0 END), 0)::numeric AS income,
				COALESCE(SUM(CASE WHEN transaction_type = 'expense' THEN amount ELSE 0 END), 0)::numeric AS expense
			FROM transactions
			WHERE date IS NOT NULL
				AND EXTRACT(YEAR FROM date) = $1
				AND EXTRACT(MONTH FROM date) = $2
			GROUP BY EXTRACT(YEAR FROM date), EXTRACT(MONTH FROM date), TO_CHAR(date, 'YYYY-MM')
		`, [year, month]);
		
		// Always return at least one row with zeros if no data exists
		if (rows.length === 0) {
			return res.json([{
				year: year,
				month: month,
				month_str: `${year}-${String(month).padStart(2, '0')}`,
				income: 0,
				expense: 0
			}]);
		}
		
		res.json(rows);
	} catch (e) {
		console.error("This month summary error:", e);
		res.status(500).json({ error: e.message });
	}
});

// Top clients (income) and vendors (expenses) - must be before /:id route
router.get("/transactions/top-clients-vendors", async (req, res) => {
	try {
		const [topClients, topVendors] = await Promise.all([
			pool.query(`
				SELECT 
					client_vendor,
					COUNT(*)::int AS transaction_count,
					SUM(amount)::numeric AS total_amount
				FROM transactions
				WHERE transaction_type = 'income' 
					AND client_vendor IS NOT NULL 
					AND client_vendor != ''
				GROUP BY client_vendor
				ORDER BY total_amount DESC
				LIMIT 10
			`),
			pool.query(`
				SELECT 
					client_vendor,
					COUNT(*)::int AS transaction_count,
					SUM(amount)::numeric AS total_amount
				FROM transactions
				WHERE transaction_type = 'expense' 
					AND client_vendor IS NOT NULL 
					AND client_vendor != ''
				GROUP BY client_vendor
				ORDER BY total_amount DESC
				LIMIT 10
			`)
		]);

		res.json({
			topClients: topClients.rows || [],
			topVendors: topVendors.rows || [],
		});
	} catch (e) {
		res.status(500).json({ error: e.message });
	}
});

// Export to CSV (must be before /:id route)
router.get("/transactions/export", async (req, res) => {
	try {
		const { type, month } = req.query;

		let query = "SELECT * FROM transactions WHERE 1=1";
		const params = [];
		let paramCount = 0;

		if (type) {
			paramCount++;
			query += ` AND transaction_type = $${paramCount}`;
			params.push(type);
		}

		if (month) {
			// month format: YYYY-MM - filter for that specific month only
			const [year, monthNum] = month.split("-");
			paramCount++;
			query += ` AND EXTRACT(YEAR FROM date) = $${paramCount}`;
			params.push(parseInt(year));
			paramCount++;
			query += ` AND EXTRACT(MONTH FROM date) = $${paramCount}`;
			params.push(parseInt(monthNum));
		}

		query += " ORDER BY created_at DESC";

		const { rows } = await pool.query(query, params);

		// Generate CSV
		const headers = [
			"Date",
			"Type",
			"Category",
			"Subcategory",
			"Description",
			"Client/Vendor",
			"Invoice Number",
			"Amount",
			"Payment Mode",
			"Payment Status",
			"Remarks",
		];

		const csvRows = [
			headers.join(","),
			...rows.map(row => [
				row.date || "",
				row.transaction_type || "",
				row.category || "",
				row.sub_category || "",
				`"${(row.description || "").replace(/"/g, '""')}"`,
				row.client_vendor || "",
				row.invoice_number || "",
				row.amount || "",
				row.payment_mode || "",
				row.payment_status || "",
				`"${(row.remarks || "").replace(/"/g, '""')}"`,
			].join(",")),
		];

		const csv = csvRows.join("\n");
		const filename = `transactions_${month || new Date().toISOString().split("T")[0]}.csv`;

		res.setHeader("Content-Type", "text/csv");
		res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
		res.send(csv);
	} catch (e) {
		res.status(500).json({ error: e.message });
	}
});

// Fetch one (must be after all specific routes like yearly-summary, weekly-summary, etc.)
router.get("/transactions/:id", async (req, res) => {
	try {
		const { id } = req.params;
		// Only process if id is numeric (to avoid matching routes like "yearly-summary")
		if (!/^\d+$/.test(id)) {
			return res.status(404).json({ error: "Not found" });
		}
		const { rows } = await pool.query(
			"SELECT * FROM transactions WHERE transaction_id = $1",
			[id]
		);
		if (!rows[0]) return res.status(404).json({ error: "Not found" });
		res.json(rows[0]);
	} catch (e) {
		res.status(500).json({ error: e.message });
	}
});

// Create
router.post("/transactions", async (req, res) => {
	try {
		// eslint-disable-next-line no-console
		console.log("[POST /transactions] payload:", req.body);
		const {
			user_id,
			transaction_type,
			date,
			category,
			sub_category,
			description,
			client_vendor,
			invoice_number,
			amount,
			payment_mode,
			payment_status,
			remarks,
		} = req.body;

		const amountStr = String(amount ?? "").trim();
		const isValid = /^[0-9]{1,20}(\.[0-9]{1,2})?$/.test(amountStr) && !/^0+(\.0+)?$/.test(amountStr);
		if (!transaction_type || !isValid) {
			return res.status(400).json({ error: "Amount must be a positive number with up to 20 digits and 2 decimals" });
		}

		const { rows } = await pool.query(
			`INSERT INTO transactions
      (user_id, transaction_type, date, category, sub_category, description, client_vendor, invoice_number, amount, payment_mode, payment_status, remarks)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
      RETURNING *`,
			[
				user_id || null,
				transaction_type,
				date || null,
				category || null,
				sub_category || null,
				description || null,
				client_vendor || null,
				invoice_number || null,
				amountStr,
				payment_mode || null,
				payment_status || null,
				remarks || null,
			]
		);
		// eslint-disable-next-line no-console
		console.log("[POST /transactions] inserted:", rows[0]?.transaction_id);
		res.status(201).json(rows[0]);
	} catch (e) {
		// eslint-disable-next-line no-console
		console.error("[POST /transactions] error:", e);
		res.status(500).json({ error: e.message });
	}
});

// Update
router.put("/transactions/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const {
			user_id,
			transaction_type,
			date,
			category,
			sub_category,
			description,
			client_vendor,
			invoice_number,
			amount,
			payment_mode,
			payment_status,
			remarks,
		} = req.body;

		const amountStr = amount == null || amount === "" ? null : String(amount).trim();
		if (amountStr != null) {
			const isValid = /^[0-9]{1,20}(\.[0-9]{1,2})?$/.test(amountStr) && !/^0+(\.0+)?$/.test(amountStr);
			if (!isValid) {
				return res.status(400).json({ error: "Amount must be a positive number with up to 20 digits and 2 decimals" });
			}
		}

		const { rows } = await pool.query(
			`UPDATE transactions SET
        user_id=$1, transaction_type=$2, date=$3, category=$4, sub_category=$5, description=$6,
        client_vendor=$7, invoice_number=$8, amount=$9, payment_mode=$10, payment_status=$11, remarks=$12
       WHERE transaction_id=$13
       RETURNING *`,
			[
				user_id || null,
				transaction_type || null,
				date || null,
				category || null,
				sub_category || null,
				description || null,
				client_vendor || null,
				invoice_number || null,
				amountStr,
				payment_mode || null,
				payment_status || null,
				remarks || null,
				id,
			]
		);
		if (!rows[0]) return res.status(404).json({ error: "Not found" });
		res.json(rows[0]);
	} catch (e) {
		res.status(500).json({ error: e.message });
	}
});

// Delete
router.delete("/transactions/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const result = await pool.query("DELETE FROM transactions WHERE transaction_id=$1", [id]);
		if (result.rowCount === 0) return res.status(404).json({ error: "Not found" });
		res.json({ ok: true });
	} catch (e) {
		res.status(500).json({ error: e.message });
	}
});

// Recent last 3
router.get("/transactions-recent", async (_req, res) => {
	try {
		const { rows } = await pool.query(
			"SELECT date, transaction_type, description, amount FROM transactions ORDER BY created_at DESC LIMIT 3"
		);
		res.json(rows);
	} catch (e) {
		res.status(500).json({ error: e.message });
	}
});

// Client/vendor suggestions
router.get("/client-vendor/suggest", async (_req, res) => {
	try {
		const { rows } = await pool.query(
			"SELECT DISTINCT client_vendor FROM transactions WHERE client_vendor IS NOT NULL ORDER BY client_vendor LIMIT 10"
		);
		res.json(rows.map(r => r.client_vendor));
	} catch (e) {
		res.status(500).json({ error: e.message });
	}
});

module.exports = router;


