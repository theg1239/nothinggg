// import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import dotenv from 'dotenv';
// import express from 'express';
// import cors from 'cors';
// import { createServer } from './server.js';

// // Initialize environment variables
// dotenv.config();

// // Initialize Gemini API
// const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
// if (!GEMINI_API_KEY) {
//   console.error("GEMINI_API_KEY is required in environment variables");
//   process.exit(1);
// }

// const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
// const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// // Initialize MCP server with tools
// const server = createServer();

// // Analyze command to determine the most appropriate tool
// async function analyzeCommand(command: string): Promise<{
//   toolName: string;
//   params: Record<string, any>;
// }> {
//   // Create a prompt to analyze the command
//   const prompt = `
// Based on the following command, identify the most appropriate GitHub or git tool to use and extract parameters.
// Command: "${command}"

// Available tools:
// ${server.registry.tools.map(tool => `- ${tool.name}: ${tool.description}`).join('\n')}

// Respond in this JSON format only:
// {
//   "toolName": "tool_name_here",
//   "params": {
//     "param1": "value1",
//     "param2": "value2"
//   }
// }
// `;

//   // Get response from Gemini
//   const result = await model.generateContent(prompt);
//   const response = result.response;
//   const text = response.text();
  
//   try {
//     // Extract JSON from the response (handling potential text before/after JSON)
//     const jsonMatch = text.match(/\{[\s\S]*\}/);
//     if (!jsonMatch) throw new Error("No valid JSON found in response");
    
//     const parsedResponse = JSON.parse(jsonMatch[0]);
//     return {
//       toolName: parsedResponse.toolName,
//       params: parsedResponse.params || {}
//     };
//   } catch (error) {
//     console.error("Failed to parse Gemini response:", error);
//     if (error instanceof Error) {
//       throw new Error(`Could not determine appropriate tool: ${error.message}`);
//     } else {
//       throw new Error("Could not determine appropriate tool due to an unknown error");
//     }
//   }
// }

// // Execute a command using the appropriate tool
// async function executeCommand(command: string) {
//   try {
//     const { toolName, params } = await analyzeCommand(command);
    
//     // Find the tool in the server registry
//     const tool = server.registry.tools.find(t => t.name === toolName);
//     if (!tool) {
//       throw new Error(`Tool '${toolName}' not found`);
//     }
    
//     // Execute the tool with the extracted parameters
//     const result = await tool.handler(params);
//     return {
//       success: true,
//       toolUsed: toolName,
//       result: result
//     };
//   } catch (error) {
//     return {
//       success: false,
//       error: error instanceof Error ? error.message : String(error)
//     };
//   }
// }

// // Set up Express server to handle requests
// const app = express();
// app.use(cors());
// app.use(express.json());

// // Endpoint to process commands
// app.post('/command', async (req, res) => {
//   const { command } = req.body;
  
//   if (!command) {
//     return res.status(400).json({ error: 'Command is required' });
//   }
  
//   try {
//     const result = await executeCommand(command);
//     res.json(result);
//   } catch (error) {
//     const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
//     res.status(500).json({ error: errorMessage });
//   }
// });

// // Health check endpoint
// app.get('/health', (req, res) => {
//   res.json({ status: 'healthy' });
// });

// // Expose list of available tools
// app.get('/tools', (req, res) => {
//   const tools = server.registry.tools.map(tool => ({
//     name: tool.name,
//     description: tool.description,
//     parameters: tool.parameters
//   }));
  
//   res.json({ tools });
// });

// // Start server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
//   console.log(`Available tools: ${server.registry.tools.length}`);
// });

// export { executeCommand, analyzeCommand };
