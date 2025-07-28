import { Inertia } from "@inertiajs/inertia";
import KasirLayout from "../../../Layouts/KasirLayout";
import React from "react";

export default function Home({ kasir }) {
    const handleLogout = () => {
        Inertia.post("/logout");
    };

    return (
        <KasirLayout kasir={kasir}>
            <div className="p-6 bg-gray-100 min-h-screen">
                <div className="bg-white p-4 rounded shadow-md mb-6">
                    <h1 className="text-2xl font-bold text-blue-700">
                        Dashboard Kasir
                    </h1>
                    <p className="mt-2">
                        <strong>Email:</strong> {kasir.email}
                    </p>
                    <p>
                        <strong>Role:</strong> {kasir.role}
                    </p>
                    <button
                        onClick={handleLogout}
                        className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </KasirLayout>
    );
}
