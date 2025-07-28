import React from "react";
import { Inertia } from "@inertiajs/inertia"
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
    return (
        <aside
            id="default-sidebar"
            className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0 border-5" 
            style={{ borderColor: "#FFD1DC" }}
            aria-label="Sidebar"
        >
            <div className="container mx-auto py-[13px]" style={{ backgroundColor: "#FFD1DC" }}>
                <div className="flex justify-center items-center">
                    <a
                        href="/kasir/home"
                        className="font-serif font-semibold text-xl text-gray-800"
                    >
                        CAFE MANAGER
                    </a>
                </div>
            </div>
            <div className="border-3" style={{ borderColor: "#FFD1DC" }}></div>
            <div
                className="h-full px-3 py-2 overflow-y-auto"
                style={{ backgroundColor: "#FFD1DC" }}>
                <div className="flex flex-col p-2 mb-2">
                    <span className="text-gray-800 text-xl">
                        {kasir.email}
                    </span>
                    <span className="text-gray-700 text-l">
                        {kasir.role}
                    </span>
                </div>
                <div className="mb-2">
                    <div className="flex items-center font-medium space-y-1">
                        <a
                            href="/kasir/home"
                            className="flex items-center w-full gap-2 px-3 py-3 bg-white text-gray-800 rounded-lg hover:bg-gray-50 transition-colors duration-200 border border-gray-200 shadow-sm"
                        >
                            <FaHome style={{ fontSize: "20px", color: "#000000" }} />
                            <span className="text-md">Home</span>
                        </a>
                    </div>
                </div>
                <div className="mb-2">
                    <div className="flex items-center font-medium space-y-1">
                        <a
                            href="#"
                            className="flex items-center w-full gap-2 px-3 py-3 bg-white text-gray-800 rounded-lg hover:bg-gray-50 transition-colors duration-200 border border-gray-200 shadow-sm"
                        >
                            <MdFastfood style={{ fontSize: "20px", color: "#000000" }} />
                            <span className="text-md">Menu</span>
                        </a>
                    </div>
                </div>
                <div className="mb-2">
                    <div className="flex items-center font-medium space-y-1">
                        <a
                            href="#"
                            className="flex items-center w-full gap-2 px-3 py-3 bg-white text-gray-800 rounded-lg hover:bg-gray-50 transition-colors duration-200 border border-gray-200 shadow-sm"
                        >
                            <IoReceipt style={{ fontSize: "20px", color: "#000000" }} />
                            <span className="text-md">Transaction</span>
                        </a>
                    </div>
                </div>
                <div className="mb-2">
                    <div className="flex items-center font-medium space-y-1">
                        <a
                            href="#"
                            className="flex items-center w-full gap-2 px-3 py-3 bg-white text-gray-800 rounded-lg hover:bg-gray-50 transition-colors duration-200 border border-gray-200 shadow-sm"
                        >
                            <FaHistory style={{ fontSize: "20px", color: "#000000" }} />
                            <span className="text-md">History</span>
                        </a>
                    </div>
                </div>
                <div className="mb-2">
                    <div className="flex items-center font-medium space-y-1">
                        <button
                            onClick={handleLogout}
                            className="flex items-center w-full gap-2 px-3 py-3 bg-white text-gray-800 rounded-lg hover:bg-gray-50 transition-colors duration-200 border border-gray-200 shadow-sm"
                        >
                            <TbLogout style={{ fontSize: "20px", color: "#000000" }} />
                            <span className="text-md">Logout</span>
                        </button>
                    </div>
                </div>

            </div>
        </aside>
    );
};

export default SidebarKasir;