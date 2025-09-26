# School Bus Management System

A comprehensive school bus management system built with React TypeScript frontend and Node.js Express backend.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Development](#development)
- [Docker Setup](#docker-setup)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Student Management**: Track and manage student information
- **Driver Management**: Manage driver profiles and assignments
- **Bus Management**: Monitor bus fleet and maintenance
- **Journey Tracking**: Real-time journey monitoring and route management
- **Map Integration**: Interactive maps for route planning
- **Multi-language Support**: English and Vietnamese language support
- **Responsive Design**: Works on desktop and mobile devices
- **Dark/Light Theme**: Theme switching support

## Tech Stack

### Frontend
- **React 19** with TypeScript
- **Vite** for build tooling
- **Ant Design** for UI components
- **React Router DOM** for routing
- **Axios** for API calls
- **i18next** for internationalization
- **SCSS** for styling

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **dotenv** for environment management
- **EJS** for templating (if needed)

### DevOps
- **Docker** & **Docker Compose**
- **ESLint** for code linting
- **Nodemon** for development

## Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v20 or higher)
- **npm** or **yarn**
- **Docker** and **Docker Compose** (for containerized setup)

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/thanhquy185/school-bus.git
cd school-bus
```

### 2. Install dependencies

#### Frontend
```bash
cd frontend
npm install
```

#### Backend
```bash
cd server
npm install
```

### 3. Environment Setup

#### Frontend Environment
```bash
cd frontend
cp .env.example .env
```

Edit `.env` with your configuration:
```env
VITE_API_URL=http://localhost:5000
VITE_APP_NAME=School Bus Management System
VITE_APP_VERSION=1.0.0
```

#### Backend Environment
```bash
cd server
cp .env.example .env
```

Edit `.env` with your configuration:
```env
PORT=5000
NODE_ENV=development
```

## Development

### Running Frontend (Development)
```bash
cd frontend
npm run dev
```
Frontend will be available at: `http://localhost:3000`

### Running Backend (Development)
```bash
cd server
npm run dev
```
Backend will be available at: `http://localhost:5000`

### Building for Production

#### Frontend
```bash
cd frontend
npm run build
npm run preview  # Preview production build
```

#### Backend
```bash
cd server
npm run build
npm start
```

## Docker Setup

### Using Docker Compose (Recommended)

1. **Build and run all services**:
```bash
docker-compose up --build
```

2. **Run in detached mode**:
```bash
docker-compose up -d
```

3. **Stop services**:
```bash
docker-compose down
```

4. **View logs**:
```bash
docker-compose logs -f
```

### Individual Docker Commands

#### Frontend
```bash
docker build -f docker/frontend/Dockerfile -t school-bus-frontend .
docker run -p 3000:3000 school-bus-frontend
```

#### Backend
```bash
docker build -f docker/server/Dockerfile -t school-bus-backend .
docker run -p 5000:5000 school-bus-backend
```

### Docker Services

| Service | Port | Description        |
|---------|------|--------------------|
| Frontend| 3000 | React application  |
| Backend | 5000 | Express API server |


## 📁 Project Structure

```
school-bus/
├── docker/                     # Docker configuration
│   ├── frontend/
│   │   └── Dockerfile
│   └── server/
│       └── Dockerfile
├── frontend/                   # React frontend
│   ├── public/
│   │   ├── favicon/
│   │   └── languages/
│   ├── src/
│   │   ├── assets/
│   │   ├── common/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── services/
│   │   └── utils/
│   ├── package.json
│   └── vite.config.ts
├── server/                     # Node.js backend
│   ├── src/
│   │   ├── controllers/
│   │   ├── dtos/
│   │   ├── models/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── app.ts
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
├── dockercompose.yml
├── .gitignore
└── README.md
```

## Available Scripts

### Frontend Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Lint code

### Backend Scripts
- `npm run dev` - Start development server with nodemon
- `npm run build` - Compile TypeScript
- `npm start` - Start production server
- `npm run clean` - Clean build directory

## Development Guidelines

### Code Style
- Use TypeScript for type safety
- Follow ESLint rules
- Use meaningful component and variable names
- Write comments for complex logic

### Git Workflow
1. Create a feature branch: `git checkout -b feature/your-feature-name`
2. Commit changes: `git commit -m "feat: add your feature"`
3. Push to branch: `git push origin feature/your-feature-name`
4. Create a Pull Request

## Deployment

### Production Build
1. Build both frontend and backend:
```bash
# Frontend
cd frontend && npm run build

# Backend
cd server && npm run build
```

2. Use Docker for production deployment:
```bash
docker-compose -f docker-compose.prod.yml up -d
```

**Happy Coding! 🚌✨**