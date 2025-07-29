import React, { useState, useEffect } from "react";
import { Inertia } from "@inertiajs/inertia";
import { usePage } from "@inertiajs/inertia-react";
import { Icon } from "@iconify/react";

const Login = () => {
    const { flash, errors } = usePage().props;
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);
    const [formErrors, setFormErrors] = useState({});
    const [touched, setTouched] = useState({});

    useEffect(() => {
        if (flash?.success) {
            setAlert({ type: "success", message: flash.success });
        } else if (flash?.error) {
            setAlert({ type: "error", message: flash.error });
        } else if (flash?.info) {
            setAlert({ type: "info", message: flash.info });
        } else if (errors?.email) {
            setAlert({ type: "error", message: errors.email });
        }
    }, [flash, errors]);

    useEffect(() => {
        if (alert) {
            const timer = setTimeout(() => {
                setAlert(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [alert]);

    const validateField = (name, value) => {
        const newErrors = { ...formErrors };

        switch (name) {
            case "email":
                if (!value || !value.trim()) {
                    newErrors.email = "Username tidak boleh kosong";
                } else if (value.trim().length < 3) {
                    newErrors.email = "Username minimal 3 karakter";
                } else {
                    delete newErrors.email;
                }
                break;
            case "password":
                if (!value || !value.trim()) {
                    newErrors.password = "Password tidak boleh kosong";
                } else if (value.length < 6) {
                    newErrors.password = "Password minimal 6 karakter";
                } else {
                    delete newErrors.password;
                }
                break;
            default:
                break;
        }

        setFormErrors(newErrors);
        return newErrors;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (touched[name]) {
            validateField(name, value);
        }
    };

    const handleInputBlur = (e) => {
        const { name, value } = e.target;
        setTouched({ ...touched, [name]: true });
        validateField(name, value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);

        // Get form values
        const email = formData.get("email") || "";
        const password = formData.get("password") || "";

        // Mark all fields as touched
        setTouched({ email: true, password: true });

        // Validate all fields - FIX: Validate email first, then password
        validateField("email", email);
        const finalErrors = validateField("password", password);

        // Check if there are any validation errors
        const hasErrors = Object.keys(finalErrors).length > 0;

        if (hasErrors) {
            setAlert({
                type: "error",
                message: "Mohon lengkapi semua field dengan benar",
            });
            return;
        }

        setLoading(true);
        setAlert(null);

        Inertia.post("/actionLogin", formData, {
            onFinish: () => setLoading(false),
            onError: (errors) => {
                setLoading(false);
                if (errors.email) {
                    setAlert({
                        type: "error",
                        message: errors.email,
                    });
                } else {
                    setAlert({
                        type: "error",
                        message:
                            "Login gagal. Silakan periksa kembali email dan password Anda.",
                    });
                }
            },
        });
    };

    const closeAlert = () => {
        setAlert(null);
    };

    const AlertComponent = ({ alert, onClose }) => {
        if (!alert) return null;

        const alertStyles = {
            success: "bg-emerald-50 border-emerald-200 text-emerald-800",
            error: "bg-rose-50 border-rose-200 text-rose-800",
            info: "bg-sky-50 border-sky-200 text-sky-800",
        };

        const iconStyles = {
            success: "text-emerald-500",
            error: "text-rose-500",
            info: "text-sky-500",
        };

        const icons = {
            success: "lucide:check-circle",
            error: "lucide:x-circle",
            info: "lucide:info",
        };

        return (
            <div
                className={`border rounded-xl p-4 mb-6 flex items-start shadow-sm ${
                    alertStyles[alert.type]
                }`}
            >
                <Icon
                    icon={icons[alert.type]}
                    className={`w-5 h-5 mr-3 mt-0.5 ${iconStyles[alert.type]}`}
                />
                <div className="flex-1">
                    <p className="text-sm font-medium">{alert.message}</p>
                </div>
                <button
                    onClick={onClose}
                    className={`ml-3 ${
                        iconStyles[alert.type]
                    } hover:opacity-70 transition-opacity`}
                >
                    <Icon icon="lucide:x" className="w-4 h-4" />
                </button>
            </div>
        );
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-40">
                <div className="absolute top-0 -left-4 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
                <div className="absolute top-0 -right-4 w-72 h-72 bg-rose-200 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
            </div>

            <div className="w-full max-w-md relative z-10">
                {/* Logo/Brand Section */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 rounded-2xl mb-6 shadow-2xl shadow-pink-500/25">
                        <Icon
                            icon="lucide:coffee"
                            className="w-10 h-10 text-white"
                        />
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 bg-clip-text text-transparent mb-2">
                        Cafe Manager
                    </h1>
                </div>

                {/* Login Card */}
                <div className="bg-white/90 backdrop-blur-xl shadow-2xl rounded-3xl p-8 border border-white/30 shadow-pink-500/10">
                    <AlertComponent alert={alert} onClose={closeAlert} />

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Username Field */}
                        <div className="space-y-2">
                            <label
                                htmlFor="email"
                                className="block text-sm font-semibold text-gray-700 mb-3"
                            >
                                Email
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Icon
                                        icon="lucide:user"
                                        className="w-5 h-5 transition-colors text-gray-400 group-hover:text-pink-500"
                                    />
                                </div>
                                <input
                                    type="text"
                                    id="email"
                                    name="email"
                                    onChange={handleInputChange}
                                    onBlur={handleInputBlur}
                                    className="w-full pl-12 pr-4 py-4 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 placeholder:text-gray-400 border-gray-200 bg-white/70 hover:border-gray-300 hover:bg-white"
                                    placeholder="masukkan email anda"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <label
                                htmlFor="password"
                                className="block text-sm font-semibold text-gray-700 mb-3"
                            >
                                Password
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Icon
                                        icon="lucide:lock"
                                        className="w-5 h-5 transition-colors text-gray-400 group-hover:text-pink-500"
                                    />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    onChange={handleInputChange}
                                    onBlur={handleInputBlur}
                                    className="w-full pl-12 pr-14 py-4 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 placeholder:text-gray-400 border-gray-200 bg-white/70 hover:border-gray-300 hover:bg-white"
                                    placeholder="Masukkan password Anda"
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        className="pr-4 text-gray-400 hover:text-pink-500 transition-colors"
                                    >
                                        <Icon
                                            icon={
                                                showPassword
                                                    ? "lucide:eye-off"
                                                    : "lucide:eye"
                                            }
                                            className="w-5 h-5"
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-2 bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 text-white py-4 px-6 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl hover:shadow-pink-500/25 transform hover:-translate-y-1 hover:scale-[1.02] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:ring-offset-2 focus:ring-offset-white disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:scale-100"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <Icon
                                        icon="lucide:loader-2"
                                        className="w-6 h-6 mr-3 animate-spin"
                                    />
                                    Logging in...
                                </div>
                            ) : (
                                <div className="flex items-center justify-center">
                                    <Icon
                                        icon="lucide:log-in"
                                        className="w-6 h-6 mr-3"
                                    />
                                    Login
                                </div>
                            )}
                        </button>
                    </form>
                </div>
            </div>

            <style jsx>{`
                @keyframes blob {
                    0% {
                        transform: translate(0px, 0px) scale(1);
                    }
                    33% {
                        transform: translate(30px, -50px) scale(1.1);
                    }
                    66% {
                        transform: translate(-20px, 20px) scale(0.9);
                    }
                    100% {
                        transform: translate(0px, 0px) scale(1);
                    }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
            `}</style>
        </main>
    );
};

export default Login;