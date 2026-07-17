import app from './app';
import { env } from './config/env';
import { connectDB } from './config/db';

async function start(): Promise<void> {
  await connectDB();

  app.listen(env.PORT, () => {
    console.log(`PromptPilot AI backend running on port ${env.PORT}`);
  });
}

start().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
