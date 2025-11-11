const express = require("express");
const router = express.Router();
const { pool } = require("../db");

router.get("/categories", async (req, res) => {
	try {
		const { type } = req.query;
		if (type && !["income", "expense"].includes(type)) {
			return res.status(400).json({ error: "Invalid type" });
		}
		const sql =
			type
				? "SELECT category_id, name, type FROM categories WHERE type = $1 ORDER BY name"
				: "SELECT category_id, name, type FROM categories ORDER BY name";
		const params = type ? [type] : [];
		const { rows } = await pool.query(sql, params);
		res.json(rows);
	} catch (e) {
		res.status(500).json({ error: e.message });
	}
});

router.get("/subcategories/:category_id", async (req, res) => {
	try {
		const { category_id } = req.params;
		const { rows } = await pool.query(
			"SELECT sub_id, category_id, name FROM subcategories WHERE category_id = $1 ORDER BY name",
			[category_id]
		);
		res.json(rows);
	} catch (e) {
		res.status(500).json({ error: e.message });
	}
});

module.exports = router;


