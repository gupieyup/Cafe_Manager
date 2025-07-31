import { Inertia } from "@inertiajs/inertia";
import ManagerLayout from "../../../Layouts/ManagerLayout";
import React from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
} from "recharts";

export default function Home({ manager, chartData, statistics }) {
    // Modern color palette
    const COLORS = ["#6366f1", "#06b6d4", "#10b981", "#f59e0b", "#ef4444"];

    // Format currency
    const formatCurrency = (value) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
        }).format(value);
    };

    return (
        <ManagerLayout manager={manager}>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
                <div className="p-6 max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-200/50 shadow-sm">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                    Manager Dashboard
                            </h1>
                            <p className="text-slate-500 mt-1 text-sm">
                                Welcome Back,  {manager.email}
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
                                        {statistics.totalTransaksiHariIni}
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                                    <svg
                                        className="w-6 h-6 text-white"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                                        />
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
                                        {formatCurrency(
                                            statistics.totalPendapatanHariIni
                                        )}
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                                    <svg
                                        className="w-6 h-6 text-white"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                                        />
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
                                        {statistics.totalTransaksiBulanIni}
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                                    <svg
                                        className="w-6 h-6 text-white"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                        />
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
                                        {formatCurrency(
                                            statistics.totalPendapatanBulanIni
                                        )}
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center">
                                    <svg
                                        className="w-6 h-6 text-white"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Charts Row 1 */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        {/* Daily Transactions Chart */}
                        <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl border border-slate-200/50 shadow-sm">
                            <div className="mb-4">
                                <h2 className="text-xl font-semibold text-slate-800">
                                    Transaksi Harian
                                </h2>
                                <p className="text-sm text-slate-500">
                                    7 hari terakhir
                                </p>
                            </div>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={chartData.daily}>
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        stroke="#e2e8f0"
                                    />
                                    <XAxis
                                        dataKey="date"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 12, fill: "#64748b" }}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 12, fill: "#64748b" }}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            background:
                                                "rgba(255, 255, 255, 0.95)",
                                            border: "none",
                                            borderRadius: "12px",
                                            boxShadow:
                                                "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                                        }}
                                        formatter={(value, name) => [
                                            name === "total_pendapatan"
                                                ? formatCurrency(value)
                                                : value,
                                            name === "total_pendapatan"
                                                ? "Total Pendapatan"
                                                : "Total Transaksi",
                                        ]}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="total_transaksi"
                                        stroke="#6366f1"
                                        strokeWidth={3}
                                        dot={{
                                            fill: "#6366f1",
                                            strokeWidth: 2,
                                            r: 4,
                                        }}
                                        activeDot={{
                                            r: 6,
                                            stroke: "#6366f1",
                                            strokeWidth: 2,
                                        }}
                                        name="Total Transaksi"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Monthly Revenue Chart */}
                        <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl border border-slate-200/50 shadow-sm">
                            <div className="mb-4">
                                <h2 className="text-xl font-semibold text-slate-800">
                                    Pendapatan Bulanan
                                </h2>
                                <p className="text-sm text-slate-500">
                                    6 bulan terakhir
                                </p>
                            </div>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={chartData.monthly}>
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        stroke="#e2e8f0"
                                    />
                                    <XAxis
                                        dataKey="month"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 12, fill: "#64748b" }}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 12, fill: "#64748b" }}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            background:
                                                "rgba(255, 255, 255, 0.95)",
                                            border: "none",
                                            borderRadius: "12px",
                                            boxShadow:
                                                "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                                        }}
                                        formatter={(value) => [
                                            formatCurrency(value),
                                            "Total Pendapatan",
                                        ]}
                                    />
                                    <Bar
                                        dataKey="total_pendapatan"
                                        fill="url(#gradientBar1)"
                                        radius={[6, 6, 0, 0]}
                                        name="Total Pendapatan"
                                    />
                                    <defs>
                                        <linearGradient
                                            id="gradientBar1"
                                            x1="0"
                                            y1="0"
                                            x2="0"
                                            y2="1"
                                        >
                                            <stop
                                                offset="0%"
                                                stopColor="#10b981"
                                            />
                                            <stop
                                                offset="100%"
                                                stopColor="#059669"
                                            />
                                        </linearGradient>
                                    </defs>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Charts Row 2 */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Top Menus Pie Chart */}
                        <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl border border-slate-200/50 shadow-sm">
                            <div className="mb-4">
                                <h2 className="text-xl font-semibold text-slate-800">
                                    Menu Terlaris
                                </h2>
                                <p className="text-sm text-slate-500">
                                    30 hari terakhir
                                </p>
                            </div>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={chartData.topMenus}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) =>
                                            `${name} ${(percent * 100).toFixed(
                                                0
                                            )}%`
                                        }
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {chartData.topMenus.map(
                                            (entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={
                                                        COLORS[
                                                            index %
                                                                COLORS.length
                                                        ]
                                                    }
                                                />
                                            )
                                        )}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            background:
                                                "rgba(255, 255, 255, 0.95)",
                                            border: "none",
                                            borderRadius: "12px",
                                            boxShadow:
                                                "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Monthly Transactions Chart */}
                        <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl border border-slate-200/50 shadow-sm">
                            <div className="mb-4">
                                <h2 className="text-xl font-semibold text-slate-800">
                                    Jumlah Transaksi Bulanan
                                </h2>
                                <p className="text-sm text-slate-500">
                                    Tren transaksi per bulan
                                </p>
                            </div>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={chartData.monthly}>
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        stroke="#e2e8f0"
                                    />
                                    <XAxis
                                        dataKey="month"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 12, fill: "#64748b" }}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 12, fill: "#64748b" }}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            background:
                                                "rgba(255, 255, 255, 0.95)",
                                            border: "none",
                                            borderRadius: "12px",
                                            boxShadow:
                                                "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                                        }}
                                    />
                                    <Bar
                                        dataKey="total_transaksi"
                                        fill="url(#gradientBar2)"
                                        radius={[6, 6, 0, 0]}
                                        name="Total Transaksi"
                                    />
                                    <defs>
                                        <linearGradient
                                            id="gradientBar2"
                                            x1="0"
                                            y1="0"
                                            x2="0"
                                            y2="1"
                                        >
                                            <stop
                                                offset="0%"
                                                stopColor="#f59e0b"
                                            />
                                            <stop
                                                offset="100%"
                                                stopColor="#d97706"
                                            />
                                        </linearGradient>
                                    </defs>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </ManagerLayout>
    );
}
