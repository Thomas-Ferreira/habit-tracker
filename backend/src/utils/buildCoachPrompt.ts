import { AnalyticsStats, BaseStat } from "../models/Stat";

export function buildCoachPrompt(overallStats: AnalyticsStats): string {
  const contextualPrompt = `Statistiques globales de l'utilisateur sur les 7 derniers jours (JSON) : ${JSON.stringify(overallStats)}`;
  return contextualPrompt;
}
