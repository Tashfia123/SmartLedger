// Vercel serverless function wrapper for Express API
const serverlessExpress = require("@vendia/serverless-express");
const app = require("../index.js");

// Wrap Express app for Vercel serverless
const handler = serverlessExpress({ app });

module.exports = handler;
