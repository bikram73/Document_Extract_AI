import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { FallbackManager } from "./server/services/ai/FallbackManager";

dotenv.config();

const app = express();
const PORT = 3000;

// Body parser with 50mb limit for base64 documents
app.use(express.json({ limit: "50mb" }));

const fallbackManager = new FallbackManager();

// REST API endpoint for document extraction
app.post("/api/extract", async (req, res) => {
  try {
    const { base64Data, mimeType, fileName } = req.body;

    if (!base64Data || !mimeType) {
      return res.status(400).json({ error: "Missing document data or mimeType" });
    }

    const result = await fallbackManager.extractWithFallback(base64Data, mimeType);
    return res.json({
      success: true,
      data: result.data,
      providerUsed: result.providerUsed,
      providerReason: result.providerReason,
      providerLogs: result.providerLogs,
    });
  } catch (error: any) {
    console.error("Extraction error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "An error occurred during extraction.",
    });
  }
});

// Configure Vite or Serve static assets
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in DEVELOPMENT mode...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in PRODUCTION mode...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
}

setupServer();
