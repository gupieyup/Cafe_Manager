import React from "react";
import { Inertia } from "@inertiajs/inertia";
import { FaHome } from "react-icons/fa";
import { MdFastfood } from "react-icons/md";
import { TbLogout } from "react-icons/tb";
import { IoReceipt } from "react-icons/io5";
import { FaHistory } from "react-icons/fa";

const SidebarKasir = ({ kasir }) => {
    const handleLogout = (e) => {
        e.preventDefault();
        Inertia.post("/logout");
    };

    const menuItems = [
        { href: "/kasir/home", icon: FaHome, label: "Home" },
        { href: "/kasir/transaction", icon: IoReceipt, label: "Transaction" },
        { href: "/kasir/history", icon: FaHistory, label: "History" },
    ];

    return (
        <aside
            id="default-sidebar"
            className="fixed top-0 left-0 z-40 w-72 h-screen transition-transform -translate-x-full sm:translate-x-0"
            aria-label="Sidebar"
        >
            {/* Gradient Background */}
            <div className="h-full bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 backdrop-blur-xl border-r border-pink-200/30">
                {/* Header */}
                <div className="px-6 py-8 border-b border-pink-200/20">
                    <div className="flex items-center justify-center mb-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center shadow-lg">
                            <MdFastfood className="text-white text-2xl" />
                        </div>
                    </div>
                    <div className="text-center">
                        <h1 className="font-light text-2xl text-slate-800 tracking-wide mb-1">
                            CAFE MANAGER
                        </h1>
                        <div className="w-12 h-0.5 bg-gradient-to-r from-pink-400 to-rose-400 mx-auto rounded-full"></div>
                    </div>
                </div>

                {/* User Info */}
                <div className="px-6 py-6 border-b border-pink-200/20">
                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-pink-200/30 shadow-sm">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-rose-400 rounded-xl flex items-center justify-center">
                                <span className="text-white font-semibold text-sm">
                                    {kasir.email.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-slate-800 font-medium text-sm truncate">
                                    {kasir.email}
                                </p>
                                <p className="text-slate-500 text-xs uppercase tracking-wide">
                                    {kasir.role}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation Transaction */}
                <div className="px-4 py-6 flex-1">
                    <nav className="space-y-2">
                        {menuItems.map((item, index) => {
                            const IconComponent = item.icon;
                            return (
                                <a
                                    key={index}
                                    href={item.href}
                                    className="group flex items-center px-4 py-3 text-slate-700 rounded-xl hover:bg-white/70 hover:shadow-sm transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5 backdrop-blur-sm border border-transparent hover:border-pink-200/30"
                                >
                                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-pink-200/50 to-rose-200/50 group-hover:from-pink-300/60 group-hover:to-rose-300/60 transition-all duration-300 mr-3">
                                        <IconComponent className="text-slate-600 text-lg group-hover:text-slate-700 transition-colors duration-300" />
                                    </div>
                                    <span className="font-medium text-sm tracking-wide group-hover:text-slate-800 transition-colors duration-300">
                                        {item.label}
                                    </span>
                                </a>
                            );
                        })}
                    </nav>
                </div>

                {/* Logout Button */}
                <div className="px-4 pb-6">
                    <button
                        onClick={handleLogout}
                        className="group flex items-center w-full px-4 py-3 text-slate-700 rounded-xl hover:bg-red-50/70 hover:shadow-sm transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5 backdrop-blur-sm border border-transparent hover:border-red-200/30"
                    >
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-red-100/50 to-red-200/50 group-hover:from-red-200/60 group-hover:to-red-300/60 transition-all duration-300 mr-3">
                            <TbLogout className="text-red-500 text-lg group-hover:text-red-600 transition-colors duration-300" />
                        </div>
                        <span className="font-medium text-sm tracking-wide group-hover:text-red-600 transition-colors duration-300">
                            Logout
                        </span>
                    </button>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-32 right-6 w-24 h-24 bg-gradient-to-br from-pink-300/20 to-rose-300/20 rounded-full blur-2xl"></div>
                <div className="absolute bottom-32 left-6 w-20 h-20 bg-gradient-to-br from-rose-300/20 to-pink-300/20 rounded-full blur-2xl"></div>
            </div>
        </aside>
    );
};

export default SidebarKasir;
