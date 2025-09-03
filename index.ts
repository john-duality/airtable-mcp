#!/usr/bin/env node
import { VERSION } from './src/version.js';
import { tool_handler, list_of_tools } from './src/tool-handler.js';
import { AirtableClientWrapper } from './src/airtable-client-wrapper.js';

// Get credentials from environment variables
const apiKey = process.env.AIRTABLE_API_KEY || process.env.AIRTABLE_TOKEN;
const baseId = process.env.AIRTABLE_BASE_ID || process.env.AIRTABLE_BASE;

if (!apiKey || !baseId) {
  console.error('Error: Missing Airtable credentials');
  console.error('\nUsage options:');
  console.error('  1. Environment variables: AIRTABLE_API_KEY and AIRTABLE_BASE_ID');
  console.error('  2. .env file with AIRTABLE_API_KEY and AIRTABLE_BASE_ID');
  process.exit(1);
}

console.log(`🚀 Starting Airtable MCP Server v${VERSION}`);
console.log(`📊 Base ID: ${baseId}`);
console.log(`🔑 API Key: ${apiKey.substring(0, 8)}...`);

// Create Airtable client
const airtableClient = new AirtableClientWrapper(apiKey, baseId);

console.log('✅ Airtable client initialized');
console.log('📋 Available tools:');
list_of_tools.forEach(tool => {
  console.log(`   - ${tool.name}: ${tool.description}`);
});

console.log('\n💡 This server is designed for HTTP-based MCP operations.');
console.log('   For direct MCP protocol, use the HTTP server: npm run dev:http');
console.log('   For testing, use: npm test');
console.log('\n🔧 Server ready for HTTP requests');
