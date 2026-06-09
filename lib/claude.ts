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

/**
 * Nettoie la sortie d'un agent LLM pour en extraire le JSON exploitable.
 * Les modèles encapsulent fréquemment leur réponse dans un bloc ```json ...```
 * malgré la consigne "JSON strict" ; cette fonction retire ces délimiteurs.
 */
export function nettoyerJsonLLM(contenu: string): string {
  return contenu.replace(/```json\n?|\n?```/g, "").trim();
}

/**
 * Variante typée qui parse directement le JSON nettoyé.
 * Lève si la sortie n'est pas du JSON valide (à gérer par l'appelant).
 */
export function parseJsonLLM<T>(contenu: string): T {
  return JSON.parse(nettoyerJsonLLM(contenu)) as T;
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
