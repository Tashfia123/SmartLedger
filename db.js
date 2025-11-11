const { Pool } = require("pg");

const databaseUrl = process.env.DATABASE_URL;

// Guard: provide clearer message if env is missing
if (!databaseUrl) {
	console.warn("Warning: DATABASE_URL is not set. Database features will be unavailable.");
}

const pool = databaseUrl
	? new Pool({
			connectionString: databaseUrl,
			// Neon typically requires SSL; NODE env may already respect this via connection string
		})
	: null;

if (pool) {
	// Surface unexpected errors from the pool
	pool.on("error", (err) => {
		// eslint-disable-next-line no-console
		console.error("[pg pool] unexpected error:", err);
	});
}

async function checkDatabaseConnection() {
	if (!pool) {
		return { ok: false, error: "DATABASE_URL not configured" };
	}
	try {
		const result = await pool.query("SELECT 1 as ok");
		return { ok: true, result: result.rows[0] };
	} catch (error) {
		return { ok: false, error: error.message };
	}
}

module.exports = {
	pool,
	checkDatabaseConnection,
};


