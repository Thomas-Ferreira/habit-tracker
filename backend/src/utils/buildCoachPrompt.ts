import { AnalyticsStats } from "../models/Stat";

export function buildCoachPrompt(
  stats: AnalyticsStats,
  start: Date,
  end: Date,
): string {
  let contextualPrompt: string = `Tu es un coach d'habitudes bienveillant. Tu écris en français.\n`;
  //build contextualprompt
  contextualPrompt += "\n";

  //ADD DATE
  contextualPrompt += `Voici les habitudes de l'utilisateurs de ${start} à ${end}\n`;
  //ADD COMPLETION RATE
  const completionRate = stats.overallStats.completionRate;
  contextualPrompt += `Taux de complétion global: ${completionRate} %`;

  //ADD HABITS
  for (const habit of stats.habits) {
    const habitName = habit.name;
    const habitCategory = habit.category;
    const habitStreak = habit.streak;
    const habitCompletionRate = habit.completionRate;
    contextualPrompt += `- ${habitName} (${habitCategory}): série de ${habitStreak}, complétée à ${habitCompletionRate}%\n`;
  }

  //ADD END
  contextualPrompt += `\n\nTa tâche : proposer 3 actions concrètes pour progresser. Chaque action doit :\n1. nommer une habitude de la liste ci-dessus,\n2. rappeler le constat chiffré qui la motive,\n3. proposer une action précise à faire demain.\n\nExemple de format (ne le recopie pas, adapte-le aux données) :\n1. Lecture (catégorie learning, taux 40 %) : tu n'as lu que 2 jours sur 7. Essaie de lire 10 minutes juste après le dîner, à heure fixe.\n\nInterdit : reformuler les statistiques sans recommandation, ajouter une introduction ou une conclusion, inventer une habitude absente de la liste.\n`;

  return contextualPrompt;
}
