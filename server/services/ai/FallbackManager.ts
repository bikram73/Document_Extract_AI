import { AIService } from "./ProviderInterface";
import { GeminiService } from "./GeminiService";
import { OpenRouterService } from "./OpenRouterService";
import { GroqService } from "./GroqService";
import { ExtractedData } from "./ResponseValidator";

export interface ProviderLog {
  provider: string;
  event: string;
  message: string;
  timestamp: string;
  latencyMs?: number;
}

export interface FallbackResult {
  data: ExtractedData;
  providerUsed: string;
  providerReason: string;
  providerLogs: ProviderLog[];
}

export class FallbackManager {
  private services: Record<string, AIService> = {};

  constructor() {
    this.services = {
      gemini: new GeminiService(),
      openrouter: new OpenRouterService(),
      groq: new GroqService(),
    };
  }

  getPriorityList(): string[] {
    const rawPriority = process.env.AI_PROVIDER_PRIORITY;
    if (rawPriority) {
      return rawPriority
        .split(",")
        .map((p) => p.trim().toLowerCase())
        .filter((p) => !!this.services[p]);
    }
    return ["gemini", "openrouter", "groq"];
  }

  async extractWithFallback(base64Data: string, mimeType: string): Promise<FallbackResult> {
    const priorityList = this.getPriorityList();
    const providerLogs: ProviderLog[] = [];
    let lastError: Error | null = null;

    // Check if the first/primary provider is completely unconfigured
    const primaryProviderName = priorityList[0];
    if (primaryProviderName) {
      const primaryService = this.services[primaryProviderName];
      const primaryHasKey = await primaryService.healthCheck();
      if (!primaryHasKey) {
        throw new Error(
          `Configuration Error: Primary AI Provider (${primaryProviderName.toUpperCase()}) is not configured. Please supply ${primaryProviderName === "gemini" ? "GEMINI_API_KEY" : primaryProviderName === "openrouter" ? "OPENROUTER_API_KEY" : "GROQ_API_KEY"} environment variable.`
        );
      }
    }

    for (let i = 0; i < priorityList.length; i++) {
      const providerName = priorityList[i];
      const service = this.services[providerName];
      const isPrimary = i === 0;

      // Ensure key is configured for fallback provider; if not, skip with log
      const hasKey = await service.healthCheck();
      if (!hasKey) {
        providerLogs.push({
          provider: providerName,
          event: "SKIPPED",
          message: `API Key for ${providerName.toUpperCase()} is not configured. Skipping fallback.`,
          timestamp: new Date().toISOString(),
        });
        continue;
      }

      providerLogs.push({
        provider: providerName,
        event: "STARTED",
        message: `Attempting document extraction using ${providerName.toUpperCase()}...`,
        timestamp: new Date().toISOString(),
      });

      const startTime = Date.now();

      try {
        const data = await service.extractStructuredData(base64Data, mimeType);
        const latencyMs = Date.now() - startTime;

        providerLogs.push({
          provider: providerName,
          event: "SUCCESS",
          message: `Successfully extracted structured data in ${latencyMs}ms.`,
          timestamp: new Date().toISOString(),
          latencyMs,
        });

        const providerReason = isPrimary
          ? "Primary Provider"
          : `Fallback triggered (previous providers failed/rate-limited)`;

        return {
          data,
          providerUsed: providerName,
          providerReason,
          providerLogs,
        };
      } catch (err: any) {
        const latencyMs = Date.now() - startTime;
        lastError = err;

        providerLogs.push({
          provider: providerName,
          event: "FAILED",
          message: `Extraction failed: ${err.message || err}`,
          timestamp: new Date().toISOString(),
          latencyMs,
        });

        console.error(`FallbackManager [${providerName}] failed:`, err);

        // Continue to the next provider in the fallback list
      }
    }

    // If we get here, all attempted providers failed
    throw new Error(
      `Intelligent AI Provider Fallback Engine failed. All active providers (${priorityList.join(
        ", "
      )}) failed to extract data. Last error: ${lastError?.message || lastError}`
    );
  }
}
