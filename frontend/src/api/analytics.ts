import axios from "axios";
import type { AnalyticsStats } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_URL;
const ANALYTICS_BASE_URL = `${API_BASE_URL}/api/analytics`

export async function fetchAnalytics(token: string | null): Promise<AnalyticsStats> {
  const response = await axios.get<AnalyticsStats>(ANALYTICS_BASE_URL, { headers: { Authorization: `Bearer ${token}` } })
  return response.data
}