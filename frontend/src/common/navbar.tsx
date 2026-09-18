import { Toaster } from "react-hot-toast";
import { FaSignOutAlt, FaUser } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const Navbar = () => {
  const { user, logout } = useAuth();

  const linkClassName = ({ isActive }: { isActive: boolean }) =>
    `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isActive
      ? "bg-emerald-500/15 text-emerald-300"
      : "text-gray-400 hover:bg-gray-800 hover:text-white"
    }`;

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <div className="rounded-xl border border-gray-800 bg-gray-900/80 px-4 py-3 shadow-lg shadow-black/10 backdrop-blur md:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <NavLink to="/" className="shrink-0">
            <span className="text-xl font-bold tracking-tight text-emerald-400 md:text-2xl">
              Habit Tracker
            </span>
          </NavLink>

          <nav className="order-3 flex w-full items-center justify-center gap-1 border-t border-gray-800 pt-3 md:order-none md:w-auto md:border-t-0 md:pt-0">
            <NavLink to="/" end className={linkClassName}>
              Habits
            </NavLink>
            <NavLink to="/dashboard" className={linkClassName}>
              Dashboard
            </NavLink>
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium text-white">{user?.email ?? "User"}</p>
              <p className="text-xs text-gray-500">Your account</p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-800 text-emerald-400">
              <FaUser aria-hidden="true" />
            </div>
            <button
              type="button"
              onClick={logout}
              aria-label="Log out"
              title="Log out"
              className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-500/10 hover:text-red-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
            >
              <FaSignOutAlt aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}