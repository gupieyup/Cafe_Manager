import { Inertia } from "@inertiajs/inertia";
import ManagerLayout from "../../../Layouts/ManagerLayout";
import React, { useState, useEffect, useRef } from "react";

export default function Menu({ manager, menus, flash }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedMenu, setSelectedMenu] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterKategori, setFilterKategori] = useState("");
    const [sortBy, setSortBy] = useState("created_at");
    const [sortOrder, setSortOrder] = useState("desc");
    const [isStockModalOpen, setIsStockModalOpen] = useState(false);
    const [stockMenu, setStockMenu] = useState(null);
    const [newStock, setNewStock] = useState(0);
    const [availableCategories, setAvailableCategories] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    // Track flash messages to prevent duplicates
    const processedFlash = useRef(new Set());

    const [formData, setFormData] = useState({
        namaMenu: "",
        deskripsi: "",
        harga: "",
        jumlahStok: "",
        kategori: "",
    });

    // Alert system
    const showAlert = (message, type = "success") => {
        const id = Date.now();
        const alert = { id, message, type };
        setAlerts((prev) => [...prev, alert]);

        // Auto remove alert after 5 seconds
        setTimeout(() => {
            setAlerts((prev) => prev.filter((a) => a.id !== id));
        }, 5000);
    };

    const removeAlert = (id) => {
        setAlerts((prev) => prev.filter((a) => a.id !== id));
    };

    // Initialize categories from menus
    useEffect(() => {
        const uniqueCategories = [
            ...new Set(menus.map((menu) => menu.kategori)),
        ].filter((cat) => cat);
        setAvailableCategories(uniqueCategories);
    }, [menus]);

    // Handle flash messages without duplication - improved
    useEffect(() => {
        if (flash) {
            // Create a unique key based on flash content and timestamp
            const flashKey = `${JSON.stringify(flash)}-${Date.now()}`;

            // Clear previous flash tracking periodically to prevent memory buildup
            if (processedFlash.current.size > 10) {
                processedFlash.current.clear();
            }

            if (!processedFlash.current.has(flashKey)) {
                processedFlash.current.add(flashKey);

                // Small delay to ensure this runs after any duplicate attempts
                setTimeout(() => {
                    if (flash?.success) {
                        showAlert(flash.success, "success");
                    }
                    if (flash?.error) {
                        showAlert(flash.error, "error");
                    }
                    if (flash?.warning) {
                        showAlert(flash.warning, "warning");
                    }
                    if (flash?.info) {
                        showAlert(flash.info, "info");
                    }
                }, 10);
            }
        }
    }, [flash]);

    // Filter and sort menus
    const filteredMenus = menus
        .filter((menu) => {
            const matchesSearch =
                menu.namaMenu
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                menu.deskripsi.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesKategori =
                filterKategori === "" || menu.kategori === filterKategori;
            return matchesSearch && matchesKategori;
        })
        .sort((a, b) => {
            let aValue = a[sortBy];
            let bValue = b[sortBy];

            if (sortBy === "harga" || sortBy === "jumlahStok") {
                aValue = parseFloat(aValue);
                bValue = parseFloat(bValue);
            }

            if (sortOrder === "asc") {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const openAddModal = () => {
        setIsEditMode(false);
        setSelectedMenu(null);
        setFormData({
            namaMenu: "",
            deskripsi: "",
            harga: "",
            jumlahStok: "",
            kategori: "",
        });
        setIsModalOpen(true);
    };

    const openEditModal = (menu) => {
        setIsEditMode(true);
        setSelectedMenu(menu);
        setFormData({
            namaMenu: menu.namaMenu,
            deskripsi: menu.deskripsi,
            harga: menu.harga,
            jumlahStok: menu.jumlahStok,
            kategori: menu.kategori,
        });
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isEditMode && selectedMenu) {
            Inertia.put(`/manager/menu/${selectedMenu.id}`, formData, {
                onSuccess: () => {
                    setIsModalOpen(false);
                },
            });
        } else {
            Inertia.post("/manager/menu", formData, {
                onSuccess: () => {
                    setIsModalOpen(false);
                },
            });
        }
    };

    const openDeleteConfirm = (menu) => {
        setDeleteConfirm(menu);
    };

    const handleDelete = () => {
        if (deleteConfirm) {
            Inertia.delete(`/manager/menu/${deleteConfirm.id}`, {
                onSuccess: () => {
                    setDeleteConfirm(null);
                },
            });
        }
    };

    const handleStockUpdate = (e) => {
        e.preventDefault();
        Inertia.put(
            `/manager/menu/${stockMenu.id}/stock`,
            {
                jumlahStok: newStock,
            },
            {
                onSuccess: () => {
                    setIsStockModalOpen(false);
                },
            }
        );
    };

    const openStockModal = (menu) => {
        setStockMenu(menu);
        setNewStock(menu.jumlahStok);
        setIsStockModalOpen(true);
    };

    const formatRupiah = (number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
        }).format(number);
    };

    const getStockStatus = (stock) => {
        if (stock === 0)
            return {
                text: "Habis",
                color: "bg-red-50 text-red-700 border-red-200",
            };
        if (stock <= 5)
            return {
                text: "Stok Rendah",
                color: "bg-amber-50 text-amber-700 border-amber-200",
            };
        return {
            text: "Tersedia",
            color: "bg-emerald-50 text-emerald-700 border-emerald-200",
        };
    };

    return (
        <ManagerLayout manager={manager}>
            {/* Alert Container */}
            <div className="fixed top-4 right-4 z-[60] space-y-2 max-w-sm w-full">
                {alerts.map((alert) => (
                    <div
                        key={alert.id}
                        className={`
                            flex items-center gap-3 p-4 rounded-xl shadow-lg border backdrop-blur-sm
                            transform transition-all duration-300 ease-out
                            ${
                                alert.type === "success"
                                    ? "bg-emerald-50/95 border-emerald-200 text-emerald-800"
                                    : alert.type === "error"
                                    ? "bg-red-50/95 border-red-200 text-red-800"
                                    : alert.type === "warning"
                                    ? "bg-amber-50/95 border-amber-200 text-amber-800"
                                    : "bg-blue-50/95 border-blue-200 text-blue-800"
                            }
                            animate-in slide-in-from-right-5 fade-in
                        `}
                    >
                        <div className="flex-shrink-0">
                            {alert.type === "success" && (
                                <svg
                                    className="w-5 h-5 text-emerald-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            )}
                            {alert.type === "error" && (
                                <svg
                                    className="w-5 h-5 text-red-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            )}
                            {alert.type === "warning" && (
                                <svg
                                    className="w-5 h-5 text-amber-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z"
                                    />
                                </svg>
                            )}
                            {alert.type === "info" && (
                                <svg
                                    className="w-5 h-5 text-blue-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            )}
                        </div>

                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium leading-relaxed">
                                {alert.message}
                            </p>
                        </div>

                        <button
                            onClick={() => removeAlert(alert.id)}
                            className="flex-shrink-0 p-1 rounded-lg hover:bg-black/10 transition-colors"
                        >
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                ))}
            </div>

            <div className="min-h-screen bg-gray-50/50">
                <div className="max-w-7xl mx-auto p-6 space-y-8">
                    {/* Header */}
                    <div className="bg-white border border-gray-200/60 rounded-2xl p-8 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                    Menu Management
                                </h1>
                                <p className="text-slate-500 mt-1 text-sm">
                                    Centralized menu data management and stock monitoring.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Statistics */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="bg-white border border-gray-200/60 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center">
                                <div className="p-3 bg-blue-50 rounded-xl">
                                    <svg
                                        className="w-6 h-6 text-blue-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                        />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">
                                        Total Menu
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {menus.length}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border border-gray-200/60 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center">
                                <div className="p-3 bg-purple-50 rounded-xl">
                                    <svg
                                        className="w-6 h-6 text-purple-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                                        />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">
                                        Kategori
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {availableCategories.length}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border border-gray-200/60 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center">
                                <div className="p-3 bg-amber-50 rounded-xl">
                                    <svg
                                        className="w-6 h-6 text-amber-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z"
                                        />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">
                                        Stok Rendah
                                    </p>
                                    <p className="text-2xl font-bold text-amber-600">
                                        {
                                            menus.filter(
                                                (menu) =>
                                                    menu.jumlahStok <= 5 &&
                                                    menu.jumlahStok > 0
                                            ).length
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border border-gray-200/60 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center">
                                <div className="p-3 bg-red-50 rounded-xl">
                                    <svg
                                        className="w-6 h-6 text-red-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">
                                        Habis
                                    </p>
                                    <p className="text-2xl font-bold text-red-600">
                                        {
                                            menus.filter(
                                                (menu) => menu.jumlahStok === 0
                                            ).length
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="bg-white border border-gray-200/60 rounded-2xl p-6 shadow-sm">
                        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                            <div className="flex flex-col sm:flex-row gap-4 flex-1">
                                {/* Search */}
                                <div className="relative">
                                    <svg
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                        />
                                    </svg>
                                    <input
                                        type="text"
                                        placeholder="Cari menu..."
                                        value={searchTerm}
                                        onChange={(e) =>
                                            setSearchTerm(e.target.value)
                                        }
                                        className="pl-10 pr-4 py-3 w-full sm:w-64 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                                    />
                                </div>

                                {/* Filter by Category */}
                                <select
                                    value={filterKategori}
                                    onChange={(e) =>
                                        setFilterKategori(e.target.value)
                                    }
                                    className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                                >
                                    <option value="">Semua Kategori</option>
                                    {availableCategories.map((category) => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>

                                {/* Sort */}
                                <select
                                    value={`${sortBy}-${sortOrder}`}
                                    onChange={(e) => {
                                        const [field, order] =
                                            e.target.value.split("-");
                                        setSortBy(field);
                                        setSortOrder(order);
                                    }}
                                    className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                                >
                                    <option value="created_at-desc">
                                        Terbaru
                                    </option>
                                    <option value="created_at-asc">
                                        Terlama
                                    </option>
                                    <option value="namaMenu-asc">
                                        Nama A-Z
                                    </option>
                                    <option value="namaMenu-desc">
                                        Nama Z-A
                                    </option>
                                    <option value="harga-asc">
                                        Harga Terendah
                                    </option>
                                    <option value="harga-desc">
                                        Harga Tertinggi
                                    </option>
                                    <option value="jumlahStok-asc">
                                        Stok Terendah
                                    </option>
                                    <option value="jumlahStok-desc">
                                        Stok Tertinggi
                                    </option>
                                </select>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={openAddModal}
                                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors font-medium shadow-sm"
                                >
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                        />
                                    </svg>
                                    Tambah Menu
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Menu Table */}
                    <div className="bg-white border border-gray-200/60 rounded-2xl shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead>
                                    <tr className="bg-gray-50/50 border-b border-gray-200/60">
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Menu
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Kategori
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Harga
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Stok
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200/60">
                                    {filteredMenus.map((menu, index) => {
                                        const stockStatus = getStockStatus(
                                            menu.jumlahStok
                                        );
                                        return (
                                            <tr
                                                key={menu.id}
                                                className="hover:bg-gray-50/50 transition-colors"
                                            >
                                                <td className="px-6 py-5">
                                                    <div>
                                                        <div className="font-semibold text-gray-900 mb-1">
                                                            {menu.namaMenu}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {menu.deskripsi}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
                                                        {menu.kategori}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <span className="font-semibold text-gray-900">
                                                        {formatRupiah(
                                                            menu.harga
                                                        )}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <button
                                                        onClick={() =>
                                                            openStockModal(menu)
                                                        }
                                                        className="font-medium text-blue-600 hover:text-blue-700 hover:underline"
                                                    >
                                                        {menu.jumlahStok}
                                                    </button>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <span
                                                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${stockStatus.color}`}
                                                    >
                                                        {stockStatus.text}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() =>
                                                                openEditModal(
                                                                    menu
                                                                )
                                                            }
                                                            className="flex items-center gap-1 px-3 py-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium"
                                                        >
                                                            <svg
                                                                className="w-4 h-4"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={
                                                                        2
                                                                    }
                                                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                                                />
                                                            </svg>
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                openDeleteConfirm(
                                                                    menu
                                                                )
                                                            }
                                                            className="flex items-center gap-1 px-3 py-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
                                                        >
                                                            <svg
                                                                className="w-4 h-4"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={
                                                                        2
                                                                    }
                                                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                                />
                                                            </svg>
                                                            Hapus
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>

                            {filteredMenus.length === 0 && (
                                <div className="text-center py-12">
                                    <svg
                                        className="mx-auto h-12 w-12 text-gray-400 mb-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1}
                                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                        />
                                    </svg>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                        Tidak ada menu
                                    </h3>
                                    <p className="text-gray-500">
                                        Belum ada menu yang sesuai dengan
                                        pencarian Anda.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Add/Edit Modal */}
                    {isModalOpen && (
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
                                <div className="p-6 border-b border-gray-200">
                                    <h2 className="text-xl font-bold text-gray-900">
                                        {isEditMode
                                            ? "Edit Menu"
                                            : "Tambah Menu Baru"}
                                    </h2>
                                </div>

                                <form
                                    onSubmit={handleSubmit}
                                    className="p-6 space-y-5"
                                >
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Nama Menu
                                        </label>
                                        <input
                                            type="text"
                                            name="namaMenu"
                                            value={formData.namaMenu}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                                            placeholder="Contoh: Cappuccino"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Deskripsi
                                        </label>
                                        <textarea
                                            name="deskripsi"
                                            value={formData.deskripsi}
                                            onChange={handleInputChange}
                                            required
                                            rows={3}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors resize-none"
                                            placeholder="Deskripsi menu..."
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Kategori
                                        </label>
                                        <div className="flex gap-2">
                                            <select
                                                name="kategori"
                                                value={formData.kategori}
                                                onChange={handleInputChange}
                                                required
                                                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                                            >
                                                <option value="">
                                                    Pilih Kategori
                                                </option>
                                                {availableCategories.map(
                                                    (category) => (
                                                        <option
                                                            key={category}
                                                            value={category}
                                                        >
                                                            {category}
                                                        </option>
                                                    )
                                                )}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Harga
                                            </label>
                                            <input
                                                type="number"
                                                name="harga"
                                                value={formData.harga}
                                                onChange={handleInputChange}
                                                required
                                                min="0"
                                                step="0.01"
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                                                placeholder="0"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Jumlah Stok
                                            </label>
                                            <input
                                                type="number"
                                                name="jumlahStok"
                                                value={formData.jumlahStok}
                                                onChange={handleInputChange}
                                                required
                                                min="0"
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                                                placeholder="0"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex gap-3 pt-4">
                                        <button
                                            type="submit"
                                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl transition-colors font-medium shadow-sm"
                                        >
                                            {isEditMode
                                                ? "Update Menu"
                                                : "Tambah Menu"}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setIsModalOpen(false)
                                            }
                                            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-xl transition-colors font-medium"
                                        >
                                            Batal
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Stock Update Modal */}
                    {isStockModalOpen && stockMenu && (
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4">
                                <div className="p-6 border-b border-gray-200">
                                    <h2 className="text-xl font-bold text-gray-900">
                                        Update Stok
                                    </h2>
                                    <p className="text-gray-600 mt-1">
                                        {stockMenu.namaMenu}
                                    </p>
                                </div>

                                <form
                                    onSubmit={handleStockUpdate}
                                    className="p-6 space-y-5"
                                >
                                    <div>
                                        <div className="bg-gray-50 rounded-xl p-4 mb-4">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-medium text-gray-600">
                                                    Stok Saat Ini
                                                </span>
                                                <span className="text-lg font-bold text-gray-900">
                                                    {stockMenu.jumlahStok}
                                                </span>
                                            </div>
                                        </div>

                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Jumlah Stok Baru
                                        </label>
                                        <input
                                            type="number"
                                            value={newStock}
                                            onChange={(e) =>
                                                setNewStock(
                                                    parseInt(e.target.value) ||
                                                        0
                                                )
                                            }
                                            required
                                            min="0"
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                                            placeholder="0"
                                        />
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            type="submit"
                                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-4 rounded-xl transition-colors font-medium shadow-sm"
                                        >
                                            Update Stok
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setIsStockModalOpen(false)
                                            }
                                            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-xl transition-colors font-medium"
                                        >
                                            Batal
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Delete Confirmation Modal */}
                    {deleteConfirm && (
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4">
                                <div className="p-6">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="p-3 bg-red-100 rounded-full">
                                            <svg
                                                className="w-6 h-6 text-red-600"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z"
                                                />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900">
                                                Konfirmasi Hapus
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                Tindakan ini tidak dapat
                                                dibatalkan
                                            </p>
                                        </div>
                                    </div>

                                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                                        <p className="text-sm text-red-800">
                                            Apakah Anda yakin ingin menghapus
                                            menu{" "}
                                            <span className="font-semibold">
                                                "{deleteConfirm.namaMenu}"
                                            </span>
                                            ? Menu yang sudah dihapus tidak
                                            dapat dikembalikan.
                                        </p>
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            onClick={handleDelete}
                                            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-xl transition-colors font-medium shadow-sm"
                                        >
                                            Ya, Hapus Menu
                                        </button>
                                        <button
                                            onClick={() =>
                                                setDeleteConfirm(null)
                                            }
                                            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-xl transition-colors font-medium"
                                        >
                                            Batal
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </ManagerLayout>
    );
}
