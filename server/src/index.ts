import app, { socketServer, socketIO } from './app';
import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "http://localhost"

socketServer.listen(PORT, () => {
  console.log(`Server running on port ${HOST}:${PORT}`);
  console.log(`Socket.IO đã được khởi tạo và sẵn sàng!`);
});
