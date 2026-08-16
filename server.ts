import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Proxy for Counter API
  const counterBase = "https://api.counterapi.dev/v2/brain-shares-team-5094/first-counter-5094";
  const defaultCounterToken = "Bearer ut_WQ6AoT7sCZaBPe9rrcCwbfXmppF5ggqninThfe9HY";

  // Match /api/counter and /api/counter/*
  app.all(["/api/counter", "/api/counter/*"], async (req, res) => {
    try {
      let subPath = "";
      if (req.params[0]) {
        subPath = `/${req.params[0]}`;
      } else {
        subPath = req.path.replace(/^\/api\/counter/, "");
      }

      const targetUrl = `${counterBase}${subPath}`;

      const fetchOptions: RequestInit = {
        method: req.method === "POST" || req.method === "PUT" ? req.method : "GET",
        headers: {
          "Authorization": defaultCounterToken,
          "Content-Type": "application/json",
        },
      };

      const apiRes = await fetch(targetUrl, fetchOptions);
      const data = await apiRes.json();
      return res.status(apiRes.status).json(data);
    } catch (error: any) {
      console.error("Counter proxy error:", error);
      return res.status(500).json({ error: error.message || "Proxy request failed" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
