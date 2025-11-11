const express = require("express");
const router = express.Router();
const { pool } = require("../db");

// Fetch all
router.get("/transactions", async (_req, res) => {
	try {
		const { rows } = await pool.query(
			"SELECT * FROM transactions ORDER BY created_at DESC"
		);
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

// Fetch one
router.get("/transactions/:id", async (req, res) => {
	try {
		const { id } = req.params;
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


