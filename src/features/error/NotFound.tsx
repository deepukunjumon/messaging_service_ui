import React from "react";
import { useNavigate } from "react-router-dom";
import { Chip } from "../../components/Chip";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[100vh] text-center px-4">
      {/* Visual Indicator */}
      <div className="mb-6">
        <Chip label="404 Error" color="danger" variant="soft" size="large" />
      </div>

      <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
        Page not found
      </h1>

      <p className="text-slate-600 dark:text-slate-400 max-w-md mb-8">
        Sorry, we couldn't find the page you're looking for. It might have been
        moved, deleted, or perhaps the URL is incorrect.
      </p>

      <div className="flex gap-4">
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
        >
          Go Back
        </button>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-2.5 rounded-lg bg-teal-600 text-white font-medium hover:bg-teal-700 shadow-sm shadow-teal-500/20 transition-all"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default NotFound;