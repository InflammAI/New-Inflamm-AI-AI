#!/bin/bash

# Vital Sync Backend - Quick Start Setup Script
# This script sets up the development environment

set -e

echo "=========================================="
echo "Vital Sync Backend - Quick Start"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check Node.js
echo -e "${YELLOW}Checking Node.js...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}✗ Node.js is not installed${NC}"
    echo "Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi
echo -e "${GREEN}✓ Node.js $(node --version)${NC}"

# Check npm
echo -e "${YELLOW}Checking npm...${NC}"
if ! command -v npm &> /dev/null; then
    echo -e "${RED}✗ npm is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ npm $(npm --version)${NC}"

# Install dependencies
echo ""
echo -e "${YELLOW}Installing dependencies...${NC}"
npm install
echo -e "${GREEN}✓ Dependencies installed${NC}"

# Check PostgreSQL
echo ""
echo -e "${YELLOW}Checking PostgreSQL...${NC}"
if ! command -v psql &> /dev/null; then
    echo -e "${RED}✗ PostgreSQL is not installed${NC}"
    echo "Install from: https://www.postgresql.org/download/"
    exit 1
fi
echo -e "${GREEN}✓ PostgreSQL found${NC}"

# Create .env if not exists
echo ""
echo -e "${YELLOW}Checking environment configuration...${NC}"
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}Creating .env from template...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✓ Created .env${NC}"
    echo ""
    echo -e "${YELLOW}IMPORTANT: Edit .env and update these values:${NC}"
    echo "  - DB_PASSWORD: Set your PostgreSQL password"
    echo "  - JWT_SECRET: Set a random 32+ character string"
    echo "  - JWT_REFRESH_SECRET: Set a random 32+ character string"
    echo "  - ENCRYPTION_KEY: Set a random 32 character string"
    echo "  - ANTHROPIC_API_KEY: Get from console.anthropic.com"
else
    echo -e "${GREEN}✓ .env file exists${NC}"
fi

# Create PostgreSQL user and database
echo ""
echo -e "${YELLOW}Setting up PostgreSQL...${NC}"
echo "Please enter your PostgreSQL admin password:"
psql -U postgres -c "CREATE USER vitalsync_user WITH PASSWORD 'vitalsync_secure_pass';" 2>/dev/null || echo -e "${YELLOW}(User may already exist)${NC}"
psql -U postgres -c "CREATE DATABASE vitalsync_db;" 2>/dev/null || echo -e "${YELLOW}(Database may already exist)${NC}"
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE vitalsync_db TO vitalsync_user;" 2>/dev/null || true
echo -e "${GREEN}✓ PostgreSQL configured${NC}"

# Initialize database
echo ""
echo -e "${YELLOW}Initializing database schema...${NC}"
npm run db:init
echo -e "${GREEN}✓ Database initialized${NC}"

# Success
echo ""
echo -e "${GREEN}=========================================="
echo "Setup Complete! 🎉"
echo "==========================================${NC}"
echo ""
echo -e "${GREEN}Next steps:${NC}"
echo "1. Edit .env file with your configuration"
echo "2. Run: ${YELLOW}npm run dev${NC}"
echo "3. Server will start on: ${YELLOW}http://localhost:5000${NC}"
echo "4. View API docs: ${YELLOW}http://localhost:5000/api/docs${NC}"
echo ""
echo -e "${YELLOW}Quick commands:${NC}"
echo "  npm run dev     - Start development server"
echo "  npm test        - Run tests"
echo "  npm run lint    - Check code style"
echo "  npm run db:init - Reinitialize database"
echo ""
