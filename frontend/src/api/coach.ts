import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;
// OLLAMA IS TEMPORARY
const COACH_BASE_URL = `${API_BASE_URL}/api/anlyze/ollama`;

export async function Analyze(token: string | null): Promise<string> {
  const response = await axios.get<{ response: string }>(COACH_BASE_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log(response);
  return response.data.response;
}
