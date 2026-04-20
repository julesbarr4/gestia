import Anthropic from "@anthropic-ai/sdk";

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export const MODELS = {
  // Tâches complexes : analyse stratégique, génération de documents
  SONNET: "claude-sonnet-4-6",
  // Tâches simples : résumés, réponses emails, relances
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
  maxTokens = 2048
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
