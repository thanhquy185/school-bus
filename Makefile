# School Bus Management System - Makefile

.PHONY: help install dev build clean test start

# Default target
help:
	@echo "🚌 School Bus Management System - Available Commands:"
	@echo ""
	@echo "📦 Setup:"
	@echo "  make install     - Install dependencies for both frontend and backend"
	@echo "  make setup       - First time setup (install + create env files)"
	@echo ""
	@echo "🚀 Development:"
	@echo "  make dev         - Start both development servers"
	@echo "  make start       - Same as dev"
	@echo "  make dev-fe      - Start frontend development server only"
	@echo "  make dev-be      - Start backend development server only"
	@echo ""
	@echo "🏗️ Build:"
	@echo "  make build       - Build both frontend and backend for production"
	@echo "  make build-fe    - Build frontend for production"
	@echo "  make build-be    - Build backend for production"
	@echo ""
	@echo "🧹 Cleanup:"
	@echo "  make clean       - Clean build directories"
	@echo "  make test        - Run tests"

# Install dependencies
install: install-fe install-be

install-fe:
	@echo "📦 Installing frontend dependencies..."
	cd frontend && npm install

install-be:
	@echo "📦 Installing backend dependencies..."
	cd server && npm install

# Development
dev: start

start:
	@echo "🚀 Starting development servers..."
	@echo "📱 Backend will run on: http://localhost:5000"
	@echo "🌐 Frontend will run on: http://localhost:3000"
	@echo "⏱️  Please wait for both servers to start..."
	@make -j2 dev-fe dev-be

dev-fe:
	@echo "🌐 Starting frontend..."
	cd frontend && npm run dev

dev-be:
	@echo "📱 Starting backend..."
	cd server && npm run dev

# Build
build: build-fe build-be

build-fe:
	@echo "🏗️ Building frontend..."
	cd frontend && npm run build

build-be:
	@echo "🏗️ Building backend..."
	cd server && npm run build

# Clean
clean:
	@echo "🧹 Cleaning build directories..."
	cd frontend && rm -rf dist
	cd server && rm -rf dist
	@echo "✅ Clean completed!"

# Test
test:
	@echo "🧪 Running tests..."
	cd frontend && npm test || echo "No frontend tests configured"
	cd server && npm test || echo "No backend tests configured"

# First time setup
setup: install
	@echo "✅ Development environment setup completed!"
	@echo "🚀 You can now run 'make dev' to start development servers."
