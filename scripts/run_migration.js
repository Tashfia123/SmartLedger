require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
	ssl: process.env.DATABASE_URL?.includes('sslmode=require') ? { rejectUnauthorized: false } : false
});

async function runMigration() {
	const client = await pool.connect();
	try {
		console.log('Running migration to add liability and asset support...');
		
		const migrationSQL = fs.readFileSync(
			path.join(__dirname, '../sql/migration_add_liability_asset.sql'),
			'utf8'
		);
		
		await client.query('BEGIN');
		await client.query(migrationSQL);
		await client.query('COMMIT');
		
		console.log('Migration completed successfully!');
		console.log('Liability and asset transaction types are now supported.');
	} catch (error) {
		await client.query('ROLLBACK');
		console.error('Migration failed:', error.message);
		process.exit(1);
	} finally {
		client.release();
		await pool.end();
	}
}

runMigration();

