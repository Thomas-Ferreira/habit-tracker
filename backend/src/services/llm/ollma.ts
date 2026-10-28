export interface OllamaGenerateResponse {
  response: string;
}

export async function getOllamaResponse(prompt: string): Promise<string> {
  const OLLAMA_URL = process.env.OLLAMA_URL;
  const OLLAMA_MODEL = process.env.OLLAMA_MODEL;
  console.log(process.env.OLLAMA_URL);

  try {
    const res = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: OLLAMA_MODEL, prompt, stream: false }),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = (await res.json()) as OllamaGenerateResponse;
    if (typeof data.response !== "string") {
      throw new Error("Réponse Ollama inattendue");
    }

    return data.response;
  } catch (error) {
    console.error("Error fetching Ollama response:", error);
    throw error;
  }
}
