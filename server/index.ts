import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import {
  submitGrievance,
  getGrievances,
  getGrievanceById,
  getGrievanceStats,
} from "./routes/grievance";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Grievance API routes
  app.post("/api/grievances", submitGrievance);
  app.get("/api/grievances/stats", getGrievanceStats);
  app.get("/api/grievances/:id", getGrievanceById);
  app.get("/api/grievances", getGrievances);

  return app;
}
