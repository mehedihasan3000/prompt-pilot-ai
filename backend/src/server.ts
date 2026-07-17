import app from './app';
import { connectDB } from './config/db';
import { initializeDatabase } from './config/init-db';
import { env } from './config/env';

async function start() {
  await connectDB();
  await initializeDatabase();
  app.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT}`);
  });
}

start().catch(console.error);
