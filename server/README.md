# School Bus Server

## Get started
### Development
```bash
npm install
npm run dev
```

### Production (Disabled)
```bash
npm run _build    # (disabled)
npm run _start    # (disabled)
```

---

## Dependencies Analysis

### DevDependencies (Development Tools)

#### **1. TypeScript & Types**
```json
"typescript": "^5.7.3"
"@types/express": "^5.0.0"
"@types/node": "^20.19.5"
```
**Chức năng:** Compile TypeScript sang JavaScript + Type definitions
**Code mẫu:**
```typescript
// TypeScript với types
import express, { Request, Response } from 'express';
const app: express.Application = express();
```

#### **2. Development Server**
```json
"nodemon": "3.1.9"
"ts-node": "10.9.2"
"ts-node-dev": "^2.0.0"
```
**Chức năng:** Auto-restart server khi code thay đổi
**Config:**
```json
"nodemonConfig": {
  "watch": ["src"],
  "ext": "ts",
  "exec": "ts-node ./src/index.ts"
}
```

---

### Dependencies (Production Libraries)

#### **1. Express Framework**
```json
"express": "^5.1.0"
```
**Chức năng:** Web framework chính
**Code mẫu:**
```typescript
import express from 'express';
const app = express();

app.get('/api/users', (req, res) => {
  res.json({ users: [] });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

#### **2. Database - Prisma ORM**
```json
"@prisma/client": "^6.16.3"
"prisma": "^6.16.3"
```
**Chức năng:** ORM để quản lý database
**Code mẫu:**
```typescript
// prisma/schema.prisma
model User {
  id       Int    @id @default(autoincrement())
  username String @unique
  password String
}

// service
import { prisma } from './prisma/config';
const users = await prisma.user.findMany();
```

#### **3. Authentication**
```json
"bcrypt": "^6.0.0"
"jsonwebtoken": "^9.0.2"
```
**Chức năng:** Hash password + JWT tokens
**Code mẫu:**
```typescript
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Hash password
const hashedPassword = await bcrypt.hash(password, 10);

// Verify password
const isValid = await bcrypt.compare(password, hashedPassword);

// Create JWT
const token = jwt.sign({ userId: 1 }, 'secret', { expiresIn: '1h' });
```

#### **4. Template Engine**
```json
"ejs": "3.1.10"
"@types/ejs": "3.1.5"
```
**Chức năng:** Render HTML templates
**Code mẫu:**
```typescript
app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/profile', (req, res) => {
  res.render('profile', { 
    username: 'John',
    age: 25 
  });
});
```

#### **5. CORS & Environment**
```json
"cors": "^2.8.5"
"dotenv": "17.2.2"
```
**Chức năng:** Cross-Origin requests + Environment variables
**Code mẫu:**
```typescript
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

const PORT = process.env.PORT || 3000;
```

#### **6. Validation**
```json
"zod": "^4.1.11"
```
**Chức năng:** Schema validation
**Code mẫu:**
```typescript
import { z } from 'zod';

const userSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
  email: z.string().email()
});

// Validate
const result = userSchema.parse(req.body);
```

---

## Available Scripts

| Script           | Command              | Chức năng                     |
|------------------|----------------------|-------------------------------|
| `npm run dev`    | `nodemon`            | Development with auto-restart |
| `npm run db`     | `prisma migrate dev` | Chạy database migration       |
| `npm run _build` | `tsc`                | Build TypeScript (disabled)   |
| `npm run _start` | `node dist/index.js` | Run production (disabled)     |

---
