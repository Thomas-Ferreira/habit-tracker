import { FaChartLine, FaRobot } from "react-icons/fa";
import { useAuth } from "../hooks/useAuth";
import { useAnalyze } from "../hooks/useAnalyze";

export const CoachPage = () => {
  const token = useAuth().token;
  const analyzeMutation = useAnalyze();

  return (
    <div className="mx-auto max-w-4xl py-8">
      <header className="mb-8">
        <p className="mb-2 text-sm font-medium text-emerald-400">
          Coach personnel
        </p>
        <h1 className="text-3xl font-bold text-white">
          Analyse de tes habitudes
        </h1>
        <p className="mt-2 text-gray-400">
          Prends un moment pour faire le point sur ta progression.
        </p>
      </header>

      <div className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900">
        <div className="flex items-center gap-3 border-b border-gray-800 px-5 py-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-400">
            <FaRobot aria-hidden="true" />
          </div>
          <div>
            <h2 className="font-semibold text-white">Coach Habit</h2>
            <p className="text-sm text-gray-500">Ton assistant bien-être</p>
          </div>
        </div>

        <div className="min-h-64 px-5 py-8 md:px-8">
          <div className="flex max-w-2xl items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-400/10 text-sm text-emerald-400">
              <FaRobot aria-hidden="true" />
            </div>
            <p className="rounded-2xl rounded-tl-sm bg-gray-800 px-4 py-3 text-sm leading-6 text-gray-200">
              Bonjour ! Je peux analyser tes habitudes et t’aider à faire le
              point sur tes progrès.
            </p>
          </div>
          {analyzeMutation.data && (
            <div className="mt-6 flex max-w-2xl items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-400/10 text-sm text-emerald-400">
                <FaRobot aria-hidden="true" />
              </div>
              <p className="whitespace-pre-wrap rounded-2xl rounded-tl-sm bg-gray-800 px-4 py-3 text-sm leading-6 text-gray-200">
                {analyzeMutation.data}
              </p>
            </div>
          )}
          {analyzeMutation.isError && (
            <p role="alert" className="mt-4 text-sm text-red-400">
              L’analyse n’a pas pu être effectuée : {analyzeMutation.error.message}
            </p>
          )}
        </div>

        <div className="border-t border-gray-800 p-5 md:px-8">
          <button
            type="button"
            onClick={() => {
              if (token) analyzeMutation.mutate(token);
            }}
            disabled={!token || analyzeMutation.isPending}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-400 px-5 py-3 font-semibold text-gray-950 transition hover:bg-emerald-300 sm:w-auto"
          >
            <FaChartLine aria-hidden="true" />
            {analyzeMutation.isPending ? "Analyse en cours…" : "Analyser mes habitudes"}
          </button>
        </div>
      </div>
    </div>
  );
};
