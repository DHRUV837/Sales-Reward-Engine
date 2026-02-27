import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { Mail, Lock, User, Building2, ArrowRight, ShieldCheck, Cpu } from "lucide-react";
import AppIcon from "../components/common/AppIcon";

// --- REUSED: EYE-PLEASING BACKGROUND (Aurora Mesh) ---
const AuroraBackground = () => (
    <div className="aurora-container absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="aurora-blob bg-blue-500 w-[60vw] h-[60vw] top-[-10%] left-[-10%]" style={{ '--duration': '25s' }} />
        <div className="aurora-blob bg-violet-600 w-[70vw] h-[70vw] top-[20%] right-[-20%]" style={{ '--duration': '35s', animationDirection: 'reverse' }} />
        <div className="aurora-blob bg-cyan-400 w-[50vw] h-[50vw] bottom-[-20%] left-[20%]" style={{ '--duration': '30s' }} />
        <div className="aurora-blob bg-pink-500 w-[40vw] h-[40vw] bottom-[10%] right-[30%] opacity-40" style={{ '--duration': '28s' }} />
        <div className="absolute inset-0 stars-overlay z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#0f172a_100%)] z-20 pointer-events-none opacity-80" />
    </div>
);

// --- REUSED: 3D MOUSE-REACTIVE TILT COMPONENT ---
const TiltCard = ({ children, className }) => {
    const ref = useRef(null);
    const [rotateX, setRotateX] = useState(0);
    const [rotateY, setRotateY] = useState(0);

    const handleMouseMove = (e) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const rX = ((mouseY / height) - 0.5) * -10;
        const rY = ((mouseX / width) - 0.5) * 10;

        setRotateX(rX);
        setRotateY(rY);
    };

    const handleMouseLeave = () => {
        setRotateX(0);
        setRotateY(0);
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            animate={{ rotateX, rotateY }}
            transition={{ type: "spring", stiffness: 300, damping: 30, mass: 0.5 }}
            style={{ perspective: 1000 }}
            className={`relative ${className}`}
        >
            {children}
        </motion.div>
    );
};

const Register = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        companyName: ""
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            await register(formData.name, formData.email, formData.password, "ADMIN", { companyName: formData.companyName });
            navigate("/admin");
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Registration failed");
            setIsLoading(false);
        }
    };

    return (
        <div className="dark min-h-screen flex items-center justify-center bg-[#0f172a] font-inter text-slate-50 selection:bg-cyan-500/40 relative overflow-hidden">
            <AuroraBackground />

            {/* Top Left Branding */}
            <div className="absolute top-8 left-8 z-50 flex items-center gap-4 cursor-pointer hover:scale-105 transition-transform" onClick={() => navigate('/')}>
                <AppIcon size="w-10 h-10" />
                <span className="text-xl font-black tracking-widest text-white uppercase text-glow-soft hidden sm:block">
                    Sales Reward Engine
                </span>
            </div>

            <div className="w-full max-w-2xl px-6 relative z-30 flex flex-col items-center">

                {/* Header Text above the tilted card */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-10"
                >
                    <div className="inline-flex items-center gap-3 px-6 py-2 mb-6 rounded-full border border-white/20 bg-white/5 backdrop-blur-md text-white font-black text-xs uppercase tracking-widest shadow-xl">
                        <Cpu className="w-4 h-4 text-cyan-400" />
                        System Initialization Validated
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black uppercase leading-[1.1] tracking-tight mb-4 text-glow-soft">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Initialize</span> <br />
                        Corporate Entity
                    </h1>
                </motion.div>

                <TiltCard className="w-full">
                    <div className="hyper-glass p-8 sm:p-12 w-full relative overflow-hidden">
                        {/* Inner subtle glow */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-[60px] rounded-full pointer-events-none" />

                        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                            {error && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-3 font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(239,68,68,0.2)]">
                                    <ShieldCheck className="w-5 h-5 shrink-0" />
                                    {error}
                                </motion.div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Administrator Designation</label>
                                    <div className="relative group">
                                        <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors pointer-events-none" />
                                        <input
                                            name="name"
                                            type="text"
                                            placeholder="Identification"
                                            required
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all outline-none text-white placeholder:text-slate-500 hover:bg-white/10 font-bold"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Corporate Header</label>
                                    <div className="relative group">
                                        <Building2 className="absolute left-4 top-3.5 w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors pointer-events-none" />
                                        <input
                                            name="companyName"
                                            type="text"
                                            placeholder="Entity Name"
                                            required
                                            value={formData.companyName}
                                            onChange={handleChange}
                                            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all outline-none text-white placeholder:text-slate-500 hover:bg-white/10 font-bold"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Secure Protocol Route (Email)</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors pointer-events-none" />
                                    <input
                                        name="email"
                                        type="email"
                                        placeholder="admin@enterprise.network"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all outline-none text-white placeholder:text-slate-500 hover:bg-white/10 font-bold"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Encryption Key Sequence (Password)</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors pointer-events-none" />
                                    <input
                                        name="password"
                                        type="password"
                                        placeholder="••••••••••••"
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all outline-none text-white placeholder:text-slate-500 hover:bg-white/10 font-bold"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="btn-vibrant w-full py-4 mt-8 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden text-white"
                            >
                                {isLoading ? (
                                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <span className="relative z-10 text-lg font-black uppercase tracking-widest drop-shadow-md">Execute Initialization</span>
                                        <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="pt-8 text-center border-t border-white/10 mt-8 relative z-10">
                            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">
                                Existing Security Clearance?{" "}
                                <Link to="/login" className="text-cyan-400 hover:text-cyan-300 transition-colors ml-2 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
                                    Proceed to Terminal
                                </Link>
                            </p>
                        </div>
                    </div>
                </TiltCard>
            </div>
        </div>
    );
};

export default Register;
