import React from "react";
import { router } from "@inertiajs/react";

export default function Home({ user, menus, transaksis }) {
    const handleLogout = () => {
        router.post("/logout");
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="bg-white p-4 rounded shadow-md mb-6">
                <h1 className="text-2xl font-bold text-blue-700">Dashboard Manager</h1>
                <p className="mt-2"><strong>Email:</strong> {user.email}</p>
                <p><strong>Role:</strong> {user.role}</p>
                <button
                    onClick={handleLogout}
                    className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                    Logout
                </button>
            </div>

            <div className="bg-white p-4 rounded shadow-md mb-6">
                <h2 className="text-xl font-bold mb-3">Daftar Menu</h2>
                <table className="w-full border">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="p-2 border">Nama</th>
                            <th className="p-2 border">Kategori</th>
                            <th className="p-2 border">Harga</th>
                            <th className="p-2 border">Stok</th>
                        </tr>
                    </thead>
                    <tbody>
                        {menus.map(menu => (
                            <tr key={menu.id}>
                                <td className="p-2 border">{menu.namaMenu}</td>
                                <td className="p-2 border">{menu.kategori}</td>
                                <td className="p-2 border">Rp {menu.harga}</td>
                                <td className="p-2 border">{menu.jumlahStok}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="bg-white p-4 rounded shadow-md">
                <h2 className="text-xl font-bold mb-3">Semua Transaksi</h2>
                <table className="w-full border">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="p-2 border">Waktu</th>
                            <th className="p-2 border">Kasir</th>
                            <th className="p-2 border">Qty</th>
                            <th className="p-2 border">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transaksis.map(tx => (
                            <tr key={tx.id}>
                                <td className="p-2 border">{tx.waktu}</td>
                                <td className="p-2 border">{tx.kasir?.email}</td>
                                <td className="p-2 border">{tx.qty}</td>
                                <td className="p-2 border">Rp {tx.hargaTotal}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}