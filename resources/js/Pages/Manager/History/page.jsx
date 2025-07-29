import { Inertia } from "@inertiajs/inertia";
import ManagerLayout from "../../../Layouts/ManagerLayout";
import React from "react";

export default function History({ manager }) {
    return (
        <ManagerLayout manager={manager}>
            <div className="p-6 min-h-screen" style={{ backgroundColor: "#fce7f3" }}>
                <div className="bg-white p-4 rounded shadow-md mb-6" style={{ borderColor: "#FFD1DC", borderWidth: "2px" }}>
                    <h1 className="text-2xl font-bold text-gray-800">
                        History Transaction
                    </h1>
                    <p className="mt-2 text-gray-700">
                        <strong>Email:</strong> {manager.email}
                    </p>
                    <p className="text-gray-700">
                        <strong>Role:</strong> {manager.role}
                    </p>
                </div>
            </div>
        </ManagerLayout>
    );
}