import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../features/authSlice.js";

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <header className="border-b border-slate-200 bg-white px-4 py-3 shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="text-xl font-semibold text-slate-900">Finance Manager</div>
          <nav className="hidden md:flex items-center gap-3 text-slate-600">
            <NavLink to="/dashboard" className={({ isActive }) => isActive ? "font-semibold text-slate-900" : "hover:text-slate-900"}>
              Dashboard
            </NavLink>
            <NavLink to="/transactions" className={({ isActive }) => isActive ? "font-semibold text-slate-900" : "hover:text-slate-900"}>
              Transactions
            </NavLink>
            <NavLink to="/budgets" className={({ isActive }) => isActive ? "font-semibold text-slate-900" : "hover:text-slate-900"}>
              Budgets
            </NavLink>
            <NavLink to="/reports" className={({ isActive }) => isActive ? "font-semibold text-slate-900" : "hover:text-slate-900"}>
              Reports
            </NavLink>
          </nav>
        </div>
        <button
          onClick={handleLogout}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
