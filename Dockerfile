# I will complete this Dockerfile and Docker compose file when i finish the project
FROM node:20-alpine

WORKDIR /school-bus

# Frontend
COPY frontend/package*.json ./frontend/
COPY frontend/tsconfig.json ./frontend/
COPY frontend/public ./frontend/public
COPY frontend/src ./frontend/src
RUN cd frontend && npm install

# Backend
COPY server/package*.json ./server/
COPY server/tsconfig.json ./server/
COPY server/src ./server/src
RUN cd server && npm install

# Expose ports
EXPOSE 3000 5000

# Start both frontend and backend
CMD ["sh", "-c", "cd frontend && npm run dev & cd ../server && npm run dev"]
