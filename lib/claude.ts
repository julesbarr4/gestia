import Anthropic from "@anthropic-ai/sdk";

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
  timeout: 120_000, // 2 minutes max par requête
  maxRetries: 3,    // retry automatique sur erreur réseau/timeout
});

export const MODELS = {
  SONNET: "claude-sonnet-4-6",
  HAIKU: "claude-haiku-4-5-20251001",
} as const;

export interface AgentResponse {
  contenu: string;
  tokensUtilises: number;
  dureeMs: number;
}

export async function callAgent(
  model: string,
  systemPrompt: string,
  userMessage: string,
  maxTokens = 1024
): Promise<AgentResponse> {
  const debut = Date.now();

  const response = await anthropic.messages.create({
    model,
    max_tokens: maxTokens,
    system: systemPrompt,
    messages: [{ role: "user", content: userMessage }],
  });

  const contenu =
    response.content[0].type === "text" ? response.content[0].text : "";

  return {
    contenu,
    tokensUtilises: response.usage.input_tokens + response.usage.output_tokens,
    dureeMs: Date.now() - debut,
  };
}
