# Airtable MCP Server

A Model Context Protocol (MCP) server for Airtable, designed to integrate with AI-powered applications and n8n workflows. This server provides a standardized interface for interacting with Airtable bases, tables, and records.

## 🚀 Features

- **16 Core Tools**: Complete CRUD operations for Airtable
- **Batch Operations**: Create, update, and delete multiple records at once
- **Schema Management**: Access table, field, and view information
- **HTTP Streamable**: Compatible with n8n and other HTTP-based MCP clients
- **TypeScript**: Full type safety and modern JavaScript features
- **Render Ready**: Pre-configured for deployment on Render

## 🛠️ Available Tools

### Base Operations
- `get_base_info` - Get information about the Airtable base
- `list_tables` - List all tables in the base

### Table Operations
- `get_table_info` - Get detailed table information
- `list_fields` - List all fields in a table
- `get_field_info` - Get detailed field information

### Record Operations
- `list_records` - List records with filtering, sorting, and pagination
- `get_record` - Get a specific record by ID
- `create_record` - Create a new record
- `update_record` - Update an existing record
- `delete_record` - Delete a record

### Batch Operations
- `create_records` - Create multiple records (up to 10)
- `update_records` - Update multiple records (up to 10)
- `delete_records` - Delete multiple records (up to 10)

### View Operations
- `list_views` - List all views for a table
- `get_view_info` - Get detailed view information

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ 
- Airtable API key
- Airtable base ID

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/jjwjr94/airtable-mcp.git
   cd airtable-mcp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your Airtable credentials
   ```

4. **Start the development server**
   ```bash
   npm run dev:http
   ```

### Environment Variables

```bash
# Server Configuration
NODE_ENV=development
PORT=3000

# Airtable Configuration
AIRTABLE_API_KEY=your_airtable_api_key_here
AIRTABLE_BASE_ID=your_base_id_here
```

## 🔧 Usage

### HTTP Server (Recommended for n8n)

The HTTP server runs on port 3000 by default and provides these endpoints:

- **Health Check**: `GET /health`
- **MCP Endpoint**: `POST /mcp`
- **Set Credentials**: `POST /set-credentials`

### Headers Required

For all MCP requests, include these headers:
```
x-airtable-api-key: YOUR_API_KEY
x-airtable-base-id: YOUR_BASE_ID
```

### Example MCP Request

```bash
curl -X POST http://localhost:3000/mcp \
  -H "Content-Type: application/json" \
  -H "x-airtable-api-key: YOUR_API_KEY" \
  -H "x-airtable-base-id: YOUR_BASE_ID" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tools/call",
    "params": {
      "name": "list_tables",
      "arguments": {}
    },
    "id": "1"
  }'
```

## 🚀 Deployment

### Render (Recommended)

1. **Fork this repository**
2. **Connect to Render**
3. **Deploy as a Web Service**
4. **Set environment variables in Render dashboard**

The `render.yaml` file is pre-configured for easy deployment.

### Environment Variables for Production

```bash
NODE_ENV=production
PORT=10000
```

## 🧪 Testing

### Run Tests

```bash
# Start the server first
npm run dev:http

# In another terminal, run tests
npm test
```

### Test Individual Endpoints

```bash
# Health check
curl http://localhost:3000/health

# List tools
curl -X POST http://localhost:3000/mcp \
  -H "Content-Type: application/json" \
  -H "x-airtable-api-key: YOUR_API_KEY" \
  -H "x-airtable-base-id: YOUR_BASE_ID" \
  -d '{"jsonrpc":"2.0","method":"tools/list","params":{},"id":"1"}'
```

## 🔌 n8n Integration

### HTTP Request Node Configuration

1. **Method**: POST
2. **URL**: `https://your-render-app.onrender.com/mcp`
3. **Headers**:
   - `Content-Type: application/json`
   - `x-airtable-api-key: {{ $json.apiKey }}`
   - `x-airtable-base-id: {{ $json.baseId }}`
4. **Body**:
   ```json
   {
     "jsonrpc": "2.0",
     "method": "tools/call",
     "params": {
       "name": "list_tables",
       "arguments": {}
     },
     "id": "{{ $json.requestId }}"
   }
   ```

### Example n8n Workflow

1. **Set** node to configure Airtable credentials
2. **HTTP Request** node to call MCP tools
3. **Switch** node to handle different tool responses
4. **Process** node to format data for your needs

## 📚 API Reference

### Tool: list_records

List records from a table with optional filtering and pagination.

**Parameters:**
- `tableId` (required): The ID of the table
- `pageSize` (optional): Number of records to return (max 100)
- `filterByFormula` (optional): Airtable formula to filter records
- `sort` (optional): Sorting configuration
- `fields` (optional): Specific fields to return
- `view` (optional): View ID to use

**Example:**
```json
{
  "name": "list_records",
  "arguments": {
    "tableId": "tblXXXXXXXXXXXXXX",
    "pageSize": 50,
    "filterByFormula": "{Status} = 'Active'",
    "sort": [{"field": "Name", "direction": "asc"}],
    "fields": ["Name", "Status", "Created"]
  }
}
```

### Tool: create_record

Create a new record in a table.

**Parameters:**
- `tableId` (required): The ID of the table
- `fields` (required): The field values for the new record

**Example:**
```json
{
  "name": "create_record",
  "arguments": {
    "tableId": "tblXXXXXXXXXXXXXX",
    "fields": {
      "Name": "New Project",
      "Status": "Active",
      "Priority": "High"
    }
  }
}
```

## 🔒 Security

- **CORS**: Configured for Render and n8n domains
- **Helmet**: Security headers enabled
- **Input Validation**: All inputs are validated
- **Error Handling**: Secure error messages

## 🚀 Development

### Scripts

```bash
npm run build          # Build TypeScript
npm run start          # Start production server
npm run start:http     # Start HTTP server
npm run dev            # Development mode
npm run dev:http       # HTTP development mode
npm run watch          # Watch mode for TypeScript
npm test               # Run tests
npm run inspector      # MCP inspector
```

### Project Structure

```
airtable-mcp/
├── src/
│   ├── airtable-client-wrapper.ts  # Airtable API client
│   ├── tool-handler.ts             # MCP tool definitions
│   └── version.ts                  # Version information
├── index.ts                        # Standard MCP server
├── index-http.ts                   # HTTP server
├── test-http-server.js             # Test suite
├── render.yaml                     # Render deployment config
└── package.json                    # Dependencies and scripts
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built for the Model Context Protocol
- Powered by Airtable API
- Compatible with Claude Desktop and other MCP clients
- Designed for n8n integration

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/jjwjr94/airtable-mcp/issues)
- **Discussions**: [GitHub Discussions](https://github.com/jjwjr94/airtable-mcp/discussions)

---

**Version**: 1.0.0 | **Status**: 🚀 Production Ready | **MCP Protocol**: 2025-06-18 | **Type Safety**: Full TypeScript | **Last Updated**: January 2025
