import { NavLink } from "react-router-dom";

const navItems = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Transactions", path: "/transactions" },
  { label: "Budgets", path: "/budgets" },
  { label: "Reports", path: "/reports" },
  { label: "Profile", path: "/profile" },
];

export default function Sidebar() {
  return (
    <aside className="hidden w-72 shrink-0 border-r border-slate-200 bg-slate-50 p-4 md:block">
      <div className="mb-6 text-sm uppercase tracking-[.2em] text-slate-500">Quick links</div>
      <nav className="flex flex-col gap-2 text-slate-700">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `rounded-xl px-3 py-2 transition ${
                isActive ? "bg-slate-900 text-white" : "hover:bg-slate-100"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
