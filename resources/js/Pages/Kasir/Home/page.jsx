import { Inertia } from "@inertiajs/inertia";
import KasirLayout from "../../../Layouts/KasirLayout";
import React from "react";

export default function Home({ kasir, statistics, menuStats, recentTransactions }) {
    const formatTime = () => {
        return new Date().toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long', 
            day: 'numeric'
        });
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
        }).format(value);
    };

    const formatDateTime = (dateString) => {
        return new Date(dateString).toLocaleString('id-ID', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const navigateToTransaction = () => {
        Inertia.visit('/kasir/transaction');
    };

    const navigateToHistory = () => {
        Inertia.visit('/kasir/history');
    };

    return (
        <KasirLayout kasir={kasir}>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
                <div className="p-6 max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-200/50 shadow-sm">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                Cashier Dashboard
                            </h1>
                            <p className="text-slate-500 mt-1 text-sm">
                                Welcome back, {kasir.email} • {formatTime()}
                            </p>
                        </div>
                    </div>

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl border border-slate-200/50 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500 mb-1">
                                        Transaksi Hari Ini
                                    </p>
                                    <p className="text-2xl font-bold text-slate-800">
                                        {statistics.todayTransactions}
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl border border-slate-200/50 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500 mb-1">
                                        Pendapatan Hari Ini
                                    </p>
                                    <p className="text-2xl font-bold text-slate-800">
                                        {formatCurrency(statistics.todayRevenue)}
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl border border-slate-200/50 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500 mb-1">
                                        Transaksi Bulan Ini
                                    </p>
                                    <p className="text-2xl font-bold text-slate-800">
                                        {statistics.monthTransactions}
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl border border-slate-200/50 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500 mb-1">
                                        Pendapatan Bulan Ini
                                    </p>
                                    <p className="text-2xl font-bold text-slate-800">
                                        {formatCurrency(statistics.monthRevenue)}
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Data Overview */}
                    <div className="grid grid-cols-1 gap-6 mb-8">
                        {/* Menu Status */}
                        <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl border border-slate-200/50 shadow-sm">
                            <h2 className="text-xl font-semibold text-slate-800 mb-4">Menu Status</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-200">
                                    <div className="text-2xl font-bold text-blue-600">{menuStats.availableMenus}</div>
                                    <div className="text-sm text-blue-600">Available</div>
                                </div>
                                <div className="text-center p-4 bg-amber-50 rounded-xl border border-amber-200">
                                    <div className="text-2xl font-bold text-amber-600">{menuStats.lowStockMenus}</div>
                                    <div className="text-sm text-amber-600">Low Stock</div>
                                </div>
                                <div className="text-center p-4 bg-red-50 rounded-xl border border-red-200">
                                    <div className="text-2xl font-bold text-red-600">{menuStats.outOfStockMenus}</div>
                                    <div className="text-sm text-red-600">Out of Stock</div>
                                </div>
                                <div className="text-center p-4 bg-gray-50 rounded-xl border border-gray-200">
                                    <div className="text-2xl font-bold text-gray-600">{menuStats.totalMenus}</div>
                                    <div className="text-sm text-gray-600">Total Menu</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Transactions */}
                    <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl border border-slate-200/50 shadow-sm mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-slate-800">Recent Transactions</h2>
                            <button
                                onClick={navigateToHistory}
                                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                            >
                                View All
                            </button>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead>
                                    <tr className="bg-gray-50/50 border-b border-gray-200/60">
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            ID
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Waktu
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Items
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Total
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200/60">
                                    {recentTransactions.length > 0 ? (
                                        recentTransactions.map((transaction) => (
                                            <tr key={transaction.id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-4 py-3">
                                                    <span className="font-medium text-gray-900">#{transaction.id}</span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className="text-sm text-gray-600">
                                                        {formatDateTime(transaction.waktu)}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="text-sm text-gray-600">
                                                        {transaction.items.slice(0, 2).map((item, index) => (
                                                            <div key={index}>
                                                                {item.namaMenu} x{item.qty}
                                                            </div>
                                                        ))}
                                                        {transaction.items.length > 2 && (
                                                            <div className="text-xs text-gray-500">
                                                                +{transaction.items.length - 2} more items
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className="font-semibold text-gray-900">
                                                        {formatCurrency(transaction.hargaTotal)}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="px-4 py-8 text-center text-gray-500">
                                                No transactions yet
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </KasirLayout>
    );
}