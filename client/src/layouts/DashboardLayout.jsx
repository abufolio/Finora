import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Sidebar from "../components/Sidebar.jsx";

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />
      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6 md:px-6">
        <Sidebar />
        <main className="flex-1 pb-20 md:pb-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
