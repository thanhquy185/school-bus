import app from './app';
import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "http://localhost"

app.listen(PORT, () => {
  console.log(`Server running on port ${HOST}:${PORT}`);
});
