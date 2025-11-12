// Vercel serverless function wrapper for Express API
const app = require("../index.js");

// Vercel expects a default export function
module.exports = (req, res) => {
	// Remove /api prefix for Express routes
	if (req.url.startsWith("/api/")) {
		req.url = req.url.replace("/api", "");
	}
	return app(req, res);
};
