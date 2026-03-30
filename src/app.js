// Express app wiring lives here (middleware + routes + error handler).
import express from "express";
import cors from "cors";
import { env } from "./lib/env.js";
import { authRouter } from "./routes/auth-routes.js";
import { todosRouter } from "./routes/todos-routes.js";
import { tagsRouter } from "./routes/tags-routes.js";

export function createApp() {
  // Create isolated app instance (useful for tests and app bootstrapping).
  const app = express();

  // Enable CORS only for configured frontend origins.
  app.use(
    cors({
      origin(origin, callback) {
        if (!origin) {
          return callback(null, true);
        }

        if (env.corsOrigins.includes(origin)) {
          return callback(null, true);
        }

        return callback(new Error("CORS origin not allowed"));
      }
    })
  );
  // Parse JSON request bodies.
  app.use(express.json());

  // Health endpoint for checks and uptime monitoring.
  app.get("/health", (_req, res) => {
    res.json({ ok: true });
  });

  // Mount feature routers.
  app.use("/auth", authRouter);
  app.use("/todos", todosRouter);
  app.use("/tags", tagsRouter);

  // Last-resort error handler for uncaught route/middleware errors.
  app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  });

  // Return configured app to caller.
  return app;
}
