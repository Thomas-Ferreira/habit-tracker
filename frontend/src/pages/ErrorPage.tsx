import { Link } from "react-router-dom";

export const ErrorPage = () => {
  return (
    <main className="min-h-screen bg-gray-950 px-6 py-16 text-white">
      <div className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center text-center">
        <p className="text-8xl font-bold text-emerald-400">404</p>
        <h1 className="mt-6 text-3xl font-semibold">Page not found</h1>
        <p className="mt-3 text-gray-400">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          to="/"
          className="mt-8 rounded-lg bg-emerald-500 px-5 py-2.5 font-semibold text-slate-950 transition-colors hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
        >
          Back to dashboard
        </Link>
      </div>
    </main>
  );
};
