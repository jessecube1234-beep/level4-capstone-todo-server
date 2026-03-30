// Load environment variables before creating the app.
import dotenv from "dotenv";
// App factory sets up middleware and routes.
import { createApp } from "./app.js";
// env gives typed access to configuration values.
import { env } from "./lib/env.js";

dotenv.config();

// Create a fresh Express app instance.
const app = createApp();

// Start HTTP server on configured port.
app.listen(env.port, () => {
  console.info(`Server listening on port ${env.port}`);
});
