import { useMutation } from "@tanstack/react-query";
import { analyzeHabits } from "../api/coach";

export type AnalyzeVariables = {
  token: string;
  model: string;
};

export function useAnalyze() {
  return useMutation<string, Error, AnalyzeVariables>({
    mutationKey: ["analyze-habits"],
    mutationFn: ({ token, model }) => analyzeHabits(token, model),
  });
}
