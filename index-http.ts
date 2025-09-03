#!/usr/bin/env node
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { VERSION } from './src/version.js';
import { tool_handler, list_of_tools } from './src/tool-handler.js';
import { AirtableClientWrapper } from './src/airtable-client-wrapper.js';

interface StreamResponse {
  id: string;
  type: 'data' | 'error' | 'complete';
  data?: any;
  error?: string;
}

class AirtableHttpServer {
  private app: express.Application;
  private port: number;

  constructor(port: number = 3000) {
    this.port = port;
    this.app = express();
    this.setupMiddleware();
    this.setupRoutes();
  }

  private setupMiddleware() {
    // Security middleware - configure for Render deployment
    this.app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
        },
      },
      crossOriginEmbedderPolicy: false,
      crossOriginResourcePolicy: { policy: "cross-origin" }
    }));
    
    // CORS for n8n integration - allow Render domains
    this.app.use(cors({
      origin: [
        'https://*.render.com',
        'https://*.n8n.cloud',
        'https://*.n8n.io',
        'http://localhost:3000',
        'http://localhost:5678' // n8n local development
      ],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'x-airtable-api-key', 'x-airtable-base-id']
    }));
    
    // JSON parsing
    this.app.use(express.json({ limit: '10mb' }));
    
    // Logging middleware
    this.app.use((req, res, next) => {
      console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - ${req.ip}`);
      next();
    });
  }

  private sendStreamResponse(res: express.Response, requestId: string, type: 'data' | 'error' | 'complete', data?: any, error?: string) {
    const response: StreamResponse = {
      id: requestId,
      type,
      data,
      error
    };
    res.write(`data: ${JSON.stringify(response)}\n\n`);
  }

  private setupRoutes() {
    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.json({ 
        status: 'ok', 
        service: 'airtable-mcp-server',
        version: VERSION,
        type: 'HTTP Streamable MCP Server'
      });
    });

    // Set credentials endpoint (for initial setup)
    this.app.post('/set-credentials', async (req, res) => {
      try {
        const { apiKey, baseId } = req.body;
        if (!apiKey || !baseId) {
          return res.status(400).json({ error: 'API key and base ID are required' });
        }

        // Test the credentials by making a simple API call
        const testClient = new AirtableClientWrapper(apiKey, baseId);
        await testClient.getBaseInfo();
        
        res.json({ success: true, message: 'Credentials validated successfully' });
      } catch (error) {
        console.error('Error setting credentials:', error);
        res.status(500).json({ error: 'Failed to validate credentials' });
      }
    });

    // HTTP Streamable MCP Endpoint - Main endpoint for all MCP operations
    this.app.post('/mcp', async (req, res) => {
      const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Set headers for streaming
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Cache-Control'
      });

      try {
        // Get credentials from headers
        const apiKey = req.headers['x-airtable-api-key'] as string;
        const baseId = req.headers['x-airtable-base-id'] as string;
        
        if (!apiKey || !baseId) {
          this.sendStreamResponse(res, requestId, 'error', null, 'Airtable API key and base ID required. Set x-airtable-api-key and x-airtable-base-id headers.');
          res.end();
          return;
        }

        // Create fresh Airtable client
        const airtableClient = new AirtableClientWrapper(apiKey, baseId);
        const toolHandler = tool_handler;

        const { method, params } = req.body;

        if (!method) {
          this.sendStreamResponse(res, requestId, 'error', null, 'MCP method is required');
          res.end();
          return;
        }

        let result: any;

        // Handle different MCP methods
        switch (method) {
          case 'initialize':
            result = {
              protocolVersion: "2025-06-18",
              capabilities: {
                tools: {},
                resources: {}
              },
              serverInfo: {
                name: "Airtable MCP HTTP Server",
                version: VERSION
              }
            };
            break;

          case 'tools/list':
            result = {
              tools: list_of_tools
            };
            break;

          case 'tools/call':
            if (!params || !params.name) {
              this.sendStreamResponse(res, requestId, 'error', null, 'Tool name is required for tools/call');
              res.end();
              return;
            }
            
            // Find the tool
            const tool = list_of_tools.find(t => t.name === params.name);
            if (!tool) {
              this.sendStreamResponse(res, requestId, 'error', null, `Tool '${params.name}' not found`);
              res.end();
              return;
            }
            
            // Execute the tool
            result = await toolHandler(params.name, params.arguments || {}, airtableClient);
            break;

          default:
            this.sendStreamResponse(res, requestId, 'error', null, `Unsupported MCP method: ${method}`);
            res.end();
            return;
        }

        // Send the result
        this.sendStreamResponse(res, requestId, 'data', result);

        // Send completion
        this.sendStreamResponse(res, requestId, 'complete', { message: 'MCP operation completed' });

      } catch (error) {
        console.error('Error executing MCP operation:', error);
        this.sendStreamResponse(res, requestId, 'error', null, error instanceof Error ? error.message : 'Unknown error');
      }

      res.end();
    });

    // Legacy endpoints for backward compatibility
    this.app.get('/tools', (req, res) => {
      res.json(list_of_tools);
    });

    // Execute a tool with streaming response (legacy)
    this.app.post('/tools/execute', async (req, res) => {
      const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Set headers for streaming
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Cache-Control'
      });

      try {
        // Get credentials from headers
        const apiKey = req.headers['x-airtable-api-key'] as string;
        const baseId = req.headers['x-airtable-base-id'] as string;
        
        if (!apiKey || !baseId) {
          this.sendStreamResponse(res, requestId, 'error', null, 'Airtable API key and base ID required');
          res.end();
          return;
        }

        const { toolName, arguments: args } = req.body;
        
        if (!toolName) {
          this.sendStreamResponse(res, requestId, 'error', null, 'Tool name is required');
          res.end();
          return;
        }

        // Create Airtable client and execute tool
        const airtableClient = new AirtableClientWrapper(apiKey, baseId);
        const result = await tool_handler(toolName, args || {}, airtableClient);

        // Send the result
        this.sendStreamResponse(res, requestId, 'data', result);

        // Send completion
        this.sendStreamResponse(res, requestId, 'complete', { message: 'Tool execution completed' });

      } catch (error) {
        console.error('Error executing tool:', error);
        this.sendStreamResponse(res, requestId, 'error', null, error instanceof Error ? error.message : 'Unknown error');
      }

      res.end();
    });

    // Error handling middleware
    this.app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
      console.error('Unhandled error:', error);
      res.status(500).json({ 
        error: 'Internal server error',
        message: error.message 
      });
    });
  }

  public start() {
    this.app.listen(this.port, () => {
      console.log(`🚀 Airtable MCP HTTP Server v${VERSION} running on port ${this.port}`);
      console.log(`📊 Health check: http://localhost:${this.port}/health`);
      console.log(`🔧 MCP endpoint: http://localhost:${this.port}/mcp`);
      console.log(`🔑 Set credentials: http://localhost:${this.port}/set-credentials`);
      console.log(`🛠️ Legacy tools endpoint: http://localhost:${this.port}/tools`);
    });
  }
}

// Start the server
const port = parseInt(process.env.PORT || '3000');
const server = new AirtableHttpServer(port);
server.start();
