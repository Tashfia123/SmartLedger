// Vercel serverless function wrapper for Express API
const app = require("../index.js");

module.exports = (req, res) => {
	// Vercel provides req, res - Express handles it
	return app(req, res);
};

