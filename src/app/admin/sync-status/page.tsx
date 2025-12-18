"use client";

import { useState, useEffect, useCallback } from "react";

/**
 * Sync Status Dashboard
 *
 * Displays quiz_leads sync status to Wix CRM.
 * Protected by basic auth via the API.
 */

interface SyncStats {
  pending: number;
  synced: number;
  failed: number;
  total: number;
  // Payment stats
  paid: number;
  unpaid: number;
  paymentFailed: number;
}

interface Lead {
  id: string;
  name: string;
  email: string;
  recommendation: string;
  wix_sync_status: "pending" | "synced" | "failed";
  wix_sync_attempts: number;
  wix_sync_error: string | null;
  // Payment fields
  payment_status: "pending" | "paid" | "failed" | "refunded" | null;
  payment_id: string | null;
  payment_amount: number | null;
  program_purchased: string | null;
  payment_gateway: "razorpay" | "payu" | null;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
}

interface LeadsPerDay {
  [date: string]: {
    total: number;
    synced: number;
    failed: number;
  };
}

interface DashboardData {
  success: boolean;
  stats: SyncStats;
  recentLeads: Lead[];
  failedLeads: Lead[];
  leadsPerDay: LeadsPerDay;
  timestamp: string;
}

export default function SyncStatusDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [credentials, setCredentials] = useState({ user: "", pass: "" });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);

  const fetchData = useCallback(async () => {
    if (!credentials.user || !credentials.pass) return;

    try {
      setIsLoading(true);
      setError(null);

      const authString = btoa(`${credentials.user}:${credentials.pass}`);
      const response = await fetch("/api/admin/sync-status", {
        headers: {
          Authorization: `Basic ${authString}`,
        },
      });

      if (response.status === 401) {
        setIsAuthenticated(false);
        setError("Invalid credentials");
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      setData(result);
      setIsAuthenticated(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data");
    } finally {
      setIsLoading(false);
    }
  }, [credentials]);

  // Auto-refresh every 30 seconds if enabled
  useEffect(() => {
    if (!autoRefresh || !isAuthenticated) return;

    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [autoRefresh, isAuthenticated, fetchData]);

  // Login form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Sync Status Dashboard
          </h1>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              fetchData();
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                value={credentials.user}
                onChange={(e) =>
                  setCredentials({ ...credentials, user: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={credentials.pass}
                onChange={(e) =>
                  setCredentials({ ...credentials, pass: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            {error && (
              <p className="text-red-600 text-sm text-center">{error}</p>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading && !data) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  // Error state
  if (error && !data) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  const stats = data?.stats;
  const syncRate = stats?.total
    ? Math.round((stats.synced / stats.total) * 100)
    : 0;
  const conversionRate = stats?.total
    ? Math.round((stats.paid / stats.total) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Sync Status Dashboard
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Quiz Leads → Wix CRM Sync & Payment Status
            </p>
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="rounded"
              />
              Auto-refresh (30s)
            </label>
            <button
              onClick={fetchData}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm"
            >
              {isLoading ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </div>

        {/* CRM Sync Stats Cards */}
        <h2 className="text-lg font-semibold text-gray-700 mb-3">CRM Sync Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <StatCard
            label="Total Leads"
            value={stats?.total || 0}
            color="blue"
          />
          <StatCard
            label="Synced"
            value={stats?.synced || 0}
            color="green"
            subtext={`${syncRate}% sync rate`}
          />
          <StatCard
            label="Pending"
            value={stats?.pending || 0}
            color="yellow"
          />
          <StatCard
            label="Sync Failed"
            value={stats?.failed || 0}
            color="red"
            alert={(stats?.failed ?? 0) > 0}
          />
        </div>

        {/* Payment Stats Cards */}
        <h2 className="text-lg font-semibold text-gray-700 mb-3">Payment Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Paid Customers"
            value={stats?.paid || 0}
            color="green"
            subtext={`${conversionRate}% conversion`}
          />
          <StatCard
            label="Unpaid Leads"
            value={stats?.unpaid || 0}
            color="blue"
          />
          <StatCard
            label="Payment Failed"
            value={stats?.paymentFailed || 0}
            color="red"
            alert={(stats?.paymentFailed ?? 0) > 0}
          />
          <StatCard
            label="Revenue"
            value={0}
            color="green"
            subtext="Coming soon"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Sync Status Pie */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Sync Status Distribution
            </h2>
            <div className="flex items-center justify-center gap-8">
              <div className="relative w-32 h-32">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  <circle
                    cx="18"
                    cy="18"
                    r="15.5"
                    fill="none"
                    stroke="#E5E7EB"
                    strokeWidth="3"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="15.5"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="3"
                    strokeDasharray={`${syncRate} ${100 - syncRate}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-800">
                    {syncRate}%
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <LegendItem color="green" label="Synced" value={stats?.synced || 0} />
                <LegendItem color="yellow" label="Pending" value={stats?.pending || 0} />
                <LegendItem color="red" label="Failed" value={stats?.failed || 0} />
              </div>
            </div>
          </div>

          {/* Daily Leads Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Leads Per Day (Last 7 Days)
            </h2>
            <div className="space-y-3">
              {data?.leadsPerDay &&
                Object.entries(data.leadsPerDay)
                  .slice(-7)
                  .map(([date, dayData]) => (
                    <div key={date} className="flex items-center gap-3">
                      <span className="text-sm text-gray-600 w-20">
                        {new Date(date).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      <div className="flex-1 h-6 bg-gray-100 rounded overflow-hidden flex">
                        <div
                          className="bg-green-500 h-full"
                          style={{
                            width: `${
                              dayData.total
                                ? (dayData.synced / dayData.total) * 100
                                : 0
                            }%`,
                          }}
                        />
                        <div
                          className="bg-red-500 h-full"
                          style={{
                            width: `${
                              dayData.total
                                ? (dayData.failed / dayData.total) * 100
                                : 0
                            }%`,
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-700 w-8 text-right">
                        {dayData.total}
                      </span>
                    </div>
                  ))}
            </div>
          </div>
        </div>

        {/* Failed Leads Alert */}
        {data?.failedLeads && data.failedLeads.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-red-800 mb-4">
              Failed Leads (Exhausted Retries)
            </h2>
            <p className="text-red-700 text-sm mb-4">
              These leads have failed to sync after 5+ attempts and need manual
              attention.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-red-800">
                    <th className="pb-2">Email</th>
                    <th className="pb-2">Name</th>
                    <th className="pb-2">Attempts</th>
                    <th className="pb-2">Error</th>
                    <th className="pb-2">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {data.failedLeads.map((lead) => (
                    <tr key={lead.id} className="border-t border-red-100">
                      <td className="py-2 font-mono text-xs">{lead.email}</td>
                      <td className="py-2">{lead.name}</td>
                      <td className="py-2">{lead.wix_sync_attempts}</td>
                      <td className="py-2 text-xs max-w-xs truncate">
                        {lead.wix_sync_error || "-"}
                      </td>
                      <td className="py-2 text-xs">
                        {new Date(lead.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Recent Leads Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">
              Recent Leads (Last 50)
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr className="text-left text-gray-600">
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Program</th>
                  <th className="px-4 py-3 font-medium">Sync</th>
                  <th className="px-4 py-3 font-medium">Payment</th>
                  <th className="px-4 py-3 font-medium">Amount</th>
                  <th className="px-4 py-3 font-medium">Gateway</th>
                  <th className="px-4 py-3 font-medium">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data?.recentLeads?.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 font-mono text-xs">{lead.email}</td>
                    <td className="px-4 py-4">{lead.name}</td>
                    <td className="px-4 py-4 capitalize">{lead.program_purchased || lead.recommendation}</td>
                    <td className="px-4 py-4">
                      <StatusBadge status={lead.wix_sync_status} />
                    </td>
                    <td className="px-4 py-4">
                      <PaymentBadge status={lead.payment_status} />
                    </td>
                    <td className="px-4 py-4 text-xs">
                      {lead.payment_amount ? `₹${lead.payment_amount.toLocaleString()}` : "-"}
                    </td>
                    <td className="px-4 py-4 text-xs capitalize">
                      {lead.payment_gateway || "-"}
                    </td>
                    <td className="px-4 py-4 text-xs text-gray-500">
                      {new Date(lead.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-500">
          Last updated: {data?.timestamp ? new Date(data.timestamp).toLocaleString() : "-"}
        </div>
      </div>
    </div>
  );
}

// Helper Components

function StatCard({
  label,
  value,
  color,
  subtext,
  alert,
}: {
  label: string;
  value: number;
  color: "blue" | "green" | "yellow" | "red";
  subtext?: string;
  alert?: boolean;
}) {
  const colorClasses = {
    blue: "bg-blue-50 border-blue-200 text-blue-800",
    green: "bg-green-50 border-green-200 text-green-800",
    yellow: "bg-yellow-50 border-yellow-200 text-yellow-800",
    red: "bg-red-50 border-red-200 text-red-800",
  };

  return (
    <div
      className={`rounded-lg border p-6 ${colorClasses[color]} ${
        alert ? "animate-pulse" : ""
      }`}
    >
      <p className="text-sm font-medium opacity-75">{label}</p>
      <p className="text-3xl font-bold mt-1">{value.toLocaleString()}</p>
      {subtext && <p className="text-xs opacity-60 mt-1">{subtext}</p>}
    </div>
  );
}

function StatusBadge({ status }: { status: "pending" | "synced" | "failed" }) {
  const classes = {
    pending: "bg-yellow-100 text-yellow-800",
    synced: "bg-green-100 text-green-800",
    failed: "bg-red-100 text-red-800",
  };

  return (
    <span
      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${classes[status]}`}
    >
      {status}
    </span>
  );
}

function PaymentBadge({ status }: { status: "pending" | "paid" | "failed" | "refunded" | null }) {
  if (!status) {
    return <span className="text-gray-400 text-xs">-</span>;
  }

  const classes = {
    pending: "bg-yellow-100 text-yellow-800",
    paid: "bg-green-100 text-green-800",
    failed: "bg-red-100 text-red-800",
    refunded: "bg-purple-100 text-purple-800",
  };

  return (
    <span
      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${classes[status]}`}
    >
      {status}
    </span>
  );
}

function LegendItem({
  color,
  label,
  value,
}: {
  color: "green" | "yellow" | "red";
  label: string;
  value: number;
}) {
  const dotColors = {
    green: "bg-green-500",
    yellow: "bg-yellow-500",
    red: "bg-red-500",
  };

  return (
    <div className="flex items-center gap-2">
      <span className={`w-3 h-3 rounded-full ${dotColors[color]}`} />
      <span className="text-sm text-gray-600">{label}</span>
      <span className="text-sm font-medium text-gray-800">{value}</span>
    </div>
  );
}
