import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../features/authSlice.js";
import {
  LayoutDashboard,
  ReceiptText,
  Wallet,
  BarChart3,
  LogOut,
} from "lucide-react";

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const navLinkClass = ({ isActive }) =>
    isActive
      ? "font-semibold text-slate-900"
      : "text-slate-600 hover:text-slate-900";

  const mobileNavClass = ({ isActive }) =>
    `flex flex-col items-center gap-1 text-xs transition ${
      isActive
        ? "text-slate-900 font-semibold"
        : "text-slate-500 hover:text-slate-900"
    }`;

  return (
    <>
      {/* Desktop Navbar */}
      <header className="border-b border-slate-200 bg-white px-4 py-3 shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="flex items-center gap-8">
            <h1 className="text-xl font-bold text-slate-900">Finora</h1>

            <nav className="hidden md:flex items-center gap-6">
              <NavLink to="/dashboard" className={navLinkClass}>
                Dashboard
              </NavLink>

              <NavLink to="/transactions" className={navLinkClass}>
                Transactions
              </NavLink>

              <NavLink to="/budgets" className={navLinkClass}>
                Budgets
              </NavLink>

              <NavLink to="/reports" className={navLinkClass}>
                Reports
              </NavLink>
            </nav>
          </div>

          <button
            onClick={handleLogout}
            className="hidden md:flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white shadow-lg md:hidden">
        <nav className="flex items-center justify-around py-3">
          <NavLink to="/dashboard" className={mobileNavClass}>
            <LayoutDashboard size={22} />
            <span>Home</span>
          </NavLink>

          <NavLink to="/transactions" className={mobileNavClass}>
            <ReceiptText size={22} />
            <span>Transactions</span>
          </NavLink>

          <NavLink to="/budgets" className={mobileNavClass}>
            <Wallet size={22} />
            <span>Budgets</span>
          </NavLink>

          <NavLink to="/reports" className={mobileNavClass}>
            <BarChart3 size={22} />
            <span>Reports</span>
          </NavLink>

          <button
            onClick={handleLogout}
            className="flex flex-col items-center gap-1 text-xs text-red-500"
          >
            <LogOut size={22} />
            <span>Logout</span>
          </button>
        </nav>
      </div>
    </>
  );
}
