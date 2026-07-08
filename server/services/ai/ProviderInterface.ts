import { ExtractedData } from "./ResponseValidator";

export interface AIService {
  name: string;
  extractStructuredData(base64Data: string, mimeType: string): Promise<ExtractedData>;
  healthCheck(): Promise<boolean>;
}
