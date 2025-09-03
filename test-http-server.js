#!/usr/bin/env node

const http = require('http');

// Test configuration
const TEST_CONFIG = {
  host: 'localhost',
  port: 3000,
  apiKey: process.env.AIRTABLE_API_KEY || 'test_api_key',
  baseId: process.env.AIRTABLE_BASE_ID || 'test_base_id'
};

// Test data
const testRequests = [
  {
    name: 'Health Check',
    method: 'GET',
    path: '/health',
    headers: {},
    body: null
  },
  {
    name: 'List Tools',
    method: 'POST',
    path: '/mcp',
    headers: {
      'Content-Type': 'application/json',
      'x-airtable-api-key': TEST_CONFIG.apiKey,
      'x-airtable-base-id': TEST_CONFIG.baseId
    },
    body: {
      jsonrpc: "2.0",
      method: "tools/list",
      params: {},
      id: "test-1"
    }
  },
  {
    name: 'Get Base Info',
    method: 'POST',
    path: '/mcp',
    headers: {
      'Content-Type': 'application/json',
      'x-airtable-api-key': TEST_CONFIG.apiKey,
      'x-airtable-base-id': TEST_CONFIG.baseId
    },
    body: {
      jsonrpc: "2.0",
      method: "tools/call",
      params: {
        name: "get_base_info",
        arguments: {}
      },
      id: "test-2"
    }
  },
  {
    name: 'List Tables',
    method: 'POST',
    path: '/mcp',
    headers: {
      'Content-Type': 'application/json',
      'x-airtable-api-key': TEST_CONFIG.apiKey,
      'x-airtable-base-id': TEST_CONFIG.baseId
    },
    body: {
      jsonrpc: "2.0",
      method: "tools/call",
      params: {
        name: "list_tables",
        arguments: {}
      },
      id: "test-3"
    }
  }
];

function makeRequest(testRequest) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: TEST_CONFIG.host,
      port: TEST_CONFIG.port,
      path: testRequest.path,
      method: testRequest.method,
      headers: testRequest.headers
    };

    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = {
            statusCode: res.statusCode,
            headers: res.headers,
            data: data
          };
          
          // Try to parse JSON if possible
          try {
            response.json = JSON.parse(data);
          } catch (e) {
            response.json = null;
          }
          
          resolve(response);
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (testRequest.body) {
      req.write(JSON.stringify(testRequest.body));
    }
    
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Starting Airtable MCP Server Tests');
  console.log(`📍 Testing server at ${TEST_CONFIG.host}:${TEST_CONFIG.port}`);
  console.log(`🔑 Using API Key: ${TEST_CONFIG.apiKey.substring(0, 8)}...`);
  console.log(`📊 Using Base ID: ${TEST_CONFIG.baseId}`);
  console.log('');

  for (let i = 0; i < testRequests.length; i++) {
    const testRequest = testRequests[i];
    console.log(`\n${i + 1}. Testing: ${testRequest.name}`);
    console.log(`   ${testRequest.method} ${testRequest.path}`);
    
    try {
      const response = await makeRequest(testRequest);
      
      if (response.statusCode === 200) {
        console.log(`   ✅ Success (${response.statusCode})`);
        
        if (response.json) {
          if (response.json.result && response.json.result.tools) {
            console.log(`   📋 Found ${response.json.result.tools.length} tools`);
          } else if (response.json.status) {
            console.log(`   📊 Status: ${response.json.status}`);
          }
        }
      } else {
        console.log(`   ❌ Failed (${response.statusCode})`);
        console.log(`   📝 Response: ${response.data}`);
      }
    } catch (error) {
      console.log(`   💥 Error: ${error.message}`);
    }
  }

  console.log('\n🎯 Test Summary');
  console.log('   - Make sure your Airtable MCP server is running');
  console.log('   - Set AIRTABLE_API_KEY and AIRTABLE_BASE_ID environment variables');
  console.log('   - Or update the TEST_CONFIG in this file');
  console.log('\n🚀 To start the server: npm run dev:http');
}

// Check if server is running before starting tests
function checkServerHealth() {
  return new Promise((resolve) => {
    const req = http.request({
      hostname: TEST_CONFIG.host,
      port: TEST_CONFIG.port,
      path: '/health',
      method: 'GET'
    }, (res) => {
      resolve(res.statusCode === 200);
    });

    req.on('error', () => {
      resolve(false);
    });

    req.setTimeout(2000, () => {
      req.destroy();
      resolve(false);
    });

    req.end();
  });
}

async function main() {
  console.log('🔍 Checking if server is running...');
  
  const isHealthy = await checkServerHealth();
  
  if (!isHealthy) {
    console.log('❌ Server is not running or not healthy');
    console.log('💡 Please start the server first:');
    console.log('   npm run dev:http');
    console.log('');
    console.log('🔧 Or check if the server is running on the correct port');
    process.exit(1);
  }
  
  console.log('✅ Server is healthy, running tests...\n');
  await runTests();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { makeRequest, runTests, checkServerHealth };
