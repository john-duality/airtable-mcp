# 🚀 Quick Start Guide

Get your Airtable MCP server up and running in minutes!

## ⚡ 5-Minute Setup

### 1. Clone & Install
```bash
git clone https://github.com/jjwjr94/airtable-mcp.git
cd airtable-mcp
npm install
```

### 2. Get Your Airtable Credentials
1. Go to [Airtable Account](https://airtable.com/account)
2. Generate a Personal Access Token
3. Note your Base ID from any base URL: `https://airtable.com/appXXXXXXXXXXXXXX`

### 3. Set Environment Variables
```bash
cp env.example .env
# Edit .env with your credentials
```

### 4. Start the Server
```bash
npm run dev:http
```

### 5. Test It Works
```bash
curl http://localhost:3000/health
```

## 🔑 Credentials Setup

### Option A: Environment Variables
```bash
export AIRTABLE_API_KEY="pat_xxxxxxxxxxxxxxxxxxxx"
export AIRTABLE_BASE_ID="appXXXXXXXXXXXXXX"
```

### Option B: .env File
```bash
AIRTABLE_API_KEY=pat_xxxxxxxxxxxxxxxxxxxx
AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX
```

### Option C: Headers (for n8n)
```
x-airtable-api-key: pat_xxxxxxxxxxxxxxxxxxxx
x-airtable-base-id: appXXXXXXXXXXXXXX
```

## 🧪 Quick Test

Test the server with a simple request:

```bash
curl -X POST http://localhost:3000/mcp \
  -H "Content-Type: application/json" \
  -H "x-airtable-api-key: YOUR_API_KEY" \
  -H "x-airtable-base-id: YOUR_BASE_ID" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tools/list",
    "params": {},
    "id": "test"
  }'
```

## 🚀 Deploy to Render

1. **Fork this repo** to your GitHub account
2. **Connect to Render** and create a new Web Service
3. **Point to your fork** and deploy
4. **Set environment variables** in Render dashboard
5. **Your server is live!** 🎉

## 🔌 n8n Integration

### HTTP Request Node
- **Method**: POST
- **URL**: `https://your-app.onrender.com/mcp`
- **Headers**: Include your Airtable credentials
- **Body**: JSON-RPC 2.0 format

### Example Workflow
1. **Set** node: Configure Airtable credentials
2. **HTTP Request**: Call MCP tools
3. **Switch**: Handle different responses
4. **Process**: Format data for your needs

## 🆘 Common Issues

### "Connection Refused"
- Server not running: `npm run dev:http`
- Wrong port: Check PORT environment variable

### "Invalid Token"
- Check your Personal Access Token
- Ensure token has correct permissions

### "Base Not Found"
- Verify your Base ID is correct
- Check token has access to the base

## 📚 Next Steps

- Read the [full README](README.md)
- Explore [available tools](README.md#🛠️-available-tools)
- Check out [n8n integration examples](README.md#🔌-n8n-integration)
- Deploy to [Render](README.md#🚀-deployment)

## 🎯 What You Can Do Now

✅ **List all tables** in your base  
✅ **Create new records** with custom fields  
✅ **Update existing records** in bulk  
✅ **Query records** with filters and sorting  
✅ **Manage views** and field information  
✅ **Integrate with n8n** workflows  

---

**Need help?** [Open an issue](https://github.com/jjwjr94/airtable-mcp/issues) or [start a discussion](https://github.com/jjwjr94/airtable-mcp/discussions)!
