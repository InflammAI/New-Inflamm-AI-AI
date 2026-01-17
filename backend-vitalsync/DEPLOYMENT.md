# Vital Sync Backend - Deployment Guide

## Overview

This guide covers deploying Vital Sync backend to production on popular platforms.

---

## Option 1: Railway.app (Recommended)

Railway is modern, easy, and free tier is generous.

### Steps

1. **Create Railway account**
   - Visit [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Create a project**
   - Click "Create new project"
   - Select "Deploy from GitHub repo"

3. **Connect GitHub repository**
   - Authorize Railway
   - Select the repository
   - Choose main branch

4. **Add PostgreSQL database**
   - In Railway dashboard, click "Add Plugin"
   - Select PostgreSQL
   - Railway auto-generates DB credentials

5. **Configure environment variables**
   - Go to project settings
   - Add variables from `.env.example`:
   ```
   NODE_ENV=production
   PORT=5000
   JWT_SECRET=your_long_random_string_here
   JWT_REFRESH_SECRET=your_long_random_string_here
   ENCRYPTION_KEY=your_32_character_string
   ANTHROPIC_API_KEY=your_api_key
   ```
   - Railway automatically sets: `DATABASE_URL`

6. **Update database configuration**
   - Modify `src/config/database.js` to use `DATABASE_URL`
   ```javascript
   const pool = new Pool({
     connectionString: process.env.DATABASE_URL,
     ssl: { rejectUnauthorized: false },
     max: 20,
   });
   ```

7. **Deploy**
   - Push to GitHub main branch
   - Railway auto-deploys
   - Check deployment status in Railway dashboard

8. **Initialize database**
   - In Railway, go to your backend service
   - Click "Connect"
   - Run: `npm run db:init`

9. **Access API**
   - Railway provides a URL like: `https://your-app-xxx.railway.app`
   - Test: `https://your-app-xxx.railway.app/health`

---

## Option 2: Render.com

Render offers free PostgreSQL and simple deployment.

### Steps

1. **Create Render account**
   - Visit [render.com](https://render.com)
   - Sign up

2. **Create PostgreSQL database**
   - Dashboard > "New" > "PostgreSQL"
   - Name: `vitalsync-db`
   - Database name: `vitalsync_db`
   - User: `vitalsync_user`
   - Copy connection string

3. **Create Web Service**
   - Dashboard > "New" > "Web Service"
   - Connect GitHub repository
   - Name: `vitalsync-api`
   - Environment: `Node`
   - Build Command: `npm ci && npm run db:init`
   - Start Command: `npm start`

4. **Add environment variables**
   - Click "Environment" tab
   - Add all variables from `.env.example`

5. **Deploy**
   - Render auto-deploys
   - Monitor logs in "Logs" tab

6. **Test**
   - URL will be like: `https://vitalsync-api.onrender.com`
   - Test: `https://vitalsync-api.onrender.com/health`

---

## Option 3: Docker (Self-hosted)

Deploy to your own server or VPS.

### Prerequisites
- VPS with Ubuntu 20.04+
- SSH access
- Domain name (optional)
- SSL certificate (Let's Encrypt)

### Steps

1. **Connect to VPS**
   ```bash
   ssh root@your_server_ip
   ```

2. **Install Docker**
   ```bash
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   sudo usermod -aG docker $USER
   ```

3. **Install Docker Compose**
   ```bash
   sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose
   ```

4. **Clone repository**
   ```bash
   git clone https://github.com/your-repo/backend-vitalsync.git
   cd backend-vitalsync
   ```

5. **Create production .env**
   ```bash
   cp .env.example .env
   nano .env
   ```
   - Update all values for production
   - Use strong secrets
   - Set `NODE_ENV=production`

6. **Start services**
   ```bash
   docker-compose up -d
   ```

7. **Initialize database**
   ```bash
   docker-compose exec backend npm run db:init
   ```

8. **Setup Nginx reverse proxy** (optional but recommended)
   ```bash
   sudo apt-get install nginx
   sudo nano /etc/nginx/sites-available/default
   ```
   
   Add:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

9. **Setup SSL with Let's Encrypt**
   ```bash
   sudo apt-get install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

10. **Monitor services**
    ```bash
    docker-compose logs -f backend
    docker-compose ps
    ```

---

## Option 4: AWS (ECS)

For larger deployments with auto-scaling.

### Steps

1. **Create ECR repository**
   ```bash
   aws ecr create-repository --repository-name vitalsync-backend
   ```

2. **Build and push Docker image**
   ```bash
   aws ecr get-login-password | docker login --username AWS --password-stdin your-account-id.dkr.ecr.us-east-1.amazonaws.com
   docker build -t vitalsync-backend .
   docker tag vitalsync-backend:latest your-account-id.dkr.ecr.us-east-1.amazonaws.com/vitalsync-backend:latest
   docker push your-account-id.dkr.ecr.us-east-1.amazonaws.com/vitalsync-backend:latest
   ```

3. **Create RDS PostgreSQL instance**
   - AWS Console > RDS > Create database
   - Engine: PostgreSQL 14
   - Configure security groups for ECS access
   - Note: endpoint, port, database name

4. **Create ECS cluster**
   - AWS Console > ECS > Create cluster
   - Name: vitalsync

5. **Create task definition**
   - New task definition
   - Container: ECR image URL
   - Environment variables from `.env.example`
   - Task CPU/Memory: 256 CPU, 512 MB

6. **Create service**
   - Cluster > Create service
   - Task definition: vitalsync
   - Desired count: 2
   - Load balancer: Application Load Balancer

7. **Configure auto-scaling**
   - Target tracking: CPU 70%
   - Scale between 2-10 tasks

---

## Post-Deployment Checklist

- [ ] Database initialized
- [ ] All environment variables set
- [ ] Health check endpoint working
- [ ] Authentication endpoints tested
- [ ] SSL/HTTPS enabled
- [ ] Database backups configured
- [ ] Monitoring/logging setup
- [ ] Rate limiting active
- [ ] CORS configured correctly
- [ ] API keys secured

---

## Monitoring

### Health Check
```bash
curl https://your-api.com/health
```

### Database Backup

**Railway:**
```bash
# In Railway shell
pg_dump $DATABASE_URL > backup.sql
```

**Docker:**
```bash
docker-compose exec postgres pg_dump -U vitalsync_user vitalsync_db > backup.sql
```

**Render:**
- Automatic daily backups included

### Logs

**Railway:**
- Logs tab in dashboard

**Render:**
- Logs tab in service

**Docker:**
```bash
docker-compose logs -f --tail=100 backend
docker-compose logs --timestamps postgres
```

---

## Performance Tuning

### Database
```sql
-- Create indexes for common queries
CREATE INDEX idx_vitals_user_date ON vitals(user_id, recorded_at DESC);
CREATE INDEX idx_notifications_user_read ON notifications(user_id, is_read);
ANALYZE;
```

### Application
- Enable gzip compression in Nginx
- Set appropriate timeout values
- Configure connection pooling

### Caching
```bash
# Add Redis if needed
docker run -d -p 6379:6379 redis:7-alpine
```

---

## Scaling

### Horizontal Scaling
- Run multiple API instances behind load balancer
- Use sticky sessions for WebSocket support
- Scale database read replicas

### Vertical Scaling
- Increase server RAM/CPU
- Upgrade database instance type
- Increase Node max connections

---

## Security

### SSL/TLS
- Always use HTTPS in production
- Use Let's Encrypt (free) or AWS Certificate Manager

### Secrets Management
- Never commit `.env` files
- Use service secret managers:
  - Railway: Built-in secrets
  - Render: Environment variables
  - AWS Secrets Manager
  - HashiCorp Vault

### Database Security
- Use VPC/private networks
- Enable SSL connections
- Regular backups
- Principle of least privilege

### API Security
- Rate limiting enabled
- CORS restricted to known origins
- Input validation on all endpoints
- SQL injection protection (parameterized queries)

---

## Troubleshooting

### Database Connection Issues
```
Check database URL format
Verify security groups allow connections
Test from app server: psql $DATABASE_URL
```

### Out of Memory
```bash
# Increase Node memory
NODE_OPTIONS='--max-old-space-size=1024' npm start
```

### High CPU Usage
```bash
# Profile with node
node --prof src/server.js
node --prof-process isolate-*.log > profile.txt
```

---

## Updates

To deploy updates:

**Git-based (Railway, Render):**
```bash
git push origin main
# Auto-deploys
```

**Docker-based:**
```bash
git pull
docker-compose down
docker-compose up -d --build
docker-compose exec backend npm run db:init
```

---

## Support

- Documentation: See README.md
- Issues: GitHub Issues
- Monitoring: Service dashboards
