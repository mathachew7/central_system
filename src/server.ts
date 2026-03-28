import { env } from "./config/env.js";
import { logger } from "./core/logger.js";
import { createApp } from "./app.js";
import { initializeTracing, shutdownTracing } from "./observability/tracing.js";

const startServer = async (): Promise<void> => {
  await initializeTracing();

  const app = createApp();

  const server = app.listen(env.PORT, () => {
    logger.info({ port: env.PORT, environment: env.NODE_ENV }, "Server started");
  });

  const shutdown = async (signal: NodeJS.Signals): Promise<void> => {
    logger.info({ signal }, "Shutting down API server");

    server.close(async () => {
      await shutdownTracing();
      logger.info("API server stopped");
      process.exit(0);
    });
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
};

startServer().catch((error: unknown) => {
  logger.error({ error }, "Failed to start server");
  process.exit(1);
});
