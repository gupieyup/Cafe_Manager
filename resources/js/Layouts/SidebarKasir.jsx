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
            class="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0 border-5 border-[#1EAADF]"
            aria-label="Sidebar"
        >
            <div className="container mx-auto py-[13px] bg-[#1EAADF]">
                <div className="flex justify-center items-center    ">
                    <a
                        href="/kasir/home"
                        className="font-serif font-semibold text-xl text-white"
                    >
                        CAFE MANAGER
                    </a>
                </div>
            </div>
            <div className="border-3 border-[#1EAADF]"></div>
            <div
                class="h-full px-3 py-2 overflow-y-auto bg-gray-50"
                style={{ backgroundColor: "#1EAADF" }}
            >
                <div className="flex flex-col p-2 mb-2">
                    <span className="dark:text-white text-xl">
                        {kasir.email}
                    </span>
                    <span className="dark:text-slate-300 text-l">
                        {kasir.role}
                    </span>
                </div>
                <div className="mb-2">
                    <div className="flex items-center text-white font-medium space-y-1">
                        <a
                            href="/kasir/home"
                            className="flex items-center w-full gap-2 px-2 py-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-white group"
                        >
                            <FaHome style={{ fontSize: "24px" }} />
                            <span className="text-md">Home</span>
                        </a>
                    </div>
                </div>
                <div className="mb-2">
                    <div className="flex items-center text-white font-medium space-y-1">
                        <a
                            href="#"
                            className="flex items-center w-full gap-2 px-2 py-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-white group"
                        >
                            <MdFastfood style={{ fontSize: "24px" }} />
                            <span className="text-md">Menu</span>
                        </a>
                    </div>
                </div>
                <div className="mb-2">
                    <div className="flex items-center text-white font-medium space-y-1">
                        <a
                            href="#"
                            className="flex items-center w-full gap-2 px-2 py-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-white group"
                        >
                            <IoReceipt style={{ fontSize: "24px" }} />
                            <span className="text-md">Transaction</span>
                        </a>
                    </div>
                </div>
                <div className="mb-2">
                    <div className="flex items-center text-white font-medium space-y-1">
                        <a
                            href="#"
                            className="flex items-center w-full gap-2 px-2 py-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-white group"
                        >
                            <FaHistory style={{ fontSize: "24px" }} />
                            <span className="text-md">History</span>
                        </a>
                    </div>
                </div>
                <div className="mb-2">
                    <div className="flex items-center text-white font-medium space-y-1">
                        <button
                            onClick={handleLogout}
                            className="flex items-center w-full gap-2 px-2 py-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-white group"
                        >
                            <TbLogout style={{ fontSize: "24px" }} />
                            <span className="text-md">Logout</span>
                        </button>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default SidebarKasir;