import { Inertia } from "@inertiajs/inertia";
import KasirLayout from "../../../Layouts/KasirLayout";
import React from "react";

export default function Transaction({ kasir }) {
    const handleLogout = () => {
        Inertia.post("/logout");
    };

    return (
        <KasirLayout kasir={kasir}>
            <div className="p-6 min-h-screen" style={{ backgroundColor: "#fce7f3" }}>
                <div className="bg-white p-4 rounded shadow-md mb-6" style={{ borderColor: "#FFD1DC", borderWidth: "2px" }}>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Transaction Kasir
                    </h1>
                    <p className="mt-2 text-gray-700">
                        <strong>Email:</strong> {kasir.email}
                    </p>
                    <p className="text-gray-700">
                        <strong>Role:</strong> {kasir.role}
                    </p>
                    <button
                        onClick={handleLogout}
                        className="mt-4 text-gray-800 px-4 py-2 rounded transition-colors duration-200"
                        style={{ 
                            backgroundColor: "#f8bbd9",
                            border: "1px solid #f3a6c7"
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = "#f3a6c7";
                            e.target.style.borderColor = "#ec93b8";
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = "#f8bbd9";
                            e.target.style.borderColor = "#f3a6c7";
                        }}
                    >
                        Logout
                    </button>
                </div>
            </div>
        </KasirLayout>
    );
}