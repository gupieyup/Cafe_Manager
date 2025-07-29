import { Inertia } from "@inertiajs/inertia";
import KasirLayout from "../../../Layouts/KasirLayout";
import React from "react";

export default function History({ kasir }) {
    return (
        <KasirLayout kasir={kasir}>
            <div className="p-6 min-h-screen" style={{ backgroundColor: "#fce7f3" }}>
                <div className="bg-white p-4 rounded shadow-md mb-6" style={{ borderColor: "#FFD1DC", borderWidth: "2px" }}>
                    <h1 className="text-2xl font-bold text-gray-800">
                        History Kasir
                    </h1>
                    <p className="mt-2 text-gray-700">
                        <strong>Email:</strong> {kasir.email}
                    </p>
                    <p className="text-gray-700">
                        <strong>Role:</strong> {kasir.role}
                    </p>
                </div>
            </div>
        </KasirLayout>
    );
}