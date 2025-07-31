import { Inertia } from "@inertiajs/inertia";
import KasirLayout from "../../../Layouts/KasirLayout";
import React, { useState, useEffect, useRef } from "react";

export default function Transaction({ kasir, menus, categories, flash }) {
    const [selectedCategory, setSelectedCategory] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [cart, setCart] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showReceipt, setShowReceipt] = useState(false);
    const [receiptData, setReceiptData] = useState(null);
    
    // Track flash messages to prevent duplicates
    const processedFlash = useRef(new Set());

    // Alert system
    const showAlert = (message, type = "success") => {
        const id = Date.now();
        const alert = { id, message, type };
        setAlerts((prev) => [...prev, alert]);

        setTimeout(() => {
            setAlerts((prev) => prev.filter((a) => a.id !== id));
        }, 5000);
    };

    const removeAlert = (id) => {
        setAlerts((prev) => prev.filter((a) => a.id !== id));
    };

    // Handle flash messages
    useEffect(() => {
        if (flash) {
            const flashKey = `${JSON.stringify(flash)}-${Date.now()}`;
            
            if (processedFlash.current.size > 10) {
                processedFlash.current.clear();
            }

            if (!processedFlash.current.has(flashKey)) {
                processedFlash.current.add(flashKey);

                setTimeout(() => {
                    if (flash?.success) {
                        showAlert(flash.success, "success");
                        // Generate receipt data and show receipt
                        const receipt = {
                            id: Date.now(),
                            date: new Date().toLocaleDateString('id-ID'),
                            time: new Date().toLocaleTimeString('id-ID'),
                            items: cart,
                            total: cartTotal,
                            cashier: kasir.email
                        };
                        setReceiptData(receipt);
                        setShowReceipt(true);
                        // Clear cart on successful transaction
                        setCart([]);
                    }
                    if (flash?.error) {
                        showAlert(flash.error, "error");
                    }
                }, 10);
            }
        }
    }, [flash]);

    // Filter menus
    const filteredMenus = menus.filter((menu) => {
        const matchesSearch = menu.namaMenu.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === "" || menu.kategori === selectedCategory;
        return matchesSearch && matchesCategory && menu.jumlahStok > 0;
    });

    // Add item to cart
    const addToCart = (menu) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find(item => item.idMenu === menu.id);
            
            if (existingItem) {
                // Check if adding one more exceeds stock
                if (existingItem.qty >= menu.jumlahStok) {
                    showAlert(`Stok ${menu.namaMenu} tidak mencukupi!`, "warning");
                    return prevCart;
                }
                
                return prevCart.map(item =>
                    item.idMenu === menu.id
                        ? { ...item, qty: item.qty + 1 }
                        : item
                );
            } else {
                return [...prevCart, {
                    idMenu: menu.id,
                    namaMenu: menu.namaMenu,
                    harga: menu.harga,
                    qty: 1,
                    maxStock: menu.jumlahStok
                }];
            }
        });
        
        showAlert(`${menu.namaMenu} ditambahkan ke keranjang`, "success");
    };

    // Update cart item quantity
    const updateCartQty = (idMenu, newQty) => {
        if (newQty <= 0) {
            removeFromCart(idMenu);
            return;
        }
        
        setCart(prevCart =>
            prevCart.map(item => {
                if (item.idMenu === idMenu) {
                    if (newQty > item.maxStock) {
                        showAlert(`Maksimal ${item.maxStock} untuk ${item.namaMenu}`, "warning");
                        return item;
                    }
                    return { ...item, qty: newQty };
                }
                return item;
            })
        );
    };

    // Remove from cart
    const removeFromCart = (idMenu) => {
        setCart(prevCart => prevCart.filter(item => item.idMenu !== idMenu));
    };

    // Clear cart
    const clearCart = () => {
        setCart([]);
    };

    // Calculate totals
    const cartTotal = cart.reduce((total, item) => total + (item.harga * item.qty), 0);
    const cartItemCount = cart.reduce((total, item) => total + item.qty, 0);

    // Process transaction
    const processTransaction = () => {
        if (cart.length === 0) {
            showAlert("Keranjang masih kosong!", "warning");
            return;
        }

        setIsProcessing(true);
        
        const transactionData = {
            items: cart.map(item => ({
                idMenu: item.idMenu,
                qty: item.qty,
                harga: item.harga
            }))
        };

        Inertia.post('/kasir/transaction', transactionData, {
            onFinish: () => setIsProcessing(false)
        });
    };

    const formatRupiah = (number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
        }).format(number);
    };

    const printReceipt = () => {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>Receipt #${receiptData.id}</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; }
                        .receipt { max-width: 400px; margin: 0 auto; }
                        .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; }
                        .item { display: flex; justify-content: space-between; margin: 5px 0; }
                        .total { border-top: 2px solid #000; padding-top: 10px; font-weight: bold; }
                    </style>
                </head>
                <body>
                    <div class="receipt">
                        <div class="header">
                            <h2>CAFE RECEIPT</h2>
                            <p>Receipt #${receiptData.id}</p>
                            <p>${receiptData.date} ${receiptData.time}</p>
                            <p>Cashier: ${receiptData.cashier}</p>
                        </div>
                        <div class="items">
                            ${receiptData.items.map(item => `
                                <div class="item">
                                    <span>${item.namaMenu} x${item.qty}</span>
                                    <span>${formatRupiah(item.harga * item.qty)}</span>
                                </div>
                            `).join('')}
                        </div>
                        <div class="total">
                            <div class="item">
                                <span>TOTAL</span>
                                <span>${formatRupiah(receiptData.total)}</span>
                            </div>
                        </div>
                        <div style="text-align: center; margin-top: 20px;">
                            <p>Terima Kasih!</p>
                        </div>
                    </div>
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    };

    return (
        <KasirLayout kasir={kasir}>
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
                                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            )}
                            {alert.type === "error" && (
                                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            )}
                            {alert.type === "warning" && (
                                <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium leading-relaxed">{alert.message}</p>
                        </div>
                        <button
                            onClick={() => removeAlert(alert.id)}
                            className="flex-shrink-0 p-1 rounded-lg hover:bg-black/10 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                ))}
            </div>

            {/* Receipt Modal */}
            {showReceipt && receiptData && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Transaksi Berhasil!</h2>
                            <p className="text-gray-600">Receipt #{receiptData.id}</p>
                        </div>
                        
                        <div className="border-2 border-gray-200 rounded-lg p-4 mb-6">
                            <div className="text-center border-b border-gray-200 pb-4 mb-4">
                                <h3 className="font-bold text-lg">CAFE RECEIPT</h3>
                                <p className="text-sm text-gray-600">{receiptData.date} {receiptData.time}</p>
                                <p className="text-sm text-gray-600">Cashier: {receiptData.cashier}</p>
                            </div>
                            
                            <div className="space-y-2 mb-4">
                                {receiptData.items.map((item, index) => (
                                    <div key={index} className="flex justify-between text-sm">
                                        <span>{item.namaMenu} x{item.qty}</span>
                                        <span>{formatRupiah(item.harga * item.qty)}</span>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="border-t border-gray-200 pt-4">
                                <div className="flex justify-between font-bold text-lg">
                                    <span>TOTAL</span>
                                    <span>{formatRupiah(receiptData.total)}</span>
                                </div>
                            </div>
                            
                            <div className="text-center mt-4 text-sm text-gray-600">
                                <p>Terima Kasih!</p>
                            </div>
                        </div>
                        
                        <div className="flex gap-3">
                            <button
                                onClick={printReceipt}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl transition-colors font-medium"
                            >
                                Print Receipt
                            </button>
                            <button
                                onClick={() => setShowReceipt(false)}
                                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-xl transition-colors font-medium"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="min-h-screen bg-gray-50/50">
                <div className="max-w-7xl mx-auto p-6 space-y-8">
                    {/* Header */}
                    <div className="bg-white border border-gray-200/60 rounded-2xl p-8 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                    Transaction System
                                </h1>
                                <p className="text-slate-500 mt-1 text-sm">
                                    Point of Sale system for processing customer transactions
                                </p>
                            </div>
                            
                            {/* Cart Summary - Removed Cart Button */}
                            <div className="bg-blue-50 px-4 py-2 rounded-xl border border-blue-200">
                                <div className="text-sm text-blue-600 font-medium">Items: {cartItemCount}</div>
                                <div className="text-lg font-bold text-blue-800">{formatRupiah(cartTotal)}</div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Menu Selection */}
                        <div className="lg:col-span-2">
                            {/* Controls */}
                            <div className="bg-white border border-gray-200/60 rounded-2xl p-6 shadow-sm mb-6">
                                <div className="flex flex-col sm:flex-row gap-4">
                                    {/* Search */}
                                    <div className="relative flex-1">
                                        <svg
                                            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                        <input
                                            type="text"
                                            placeholder="Cari menu..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10 pr-4 py-3 w-full border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                                        />
                                    </div>

                                    {/* Category Filter */}
                                    <select
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                                    >
                                        <option value="">Semua Kategori</option>
                                        {categories.map((category) => (
                                            <option key={category} value={category}>
                                                {category}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Menu Grid */}
                            <div className="bg-white border border-gray-200/60 rounded-2xl p-6 shadow-sm">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">Available Menu</h2>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                    {filteredMenus.map((menu) => (
                                        <div
                                            key={menu.id}
                                            className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer"
                                            onClick={() => addToCart(menu)}
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-semibold text-gray-900 text-sm">{menu.namaMenu}</h3>
                                                <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full border border-purple-200">
                                                    {menu.kategori}
                                                </span>
                                            </div>
                                            
                                            <p className="text-xs text-gray-600 mb-3 line-clamp-2">{menu.deskripsi}</p>
                                            
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <div className="font-bold text-blue-600">{formatRupiah(menu.harga)}</div>
                                                    <div className="text-xs text-gray-500">Stok: {menu.jumlahStok}</div>
                                                </div>
                                                
                                                <button className="bg-blue-50 hover:bg-blue-100 text-blue-600 p-2 rounded-lg transition-colors">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {filteredMenus.length === 0 && (
                                    <div className="text-center py-12">
                                        <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada menu</h3>
                                        <p className="text-gray-500">Tidak ada menu yang sesuai dengan pencarian Anda.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Shopping Cart */}
                        <div className="lg:col-span-1">
                            <div className="bg-white border border-gray-200/60 rounded-2xl shadow-sm">
                                <div className="p-6 border-b border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-xl font-semibold text-gray-900">Shopping Cart</h2>
                                        {cart.length > 0 && (
                                            <button
                                                onClick={clearCart}
                                                className="text-red-600 hover:text-red-700 text-sm font-medium"
                                            >
                                                Clear All
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="p-6">
                                    {cart.length === 0 ? (
                                        <div className="text-center py-8">
                                            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 10L6 5H3m4 8a2 2 0 100 4 2 2 0 000-4zm10 0a2 2 0 100 4 2 2 0 000-4z" />
                                            </svg>
                                            <p className="text-gray-500">Keranjang masih kosong</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {cart.map((item) => (
                                                <div key={item.idMenu} className="border border-gray-200 rounded-lg p-4">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <h3 className="font-medium text-gray-900 text-sm">{item.namaMenu}</h3>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                removeFromCart(item.idMenu);
                                                            }}
                                                            className="text-red-500 hover:text-red-700"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                    
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <button
                                                                onClick={() => updateCartQty(item.idMenu, item.qty - 1)}
                                                                className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors"
                                                            >
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                                                </svg>
                                                            </button>
                                                            
                                                            <span className="font-medium text-gray-900 min-w-[2rem] text-center">{item.qty}</span>
                                                            
                                                            <button
                                                                onClick={() => updateCartQty(item.idMenu, item.qty + 1)}
                                                                disabled={item.qty >= item.maxStock}
                                                                className="w-8 h-8 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg flex items-center justify-center transition-colors"
                                                            >
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                        
                                                        <div className="text-right">
                                                            <div className="text-sm text-gray-600">{formatRupiah(item.harga)} each</div>
                                                            <div className="font-semibold text-gray-900">{formatRupiah(item.harga * item.qty)}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {cart.length > 0 && (
                                    <div className="p-6 border-t border-gray-200">
                                        <div className="space-y-4">
                                            <div className="flex justify-between text-lg font-semibold text-gray-900">
                                                <span>Total:</span>
                                                <span>{formatRupiah(cartTotal)}</span>
                                            </div>
                                            
                                            <div className="space-y-2">
                                                <button
                                                    onClick={processTransaction}
                                                    disabled={isProcessing}
                                                    className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3 px-4 rounded-xl transition-colors font-medium shadow-sm flex items-center justify-center gap-2"
                                                >
                                                    {isProcessing ? (
                                                        <>
                                                            <svg className="animate-spin w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                            </svg>
                                                            Processing...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                                            </svg>
                                                            Process Transaction
                                                        </>
                                                    )}
                                                </button>
                                                
                                                <div className="text-xs text-gray-500 text-center">
                                                    {cartItemCount} items • {formatRupiah(cartTotal)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </KasirLayout>
    );
}