# Deployment Guide for Vytal Sync Backend

## Overview

This guide covers deploying the Vytal Sync backend to AWS, GCP, and Fly.io with PostgreSQL database and proper security configurations.

## Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Docker (optional)
- Cloud provider account (AWS/GCP/Fly.io)

## Environment Configuration

### Required Environment Variables
```bash
# Database
DATABASE_URL=postgresql://username:password@host:port/database

# Security
JWT_SECRET=your_jwt_secret_key_at_least_32_characters

# Server
PORT=3001
NODE_ENV=production

# Optional
LOG_LEVEL=info
MAX_CONNECTIONS=100
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW_MS=60000
```

### Database Setup
```sql
-- Create database
CREATE DATABASE vytal_sync;

-- Create user with limited permissions
CREATE USER vytal_sync_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE vytal_sync TO vytal_sync_user;
```

## AWS Deployment

### Option 1: EC2 + RDS

#### 1. Launch EC2 Instance
```bash
# Ubuntu 22.04 LTS
aws ec2 run-instances \
  --image-id ami-0abcdef1234567890 \
  --instance-type t3.micro \
  --key-name your-key-pair \
  --security-group-ids sg-12345678 \
  --subnet-id subnet-12345678
```

#### 2. Install Dependencies
```bash
ssh -i your-key.pem ubuntu@your-instance-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Clone and build
git clone https://github.com/your-repo/vytal-sync-backend.git
cd vytal-sync-backend
npm install
npm run build
```

#### 3. Configure Environment
```bash
# Create .env file
cat > .env << EOF
DATABASE_URL=postgresql://username:password@your-rds-endpoint:5432/vytal_sync
JWT_SECRET=your_jwt_secret_key
PORT=3001
NODE_ENV=production
EOF
```

#### 4. Setup PM2 Process
```bash
# Create ecosystem file
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'vytal-sync-backend',
    script: './dist/server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
EOF

# Start application
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

#### 5. Setup Nginx Reverse Proxy
```bash
sudo apt install nginx -y

# Create nginx config
cat > /etc/nginx/sites-available/vytal-sync << EOF
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    location /ws/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

sudo ln -s /etc/nginx/sites-available/vytal-sync /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Option 2: ECS + RDS

#### 1. Create Dockerfile
```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:18-alpine AS runner

WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3001

USER node

CMD ["node", "dist/server.js"]
```

#### 2. Create Task Definition
```json
{
  "family": "vytal-sync-backend",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "executionRoleArn": "arn:aws:iam::account:role/ecsTaskExecutionRole",
  "taskRoleArn": "arn:aws:iam::account:role/ecsTaskRole",
  "containerDefinitions": [
    {
      "name": "vytal-sync-backend",
      "image": "your-account.dkr.ecr.region.amazonaws.com/vytal-sync-backend:latest",
      "portMappings": [
        {
          "containerPort": 3001,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        },
        {
          "name": "PORT",
          "value": "3001"
        }
      ],
      "secrets": [
        {
          "name": "DATABASE_URL",
          "valueFrom": "arn:aws:secretsmanager:region:account:secret:vytal-sync/db-url"
        },
        {
          "name": "JWT_SECRET",
          "valueFrom": "arn:aws:secretsmanager:region:account:secret:vytal-sync/jwt-secret"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/vytal-sync-backend",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

## GCP Deployment

### Option 1: Compute Engine + Cloud SQL

#### 1. Create VM Instance
```bash
gcloud compute instances create vytal-sync-backend \
    --zone=us-central1-a \
    --machine-type=e2-micro \
    --image-family=ubuntu-2204-lts \
    --image-project=ubuntu-os-cloud \
    --boot-disk-size=20GB \
    --tags=http-server,https-server
```

#### 2. Setup Cloud SQL
```bash
# Create PostgreSQL instance
gcloud sql instances create vytal-sync-db \
    --database-version=POSTGRES_14 \
    --tier=db-f1-micro \
    --region=us-central1 \
    --authorized-networks=0.0.0.0/0

# Create database
gcloud sql databases create vytal_sync --instance=vytal-sync-db

# Create user
gcloud sql users create vytal_sync_user \
    --instance=vytal-sync-db \
    --password=secure_password
```

#### 3. Deploy Application
```bash
# SSH into instance
gcloud compute ssh vytal-sync-backend --zone=us-central1-a

# Install dependencies
sudo apt update && sudo apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install -g pm2

# Clone and setup
git clone https://github.com/your-repo/vytal-sync-backend.git
cd vytal-sync-backend
npm install
npm run build

# Configure environment
cat > .env << EOF
DATABASE_URL=postgresql://vytal_sync_user:secure_password@10.0.0.3:5432/vytal_sync
JWT_SECRET=your_jwt_secret_key
PORT=3001
NODE_ENV=production
EOF

# Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Option 2: Cloud Run + Cloud SQL

#### 1. Create Cloud SQL Instance
```bash
gcloud sql instances create vytal-sync-db \
    --database-version=POSTGRES_14 \
    --tier=db-f1-micro \
    --region=us-central1 \
    --no-assign-ip
```

#### 2. Build and Deploy Container
```bash
# Build container
gcloud builds submit --tag gcr.io/your-project/vytal-sync-backend

# Deploy to Cloud Run
gcloud run deploy vytal-sync-backend \
    --image gcr.io/your-project/vytal-sync-backend \
    --platform managed \
    --region us-central1 \
    --allow-unauthenticated \
    --set-cloud-sql-instances vytal-sync-db \
    --set-env-vars NODE_ENV=production,PORT=3001 \
    --set-secrets DATABASE_URL=vytal-sync-db-url:latest,JWT_SECRET=vytal-sync-jwt:latest
```

## Fly.io Deployment

### 1. Install Fly CLI
```bash
curl -L https://fly.io/install.sh | sh
```

### 2. Initialize Project
```bash
fly launch
```

### 3. Configure fly.toml
```toml
app = "vytal-sync-backend"

[build]
  builder = "Nixpacks"

[env]
  NODE_ENV = "production"
  PORT = "3001"

[[services]]
  protocol = "tcp"
  internal_port = 3001

  [[services.ports]]
    port = 80
    handlers = ["http"]

  [[services.ports]]
    port = 443
    handlers = ["tls", "http"]

  [services.concurrency]
    type = "connections"
    hard_limit = 100
    soft_limit = 80

  [[services.tcp_checks]]
    interval = 10000
    timeout = 2000

[deploy]
  strategy = "rolling"

[experimental]
  auto_rollback = true
```

### 4. Setup PostgreSQL
```bash
# Create PostgreSQL database
fly postgres create --name vytal-sync-db --region ord

# Attach to app
fly postgres attach vytal-sync-db --app vytal-sync-backend

# Get connection URL
fly postgres connection-string --app vytal-sync-db
```

### 5. Set Secrets
```bash
fly secrets set DATABASE_URL="postgresql://username:password@host:port/database"
fly secrets set JWT_SECRET="your_jwt_secret_key"
```

### 6. Deploy
```bash
fly deploy
```

## Monitoring and Logging

### AWS CloudWatch
```bash
# Install CloudWatch agent
sudo apt install amazon-cloudwatch-agent -y

# Configure agent
cat > /opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json << EOF
{
  "agent": {
    "metrics_collection_interval": 60,
    "run_as_user": "cwagent"
  },
  "metrics": {
    "namespace": "CWAgent",
    "metrics_collected": {
      "cpu": {
        "measurement": [
          "cpu_usage_idle",
          "cpu_usage_iowait",
          "cpu_usage_user",
          "cpu_usage_system"
        ],
        "metrics_collection_interval": 60
      },
      "disk": {
        "measurement": [
          "used_percent"
        ],
        "metrics_collection_interval": 60,
        "resources": [
          "*"
        ]
      },
      "mem": {
        "measurement": [
          "mem_used_percent"
        ],
        "metrics_collection_interval": 60
      }
    }
  },
  "logs": {
    "logs_collected": {
      "files": {
        "collect_list": [
          {
            "file_path": "/home/ubuntu/vytal-sync-backend/logs/combined.log",
            "log_group_name": "/ec2/vytal-sync-backend",
            "log_stream_name": "{instance_id}"
          }
        ]
      }
    }
  }
}
EOF

sudo systemctl start amazon-cloudwatch-agent
sudo systemctl enable amazon-cloudwatch-agent
```

### GCP Cloud Logging
```bash
# Install Cloud Logging agent
curl -sSO https://dl.google.com/cloudagents/add-logging-agent-repo.sh
sudo bash add-logging-agent-repo.sh
sudo apt-get update && sudo apt-get install -y google-fluentd

# Configure agent
cat > /etc/google-fluentd/config.d/vytal-sync.conf << EOF
<source>
  @type tail
  path /home/ubuntu/vytal-sync-backend/logs/*.log
  pos_file /var/lib/google-fluentd/pos/vytal-sync.pos
  tag vytal-sync
  format json
  time_format %Y-%m-%dT%H:%M:%S.%NZ
</source>

<match vytal-sync>
  @type google_cloud
  project_id your-project-id
</match>
EOF

sudo systemctl restart google-fluentd
```

## SSL/TLS Configuration

### AWS Certificate Manager
```bash
# Request certificate
aws acm request-certificate \
  --domain-name your-domain.com \
  --validation-method DNS \
  --subject-alternative-names www.your-domain.com

# After validation, use certificate in load balancer
```

### GCP Certificate Manager
```bash
# Create SSL certificate
gcloud compute ssl-certificates create vytal-sync-ssl \
    --domains your-domain.com,www.your-domain.com \
    --certificate your-cert.pem \
    --private-key your-key.pem
```

### Fly.io (Automatic)
Fly.io automatically provides SSL certificates for all apps.

## Health Checks and Monitoring

### Application Health Check
```typescript
// Add to server.ts
app.get('/health', async (req, res) => {
  try {
    // Check database connection
    await model.pool.query('SELECT 1');
    
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.env.npm_package_version
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});
```

### Load Balancer Health Check
```bash
# AWS
aws elbv2 create-target-group \
  --name vytal-sync-tg \
  --protocol HTTP \
  --port 3001 \
  --health-check-path /health \
  --health-check-interval-seconds 30 \
  --health-check-timeout-seconds 5 \
  --healthy-threshold-count 2 \
  --unhealthy-threshold-count 3

# GCP
gcloud compute health-checks create http vytal-sync-hc \
  --port 3001 \
  --request-path /health \
  --check-interval 30s \
  --timeout 5s \
  --healthy-threshold 2 \
  --unhealthy-threshold 3
```

## Backup and Recovery

### Database Backup
```bash
# AWS RDS
aws rds create-db-snapshot \
  --db-instance-identifier vytal-sync-db \
  --db-snapshot-identifier vytal-sync-backup-$(date +%Y%m%d)

# GCP Cloud SQL
gcloud sql backups create --instance=vytal-sync-db

# Fly.io PostgreSQL
fly postgres backups create vytal-sync-db
```

### Application Backup
```bash
# Create backup script
cat > backup.sh << EOF
#!/bin/bash

# Create timestamped backup
TIMESTAMP=\$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backup/vytal-sync/\$TIMESTAMP"

# Create backup directory
mkdir -p \$BACKUP_DIR

# Backup application files
tar -czf \$BACKUP_DIR/app.tar.gz /home/ubuntu/vytal-sync-backend

# Backup database
pg_dump \$DATABASE_URL > \$BACKUP_DIR/database.sql

# Upload to S3/GCS
aws s3 sync \$BACKUP_DIR s3://your-backup-bucket/vytal-sync/\$TIMESTAMP/

# Clean up local backup
rm -rf \$BACKUP_DIR

echo "Backup completed: \$TIMESTAMP"
EOF

chmod +x backup.sh

# Add to crontab for daily backups
echo "0 2 * * * /home/ubuntu/backup.sh" | crontab -
```

## Security Best Practices

### Network Security
```bash
# Configure firewall rules
# AWS
aws ec2 authorize-security-group-ingress \
  --group-id sg-12345678 \
  --protocol tcp \
  --port 3001 \
  --cidr 0.0.0.0/0

# GCP
gcloud compute firewall-rules create vytal-sync-allow-3001 \
  --allow tcp:3001 \
  --source-ranges 0.0.0.0/0 \
  --target-tags vytal-sync-backend

# Fly.io (handled automatically)
```

### Application Security
```typescript
// Add security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// Rate limiting
app.use(rateLimit(100, 60000));

// CORS configuration
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true
}));
```

## Troubleshooting

### Common Issues

#### Database Connection Errors
```bash
# Check connection string
echo $DATABASE_URL

# Test connection
psql $DATABASE_URL -c "SELECT 1"

# Check PostgreSQL logs
sudo tail -f /var/log/postgresql/postgresql-14-main.log
```

#### Memory Issues
```bash
# Check memory usage
free -h
ps aux --sort=-%mem | head

# Configure PM2 memory limit
pm2 start ecosystem.config.js --max-memory-restart 512M
```

#### WebSocket Issues
```bash
# Check WebSocket connections
netstat -an | grep :3001

# Test WebSocket connection
wscat -c ws://localhost:3001/ws/vytal-sync
```

### Performance Optimization

#### Database Optimization
```sql
-- Add indexes for better performance
CREATE INDEX CONCURRENTLY idx_encrypted_blobs_public_key_timestamp 
ON encrypted_blobs(public_key, timestamp DESC);

-- Analyze table statistics
ANALYZE encrypted_blobs;
ANALYZE access_rules;
```

#### Application Optimization
```bash
# Enable clustering in PM2
pm2 start ecosystem.config.js --instances max

# Configure connection pooling
# Add to environment
PGPOOL_MAX=20
PGPOOL_MIN=5
PGPOOL_IDLE_TIMEOUT=30000
```

This deployment guide provides comprehensive instructions for deploying the Vytal Sync backend across major cloud providers with proper security, monitoring, and operational considerations.
