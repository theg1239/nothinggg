# Pokymono MCP Server with GitHub Integration

This project implements an MCP (Model Context Protocol) server with GitHub API integration.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up GitHub token using one of these methods:

   ### Method 1: Environment Variable (recommended for development)
   
   **For macOS/Linux:**
   ```bash
   export GITHUB_TOKEN=your_github_personal_access_token
   npm start
   ```
   
   **For Windows Command Prompt:**
   ```cmd
   set GITHUB_TOKEN=your_github_personal_access_token
   npm start
   ```
   
   **For Windows PowerShell:**
   ```powershell
   $env:GITHUB_TOKEN="your_github_personal_access_token"
   npm start
   ```

   ### Method 2: Create a .env file (recommended for development)
   
   Create a file named `.env` in the project root directory with the following content:
   ```
   GITHUB_TOKEN=your_github_personal_access_token
   ```
   
   ### Method 3: Set in deployment environment (recommended for production)
   
   If deploying to a server, set the environment variable in your deployment platform settings.

3. Build and start the server:
```bash
npm run build
npm start
```

## GitHub Integration

This MCP server provides the following GitHub integration tools:

- `github_search`: Search GitHub repositories based on a query
- `github_create_issue`: Create issues in GitHub repositories

### Creating a GitHub Personal Access Token

1. Go to GitHub Settings > Developer settings > Personal access tokens
2. Generate a new token with appropriate permissions (at minimum: `repo` scope)
3. Store the token securely and use it as the `GITHUB_TOKEN` environment variable

## Available Tools

- `get_weather`: Get weather information for a city
- `get_quote`: Generate a random inspirational quote
- `github_search`: Search for repositories on GitHub
- `github_create_issue`: Create an issue in a GitHub repository

## MCP Protocol

This server implements the Model Context Protocol, allowing it to be used with compatible clients.