import OpenAI from "openai";

let client: OpenAI | null = null;

export function getOpenAIClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured on the server.");
  }

  if (!client) {
    client = new OpenAI({ apiKey });
  }

  return client;
}

export const OPENAI_CHAT_MODEL = "gpt-4o-mini";
