import { useMutation } from "@tanstack/react-query";
import { analyzeHabits } from "../api/coach";

export function useAnalyze() {
  return useMutation<string, Error, string>({
    mutationKey: ["analyze-habits"],
    mutationFn: (token) => analyzeHabits(token),
  });
}
