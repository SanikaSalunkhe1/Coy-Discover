import dotenv from 'dotenv';
import { createApp } from './app.js';
import { connectDB } from './config/db.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectDB();
    const app = createApp();

    app.listen(PORT, () => {
      console.log(`[Server] Coy Discover server listening on port ${PORT}`);
      console.log(`[Server] Health check: http://localhost:${PORT}/health`);
      console.log(`[Server] Feed: http://localhost:${PORT}/feed`);
      console.log(`[Server] Matches: http://localhost:${PORT}/matches`);
    });
  } catch (err) {
    console.error('[Server] Fatal startup error:', err);
    process.exit(1);
  }
}

startServer();

