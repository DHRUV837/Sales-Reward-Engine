import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { Mail, Lock, User, Building2, ArrowRight, ShieldCheck, Cpu } from "lucide-react";
import AppIcon from "../components/common/AppIcon";
import api from "../api";

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

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("SALES"); // SALES or ADMIN
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await api.post("/api/auth/login", {
        email,
        password
      });

      const user = res.data;

      // Role Mismatch Check
      if (selectedRole === "ADMIN" && user.role !== "ADMIN") {
        setError("Access Denied: You are not an Administrator.");
        setIsLoading(false);
        return;
      }

      login(user);

      if (user.role === "ADMIN") navigate("/admin");
      else navigate("/sales");

    } catch (err) {
      setError("Authorization Failed: " + (err.response?.data?.message || err.response?.data || "Server Communication Error"));
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
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            Level 4 Security Clearance Required
          </div>
          <h1 className="text-4xl md:text-5xl font-black uppercase leading-[1.1] tracking-tight mb-4 text-glow-soft">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Secure</span> <br />
            Terminal Access
          </h1>
        </motion.div>

        <TiltCard className="w-full">
          <div className="hyper-glass p-8 sm:p-12 w-full relative overflow-hidden">
            {/* Inner subtle glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-[60px] rounded-full pointer-events-none" />

            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">

              {/* Role Selector Tabs */}
              <div className="relative p-1 bg-white/5 rounded-2xl flex border border-white/10 backdrop-blur-md mb-8">
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); setSelectedRole("ADMIN"); }}
                  className={`flex-1 relative z-10 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all duration-300 ${selectedRole === "ADMIN"
                    ? "text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.2)]"
                    : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
                    }`}
                >
                  <span className="relative z-20">Administrator</span>
                  {selectedRole === "ADMIN" && (
                    <div className="absolute inset-0 bg-white/10 rounded-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] -z-10 border border-white/20" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); setSelectedRole("SALES"); }}
                  className={`flex-1 relative z-10 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all duration-300 ${selectedRole === "SALES"
                    ? "text-violet-400 shadow-[0_0_20px_rgba(167,139,250,0.2)]"
                    : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
                    }`}
                >
                  <span className="relative z-20">Executive</span>
                  {selectedRole === "SALES" && (
                    <div className="absolute inset-0 bg-white/10 rounded-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] -z-10 border border-white/20" />
                  )}
                </button>
              </div>

              {error && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-3 font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(239,68,68,0.2)]">
                  <ShieldCheck className="w-5 h-5 shrink-0" />
                  {error}
                </motion.div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Secure Protocol Route (Email)</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors pointer-events-none" />
                  <input
                    name="email"
                    type="email"
                    placeholder={selectedRole === "ADMIN" ? "admin@enterprise.network" : "executive@enterprise.network"}
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all outline-none text-white placeholder:text-slate-600 hover:bg-white/10 font-bold"
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all outline-none text-white placeholder:text-slate-600 hover:bg-white/10 font-bold"
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
                    <span className="relative z-10 text-lg font-black uppercase tracking-widest drop-shadow-md">Verify Credentials</span>
                    <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="pt-8 text-center border-t border-white/10 mt-8 relative z-10">
              <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">
                Need Authorization?{" "}
                <Link to="/register" className="text-cyan-400 hover:text-cyan-300 transition-colors ml-2 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
                  Initialize Workspace
                </Link>
              </p>
            </div>
          </div>
        </TiltCard>
      </div>
    </div>
  );
};

export default Login;
