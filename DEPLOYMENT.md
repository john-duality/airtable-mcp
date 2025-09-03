# 🚀 Deployment Guide

Deploy your Airtable MCP server to production with these step-by-step guides.

## 🌟 Render (Recommended)

Render provides a free tier and seamless GitHub integration.

### 1. Prepare Your Repository

1. **Fork this repository** to your GitHub account
2. **Update package.json** with your details:
   ```json
   {
     "name": "@yourusername/mcp-server-airtable",
     "repository": {
       "url": "git+https://github.com/yourusername/airtable-mcp.git"
     }
   }
   ```

### 2. Deploy to Render

1. **Go to [Render Dashboard](https://dashboard.render.com/)**
2. **Click "New +" → "Web Service"**
3. **Connect your GitHub repository**
4. **Configure the service:**
   - **Name**: `airtable-mcp-server`
   - **Environment**: `Node`
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Build Command**: `npm ci && npm run build`
   - **Start Command**: `npm run start:http`
   - **Plan**: Free (or upgrade as needed)

### 3. Set Environment Variables

In Render dashboard, add these environment variables:

```bash
NODE_ENV=production
PORT=10000
```

**Note**: Don't set Airtable credentials here - they'll be passed via headers from n8n.

### 4. Deploy

1. **Click "Create Web Service"**
2. **Wait for build to complete** (usually 2-3 minutes)
3. **Your server is live!** 🎉

### 5. Test Deployment

```bash
# Health check
curl https://your-app-name.onrender.com/health

# Should return:
{
  "status": "ok",
  "service": "airtable-mcp-server",
  "version": "1.0.0",
  "type": "HTTP Streamable MCP Server"
}
```

## 🐳 Docker Deployment

### 1. Build Docker Image

```bash
# Build the image
docker build -t airtable-mcp-server .

# Or use the pre-built image
docker pull jjwjr94/airtable-mcp-server:latest
```

### 2. Run Container

```bash
docker run -d \
  --name airtable-mcp \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e PORT=3000 \
  airtable-mcp-server:latest
```

### 3. Docker Compose

```yaml
# docker-compose.yml
version: '3.8'
services:
  airtable-mcp:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
    restart: unless-stopped
```

```bash
docker-compose up -d
```

## ☁️ Other Cloud Platforms

### Railway

1. **Connect your GitHub repo**
2. **Set environment variables**
3. **Deploy automatically**

### Heroku

1. **Install Heroku CLI**
2. **Create app**: `heroku create your-app-name`
3. **Set buildpacks**: `heroku buildpacks:set heroku/nodejs`
4. **Deploy**: `git push heroku main`

### DigitalOcean App Platform

1. **Connect GitHub repository**
2. **Choose Node.js environment**
3. **Set build and run commands**
4. **Deploy**

## 🔧 Production Configuration

### Environment Variables

```bash
# Required
NODE_ENV=production
PORT=10000

# Optional
LOG_LEVEL=INFO
CORS_ORIGINS=https://*.n8n.cloud,https://*.n8n.io
```

### Security Considerations

1. **HTTPS Only**: Ensure your deployment uses HTTPS
2. **Rate Limiting**: Consider adding rate limiting for production
3. **Monitoring**: Set up health checks and logging
4. **Backups**: Regular database backups if applicable

### Performance Optimization

1. **Node.js Version**: Use Node.js 20+ for best performance
2. **Memory**: Monitor memory usage and adjust as needed
3. **Caching**: Consider adding response caching for read operations
4. **Connection Pooling**: For high-traffic scenarios

## 📊 Monitoring & Health Checks

### Health Check Endpoint

```bash
GET /health
```

**Response:**
```json
{
  "status": "ok",
  "service": "airtable-mcp-server",
  "version": "1.0.0",
  "type": "HTTP Streamable MCP Server",
  "timestamp": "2025-01-XX..."
}
```

### Custom Health Checks

Add your own health checks:

```typescript
// In index-http.ts
app.get('/health/detailed', async (req, res) => {
  try {
    // Test Airtable connection
    const apiKey = req.headers['x-airtable-api-key'];
    const baseId = req.headers['x-airtable-base-id'];
    
    if (apiKey && baseId) {
      const client = new AirtableClientWrapper(apiKey, baseId);
      await client.getBaseInfo();
      
      res.json({
        status: 'ok',
        airtable: 'connected',
        timestamp: new Date().toISOString()
      });
    } else {
      res.json({
        status: 'ok',
        airtable: 'no_credentials',
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});
```

## 🚨 Troubleshooting

### Build Failures

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Runtime Errors

```bash
# Check logs
npm run dev:http

# Or check Render logs in dashboard
```

### Port Conflicts

```bash
# Check what's using the port
lsof -ti:3000

# Kill process if needed
kill -9 $(lsof -ti:3000)
```

## 🔄 Continuous Deployment

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to Render

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Render
        uses: johnbeynon/render-deploy-action@v0.0.1
        with:
          service-id: ${{ secrets.RENDER_SERVICE_ID }}
          api-key: ${{ secrets.RENDER_API_KEY }}
```

### Auto-deploy on Push

1. **Enable auto-deploy** in Render dashboard
2. **Push to main branch** triggers deployment
3. **Monitor deployment** in Render logs

## 📈 Scaling

### Free Tier Limits

- **Build time**: 15 minutes
- **Sleep after inactivity**: Yes
- **Custom domains**: No
- **SSL**: Yes

### Paid Plans

- **Always on**: No sleep
- **Custom domains**: Yes
- **More resources**: CPU/Memory
- **Better performance**: Faster builds

## 🎯 Next Steps

1. **Deploy your server** using one of the guides above
2. **Test the endpoints** with curl or Postman
3. **Integrate with n8n** using HTTP Request nodes
4. **Monitor performance** and adjust as needed
5. **Set up CI/CD** for automatic deployments

---

**Need help with deployment?** [Open an issue](https://github.com/jjwjr94/airtable-mcp/issues) or check the [Render documentation](https://render.com/docs)!
