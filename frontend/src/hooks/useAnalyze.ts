import { useMutation } from "@tanstack/react-query";
import { Analyze } from "../api/coach";

export function useAnalyze(token: string | null) {
  return useMutation({
    mutationKey: ["analyze", token],
    mutationFn: () => Analyze(token!),
  });
}
