import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AppIcon from "../components/common/AppIcon";
import api from "../api";
import { Mail, Lock, ShieldCheck, ArrowRight, Cpu } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("SALES"); // SALES or ADMIN
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/api/auth/login", {
        email,
        password
      });

      const user = res.data;

      // Role Mismatch Check
      if (selectedRole === "ADMIN" && user.role !== "ADMIN") {
        setError("Access Denied: You are not an Administrator.");
        return;
      }

      login(user);

      if (user.role === "ADMIN") navigate("/admin");
      else navigate("/sales");

    } catch (err) {
      setError("Authorization Failed: " + (err.response?.data?.message || err.response?.data || "Server Communication Error"));
    }
  };

  return (
    <div className="min-h-screen flex bg-[#0f172a] font-inter text-slate-50 selection:bg-cyan-500/40">
      {/* Left Side - Visual & Value Prop */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#020617] flex-col justify-between p-12 border-r border-white/10">
        {/* Abstract Hyper-Glass Background */}
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-500/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-violet-600/20 blur-[120px] rounded-full pointer-events-none animate-pulse" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_100%)] pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate('/')}>
            <AppIcon size="w-10 h-10" />
            <span className="text-2xl font-black tracking-widest text-white uppercase text-glow-soft">
              Sales Reward Engine
            </span>
          </div>
        </div>

        <div className="relative z-10 max-w-lg">
          <h1 className="text-5xl font-black uppercase leading-[1.1] tracking-tight mb-6 text-glow-soft">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Secure</span> <br />
            Terminal Access.
          </h1>
          <p className="text-lg text-slate-300 mb-10 font-bold uppercase tracking-widest opacity-80 leading-relaxed">
            Authenticate to access the central incentive engine and monitor real-time computational matrices.
          </p>

          <div className="space-y-6">
            {[
              "Encrypted Connection Protocol",
              "Real-Time Velocity Tracking",
              "Immutable Ledger Access"
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 group">
                <div className="p-2 rounded-lg bg-white/5 border border-white/10 group-hover:bg-cyan-400/20 group-hover:border-cyan-400/40 transition-colors shadow-lg">
                  <Cpu className="w-5 h-5 text-cyan-400 group-hover:animate-pulse" />
                </div>
                <span className="font-bold uppercase tracking-wider text-slate-300 text-sm group-hover:text-white transition-colors">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-xs font-mono uppercase tracking-widest text-cyan-500/60 flex items-center gap-4">
          <span>Terminal Identity Verification</span>
          <span className="w-1 h-1 rounded-full bg-cyan-700" />
          <span>Level 4 Clearance</span>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-24 bg-transparent relative">
        {/* Very subtle ambient glow behind the form */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="w-full max-w-lg space-y-8 relative z-10 hyper-glass p-8 sm:p-12">
          <div className="text-center lg:text-left mb-10">
            <div className="lg:hidden flex justify-center mb-8">
              <AppIcon size="w-16 h-16" />
            </div>
            <h2 className="text-3xl font-black uppercase text-white tracking-widest mb-2">System Login</h2>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
              Verify Administrator / Executive Credentials
            </p>
          </div>

          {/* Role Selector Tabs */}
          <div className="relative p-1 bg-white/5 rounded-2xl flex mb-8 border border-white/10 backdrop-blur-md">
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
              <span className="relative z-20">Sales Executive</span>
              {selectedRole === "SALES" && (
                <div className="absolute inset-0 bg-white/10 rounded-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] -z-10 border border-white/20" />
              )}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-3 font-bold uppercase tracking-wider">
                <ShieldCheck className="w-5 h-5 shrink-0" />
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Secure Protocol Link (Email)</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors pointer-events-none" />
                <input
                  name="email"
                  type="email"
                  placeholder={selectedRole === "ADMIN" ? "admin@enterprise.network" : "executive@enterprise.network"}
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all outline-none text-white placeholder:text-slate-600 hover:bg-white/10 font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Encryption Key (Password)</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors pointer-events-none" />
                <input
                  name="password"
                  type="password"
                  placeholder="••••••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all outline-none text-white placeholder:text-slate-600 hover:bg-white/10 font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-vibrant w-full py-4 mt-8 flex items-center justify-center gap-3 active:scale-[0.98] group relative overflow-hidden text-white"
            >
              <span className="relative z-10 text-lg font-bold tracking-widest uppercase">Verify Credentials</span>
              <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="pt-8 text-center border-t border-white/10 mt-8">
            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">
              Need Access?{" "}
              <span onClick={() => navigate('/register')} className="text-cyan-400 hover:text-cyan-300 transition-colors ml-2 cursor-pointer">
                Initialize Workspace
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
