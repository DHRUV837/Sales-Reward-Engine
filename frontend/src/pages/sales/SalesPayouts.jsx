import React, { useState, useEffect } from "react";
import SalesLayout from "../../layouts/SalesLayout";
import { useAuth } from "../../context/AuthContext";
import api from "../../api";
import PageHeader from "../../components/common/PageHeader";

const SalesPayouts = () => {
    const { auth } = useAuth();
    const [payouts, setPayouts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Summary Stats
    const [totalEarned, setTotalEarned] = useState(0);
    const [totalPending, setTotalPending] = useState(0);
    const [lifetimeMetrics, setLifetimeMetrics] = useState({
        lifetimeIncentive: 0,
        monthsActive: 0,
        avgMonthly: 0,
        bestMonthEver: { month: 'N/A', amount: 0 }
    });

    const fetchPayouts = async () => {
        try {
            // Reusing existing endpoint: GET /deals?userId=...
            // Only 'Approved' deals are eligible for payouts
            const res = await api.get(`/api/deals?userId=${auth.user.id}`);

            const approvedDeals = res.data.filter(d => d.status === "Approved");

            // Sort by payout date (recent first) or deal date
            approvedDeals.sort((a, b) => new Date(b.date) - new Date(a.date));

            setPayouts(approvedDeals);

            // Calculate Totals
            const earned = approvedDeals
                .filter(d => d.payoutStatus === "PAID")
                .reduce((sum, d) => sum + d.incentive, 0);

            const pending = approvedDeals
                .filter(d => !d.payoutStatus || d.payoutStatus === "PENDING")
                .reduce((sum, d) => sum + d.incentive, 0);

            setTotalEarned(earned);
            setTotalPending(pending);

            // Calculate Lifetime Metrics
            const lifetimeTotal = approvedDeals.reduce((sum, d) => sum + d.incentive, 0);

            // Monthly breakdown for lifetime
            const monthlyBreakdown = approvedDeals.reduce((acc, d) => {
                if (!d.date) return acc;
                const date = new Date(d.date);
                const key = `${date.getFullYear()}-${date.getMonth()}`;
                const monthName = date.toLocaleString('default', { month: 'long', year: 'numeric' });

                if (!acc[key]) acc[key] = { month: monthName, amount: 0 };
                acc[key].amount += d.incentive;
                return acc;
            }, {});

            const monthsWithDeals = Object.keys(monthlyBreakdown).length;
            const avgMonthly = monthsWithDeals > 0 ? lifetimeTotal / monthsWithDeals : 0;

            // Find best month
            const bestMonth = Object.values(monthlyBreakdown).reduce((max, curr) =>
                curr.amount > (max?.amount || 0) ? curr : max
                , { month: 'N/A', amount: 0 });

            setLifetimeMetrics({
                lifetimeIncentive: lifetimeTotal,
                monthsActive: monthsWithDeals,
                avgMonthly: avgMonthly,
                bestMonthEver: bestMonth
            });

        } catch (err) {
            console.error("Failed to fetch payouts", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (auth?.user?.id) {
            fetchPayouts();
        }
    }, [auth]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "-";
        return new Date(dateStr).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'short', year: 'numeric'
        });
    };

    return (
        <SalesLayout>
            <PageHeader
                heading="Payout History"
                subtitle="Track processed payments and pending payouts."
            />

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="relative overflow-hidden card-modern p-8 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/30 dark:to-green-900/20 border border-emerald-100 dark:border-emerald-800/50 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300 group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-full blur-3xl -mr-10 -mt-10 transition-transform duration-500 group-hover:scale-150"></div>
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-sm font-black text-emerald-800 dark:text-emerald-300 uppercase tracking-widest">Total Paid</p>
                            <div className="p-2 bg-emerald-100 dark:bg-emerald-800/50 rounded-lg text-emerald-600 dark:text-emerald-300">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            </div>
                        </div>
                        <p className="text-4xl font-extrabold text-emerald-900 dark:text-emerald-50 mb-1 tracking-tight">{formatCurrency(totalEarned)}</p>
                        <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Deposited to bank</p>
                    </div>
                </div>

                <div className="relative overflow-hidden card-modern p-8 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/20 border border-amber-100 dark:border-amber-800/50 hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-300 group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 dark:bg-amber-500/20 rounded-full blur-3xl -mr-10 -mt-10 transition-transform duration-500 group-hover:scale-150"></div>
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-sm font-black text-amber-800 dark:text-amber-300 uppercase tracking-widest">Pending Payout</p>
                            <div className="p-2 bg-amber-100 dark:bg-amber-800/50 rounded-lg text-amber-600 dark:text-amber-300">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                        </div>
                        <p className="text-4xl font-extrabold text-amber-900 dark:text-amber-50 mb-1 tracking-tight">{formatCurrency(totalPending)}</p>
                        <p className="text-sm font-medium text-amber-600 dark:text-amber-400">Processing / Approval Pending</p>
                    </div>
                </div>
            </div>

            {/* Lifetime Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="relative overflow-hidden card-modern p-6 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border border-purple-100 dark:border-purple-800/50 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300 group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-2xl -mr-6 -mt-6 transition-transform duration-500 group-hover:scale-150"></div>
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-xs font-black text-purple-700 dark:text-purple-300 uppercase tracking-widest">Lifetime Earnings</p>
                            <div className="p-1.5 bg-purple-100 dark:bg-purple-800/50 rounded-md text-purple-600 dark:text-purple-300">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                        </div>
                        <p className="text-2xl font-extrabold text-purple-900 dark:text-purple-50 mb-1 tracking-tight">{formatCurrency(lifetimeMetrics.lifetimeIncentive)}</p>
                        <p className="text-xs font-medium text-purple-600 dark:text-purple-400">Since you joined</p>
                    </div>
                </div>

                <div className="relative overflow-hidden card-modern p-6 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 border border-cyan-100 dark:border-cyan-800/50 hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-300 group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 dark:bg-cyan-500/20 rounded-full blur-2xl -mr-6 -mt-6 transition-transform duration-500 group-hover:scale-150"></div>
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-xs font-black text-cyan-700 dark:text-cyan-300 uppercase tracking-widest">Months Active</p>
                            <div className="p-1.5 bg-cyan-100 dark:bg-cyan-800/50 rounded-md text-cyan-600 dark:text-cyan-300">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            </div>
                        </div>
                        <p className="text-2xl font-extrabold text-cyan-900 dark:text-cyan-50 mb-1 tracking-tight">{lifetimeMetrics.monthsActive}</p>
                        <p className="text-xs font-medium text-cyan-600 dark:text-cyan-400">Months with deals</p>
                    </div>
                </div>

                <div className="relative overflow-hidden card-modern p-6 bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-900/20 dark:to-emerald-900/20 border border-teal-100 dark:border-teal-800/50 hover:shadow-lg hover:shadow-teal-500/10 transition-all duration-300 group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/10 dark:bg-teal-500/20 rounded-full blur-2xl -mr-6 -mt-6 transition-transform duration-500 group-hover:scale-150"></div>
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-xs font-black text-teal-700 dark:text-teal-300 uppercase tracking-widest">Avg Monthly</p>
                            <div className="p-1.5 bg-teal-100 dark:bg-teal-800/50 rounded-md text-teal-600 dark:text-teal-300">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                            </div>
                        </div>
                        <p className="text-2xl font-extrabold text-teal-900 dark:text-teal-50 mb-1 tracking-tight">{formatCurrency(lifetimeMetrics.avgMonthly)}</p>
                        <p className="text-xs font-medium text-teal-600 dark:text-teal-400">Per active month</p>
                    </div>
                </div>

                <div className="relative overflow-hidden card-modern p-6 bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 border border-rose-100 dark:border-rose-800/50 hover:shadow-lg hover:shadow-rose-500/10 transition-all duration-300 group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 dark:bg-rose-500/20 rounded-full blur-2xl -mr-6 -mt-6 transition-transform duration-500 group-hover:scale-150"></div>
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-xs font-black text-rose-700 dark:text-rose-300 uppercase tracking-widest">Best Month Ever</p>
                            <div className="p-1.5 bg-rose-100 dark:bg-rose-800/50 rounded-md text-rose-600 dark:text-rose-300">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                            </div>
                        </div>
                        <p className="text-2xl font-extrabold text-rose-900 dark:text-rose-50 mb-1 tracking-tight">{formatCurrency(lifetimeMetrics.bestMonthEver.amount)}</p>
                        <p className="text-xs font-medium text-rose-600 dark:text-rose-400">{lifetimeMetrics.bestMonthEver.month}</p>
                    </div>
                </div>
            </div>

            {/* Payouts Table */}
            <div className="card-modern overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-surface-2 text-text-secondary uppercase text-xs font-semibold">
                            <tr>
                                <th className="px-6 py-4">Deal Date</th>
                                <th className="px-6 py-4">Deal Amount</th>
                                <th className="px-6 py-4">Commission</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Payout Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-subtle">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-text-muted">Loading payouts...</td>
                                </tr>
                            ) : payouts.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-text-muted">
                                        No approved deals found yet.
                                    </td>
                                </tr>
                            ) : (
                                payouts.map((deal) => (
                                    <tr key={deal.id} className="hover:bg-surface-2/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-text-primary">
                                            {formatDate(deal.date)}
                                        </td>
                                        <td className="px-6 py-4 text-text-secondary">
                                            {formatCurrency(deal.amount)}
                                        </td>
                                        <td className="px-6 py-4 font-bold text-primary-600">
                                            {formatCurrency(deal.incentive)}
                                        </td>
                                        <td className="px-6 py-4">
                                            {deal.payoutStatus === "PAID" ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5"></span>
                                                    Paid
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 mr-1.5"></span>
                                                    Pending
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-text-secondary">
                                            {deal.payoutStatus === "PAID" ? formatDate(deal.payoutDate) : "-"}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </SalesLayout>
    );
};

export default SalesPayouts;
