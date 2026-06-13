import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl p-8 text-center">
      <h1 className="text-4xl font-bold text-slate-900">Page not found</h1>
      <p className="mt-4 text-slate-600">The route you requested does not exist.</p>
      <Link to="/dashboard" className="mt-6 inline-block rounded-md bg-sky-600 px-5 py-3 text-white hover:bg-sky-700">
        Return to dashboard
      </Link>
    </div>
  );
}
