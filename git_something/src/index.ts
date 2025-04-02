#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

// Load environment variables from .env file
dotenv.config();

import { createServer } from "./server.js";

// App version - can be overridden by environment variable
const APP_VERSION = process.env.APP_VERSION || '0.1.0';

// Path to static assets (for serving frontend files like favicon)
const STATIC_ASSETS_PATH = process.env.STATIC_ASSETS_PATH || path.join(__dirname, '../public');

async function main() {
  // Check for GitHub token and warn if not present
  if (!process.env.GITHUB_TOKEN) {
    console.warn('WARNING: GITHUB_TOKEN environment variable is not set. GitHub-related features will not work properly.');
    console.warn('Set the GITHUB_TOKEN environment variable or create a .env file in the project root.');
  }
  
  // Log the app version and static assets path for debugging
  console.debug(`Pokymono Server v${APP_VERSION}`);
  console.debug(`Static assets path: ${STATIC_ASSETS_PATH}`);
  
  // Check if the static assets directory exists
  if (fs.existsSync(STATIC_ASSETS_PATH)) {
    console.debug("Static assets directory found.");
  } else {
    console.warn("Static assets directory not found. Frontend assets won't be served.");
  }
  
  const server: McpServer = createServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.debug("pokymono running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
