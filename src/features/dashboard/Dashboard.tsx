import React from "react";

const Card = ({
  title,
  status,
  tone,
}: {
  title: string;
  status: string;
  tone?: string;
}) => (
  <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/40">
    <div className="flex items-center justify-between">
      <div>
        <div className="text-xs text-slate-500 dark:text-slate-400">
          {title}
        </div>
        <div className="mt-1 text-lg font-semibold">{status}</div>
      </div>
      {tone === "active" && (
        <div className="text-sm rounded-full bg-emerald-100 text-emerald-800 px-2 py-1">
          Active
        </div>
      )}
      {tone === "wip" && (
        <div className="text-sm rounded-full bg-amber-100 text-amber-800 px-2 py-1">
          WIP
        </div>
      )}
    </div>
  </div>
);

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Services</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Overview of available messaging services.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card title="SMS" status="Available" tone="active" />
        <Card title="Email" status="Work in progress" tone="wip" />
        <Card title="WhatsApp" status="Work in progress" tone="wip" />
      </div>
    </div>
  );
};

export default Dashboard;
