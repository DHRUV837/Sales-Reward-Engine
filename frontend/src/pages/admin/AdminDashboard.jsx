import SalesLayout from "../../layouts/SalesLayout";
import StatCard from "../../components/common/StatCard";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import PageHeader from "../../components/common/PageHeader";

const AdminDashboard = () => {
    const [deals, setDeals] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch Data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get("http://localhost:8080/deals");
                setDeals(res.data);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch admin data", err);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <SalesLayout><div className="p-8 text-center">Loading Dashboard...</div></SalesLayout>;

    // --- 1. Key Metrics ---
    const pendingDeals = deals.filter(d => (d.status || "").toLowerCase() === "submitted" || (d.status || "").toLowerCase() === "pending");
    const inProgressDeals = deals.filter(d => (d.status || "").toLowerCase() === "in_progress");
    const approvedDeals = deals.filter(d => (d.status || "").toLowerCase() === "approved");
    const totalPayout = approvedDeals.reduce((acc, d) => acc + (d.incentive || 0), 0);
    const activeUsers = new Set(deals.map(d => d.user?.id).filter(Boolean)).size;

    // --- 2. Charts Data ---
    const statusCounts = deals.reduce((acc, d) => {
        const status = d.status || "Unknown";
        acc[status] = (acc[status] || 0) + 1;
        return acc;
    }, {});
    const statusData = [
        { name: "Approved", value: statusCounts["Approved"] || 0, color: "#10B981" },
        { name: "Submitted", value: statusCounts["Submitted"] || 0, color: "#F59E0B" },
        { name: "Rejected", value: statusCounts["Rejected"] || 0, color: "#EF4444" },
    ].filter(d => d.value > 0);

    // --- 3. Top Performers (Preview) ---
    const userStats = {};
    approvedDeals.forEach(d => {
        if (!d.user) return;
        if (!userStats[d.user.id]) userStats[d.user.id] = { name: d.user.name, incentive: 0 };
        userStats[d.user.id].incentive += (d.incentive || 0);
    });
    const topPerformers = Object.values(userStats).sort((a, b) => b.incentive - a.incentive).slice(0, 3);

    return (
        <SalesLayout>
            <div className="space-y-8 animate-in fade-in duration-500">

                <PageHeader
                    heading="System Control Center"
                    subtitle="Monitor system health, approvals, and sales performance."
                />

                {/* ALERT SECTION (Only if needed) */}
                {/* ALERT SECTION */}
                {pendingDeals.length > 0 ? (
                    <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 p-4 rounded-r-lg flex justify-between items-center shadow-lg animate-pulse-subtle">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-amber-100 dark:bg-amber-800 rounded-full text-amber-600 dark:text-amber-200">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                            </div>
                            <div>
                                <h3 className="font-bold text-amber-900 dark:text-amber-100 text-lg">Action Required</h3>
                                <p className="text-amber-800 dark:text-amber-200">{pendingDeals.length} Deal{pendingDeals.length !== 0 && 's'} Pending Approval</p>
                            </div>
                        </div>
                        <Link to="/admin/approvals" className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg font-bold shadow-md transform transition-all hover:-translate-y-0.5">
                            Review Now →
                        </Link>
                    </div>
                ) : null}

                {/* IN PROGRESS VELOCITY TRACKER (New Enterprise Feature) */}
                {inProgressDeals.length > 0 && (
                    <div className="bg-indigo-50 dark:bg-indigo-900/20 border-l-4 border-indigo-500 p-4 rounded-r-lg flex justify-between items-center shadow-sm mt-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-100 dark:bg-indigo-800 rounded-full text-indigo-600 dark:text-indigo-200">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                            </div>
                            <div>
                                <h3 className="font-bold text-indigo-900 dark:text-indigo-100 text-lg">Sales Velocity</h3>
                                <p className="text-indigo-800 dark:text-indigo-200">
                                    <span className="font-bold">{inProgressDeals.length} deals</span> are currently being worked on by sales team.
                                </p>
                            </div>
                        </div>
                        <div className="flex -space-x-2 overflow-hidden">
                            {/* Show avatars of users working on deals (mock or real if user data available) */}
                            {Array.from(new Set(inProgressDeals.map(d => d.user?.name || "U"))).slice(0, 5).map((name, i) => (
                                <div key={i} className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-gray-800 bg-indigo-400 flex items-center justify-center text-xs font-bold text-white" title={name}>
                                    {name.charAt(0)}
                                </div>
                            ))}
                            {new Set(inProgressDeals.map(d => d.user?.name)).size > 5 && (
                                <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-gray-800 bg-gray-400 flex items-center justify-center text-xs font-bold text-white">
                                    +
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {pendingDeals.length === 0 && inProgressDeals.length === 0 && (
                    <div className="bg-emerald-50 dark:bg-emerald-900/20 border-l-4 border-emerald-500 p-4 rounded-r-lg flex items-center gap-3 shadow-sm">
                        <div className="p-2 bg-emerald-100 dark:bg-emerald-800 rounded-full text-emerald-600 dark:text-emerald-200">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <div>
                            <h3 className="font-bold text-emerald-900 dark:text-emerald-100">All caught up!</h3>
                            <p className="text-emerald-800 dark:text-emerald-200 text-sm">No pending approvals requiring your attention.</p>
                        </div>
                    </div>
                )}

                {/* QUICK ACTIONS */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Link to="/admin/users" className="card-modern p-4 hover:bg-surface-2 transition-colors flex flex-col items-center justify-center gap-2 group text-center">
                        <div className="p-3 bg-blue-100 text-blue-600 rounded-full group-hover:scale-110 transition-transform">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                        </div>
                        <span className="font-bold text-sm text-text-primary">Manage Users</span>
                    </Link>
                    <Link to="/admin/simulation" className="card-modern p-4 hover:bg-surface-2 transition-colors flex flex-col items-center justify-center gap-2 group text-center">
                        <div className="p-3 bg-purple-100 text-purple-600 rounded-full group-hover:scale-110 transition-transform">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                        </div>
                        <span className="font-bold text-sm text-text-primary">Policy Sim</span>
                    </Link>
                    <Link to="/admin/audit-logs" className="card-modern p-4 hover:bg-surface-2 transition-colors flex flex-col items-center justify-center gap-2 group text-center">
                        <div className="p-3 bg-gray-100 text-gray-600 rounded-full group-hover:scale-110 transition-transform">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                        </div>
                        <span className="font-bold text-sm text-text-primary">Audit Logs</span>
                    </Link>
                    <Link to="/admin/performance" className="card-modern p-4 hover:bg-surface-2 transition-colors flex flex-col items-center justify-center gap-2 group text-center">
                        <div className="p-3 bg-emerald-100 text-emerald-600 rounded-full group-hover:scale-110 transition-transform">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                        </div>
                        <span className="font-bold text-sm text-text-primary">Performance</span>
                    </Link>
                </div>

                {/* METRICS ROW */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <StatCard title="Total Deals" value={deals.length} gradient="primary" />
                    <Link to="/admin/approvals" className={`transform transition-all duration-300 hover:-translate-y-1 block ${pendingDeals.length > 0 ? "ring-2 ring-amber-500 ring-offset-2 rounded-xl" : ""}`}>
                        <StatCard
                            title="Pending Approvals"
                            value={pendingDeals.length}
                            gradient={pendingDeals.length > 0 ? "accent" : "primary"}
                            icon="clock"
                        />
                    </Link>
                    <StatCard title="Active Users" value={activeUsers} gradient="blue" />
                    <StatCard title="In Progress Value" value={`₹${inProgressDeals.reduce((a, b) => a + (b.amount || 0), 0).toLocaleString()}`} gradient="indigo" icon="trending-up" />
                </div>

                {/* INSIGHTS GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Status Chart */}
                    <div className="card-modern p-6 lg:col-span-1">
                        <h3 className="font-bold text-text-primary mb-4">Deal Status</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                        {statusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Top Performers */}
                    <div className="card-modern p-6 lg:col-span-2">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-text-primary">Top Performers</h3>
                            <Link to="/admin/performance" className="text-sm text-primary-600 hover:underline">View All</Link>
                        </div>
                        <div className="space-y-3">
                            {topPerformers.map((user, idx) => (
                                <div key={user.name} className="flex items-center justify-between p-4 bg-surface-2 rounded-xl border border-border-subtle hover:scale-[1.01] transition-transform">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${idx === 0 ? "bg-yellow-500" : idx === 1 ? "bg-gray-400" : "bg-orange-500"}`}>
                                            {idx + 1}
                                        </div>
                                        <span className="font-semibold text-text-primary">{user.name}</span>
                                    </div>
                                    <span className="font-bold text-emerald-600">₹{user.incentive.toLocaleString()}</span>
                                </div>
                            ))}
                            {topPerformers.length === 0 && <p className="text-text-muted">No data available.</p>}
                        </div>
                    </div>
                </div>
            </div>
        </SalesLayout>
    );
};

export default AdminDashboard;
