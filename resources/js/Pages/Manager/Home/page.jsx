import React from "react";
import { Inertia } from "@inertiajs/inertia";

export default function Home({ user }) {
    const handleLogout = () => {
        Inertia.post("/logout");
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
        </div>
    );
}