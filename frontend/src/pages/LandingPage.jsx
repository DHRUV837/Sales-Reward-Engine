import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Shield,
  TrendingUp,
  Zap,
  Target,
  CheckCircle2,
  Globe,
  ChevronRight,
  Layout,
  PieChart,
  Award,
  Briefcase,
  Layers,
  Users,
  BarChart3,
  Smartphone,
  CreditCard,
  Lock,
  Settings,
  FileCheck,
  Trophy,
  Sparkles,
  Command,
  Activity,
  Cpu
} from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9]);

  const handleGetStarted = () => {
    navigate('/register');
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const workflowSteps = [
    {
      id: 1,
      title: "Smart Configuration",
      description: "Define complex multi-tier rules with our AI-assisted policy builder.",
      icon: Settings,
      color: "text-cyan-400",
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/20"
    },
    {
      id: 2,
      title: "Automated Tracking",
      description: "Real-time deal ingestion from CRM with instant validation.",
      icon: Activity,
      color: "text-indigo-400",
      bg: "bg-indigo-500/10",
      border: "border-indigo-500/20"
    },
    {
      id: 3,
      title: "Precision Engine",
      description: "Proprietary calculation engine ensuring zero-error payouts.",
      icon: Cpu,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20"
    },
    {
      id: 4,
      title: "Instant Payouts",
      description: "Approve workflow-triggered payments directly to reps.",
      icon: Sparkles,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20"
    }
  ];

  const partners = [
    "Salesforce", "HubSpot", "Stripe", "Workday", "Snowflake", "AWS"
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-slate-50 selection:bg-cyan-500/30 font-sans overflow-x-hidden">
      {/* Animated Mesh Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] rounded-full bg-cyan-600/10 blur-[120px] animate-glow-pulse" />
        <div className="absolute top-[20%] right-[-5%] w-[50%] h-[60%] rounded-full bg-purple-600/10 blur-[140px] animate-glow-pulse animation-delay-2000" />
        <div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[50%] rounded-full bg-indigo-600/10 blur-[130px] animate-glow-pulse animation-delay-4000" />

        {/* Modern Grid Mask */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,#000_10%,transparent_100%)]"></div>
      </div>

      {/* Glass Navbar */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#020617]/40 backdrop-blur-2xl"
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-110 transition-all duration-500">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              SalesReward<span className="text-cyan-400">.</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-10">
            {['Solutions', 'Features', 'Pricing', 'Resources'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="text-sm font-medium text-slate-400 hover:text-white transition-all duration-300 relative group">
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-cyan-400 transition-all group-hover:w-full" />
              </a>
            ))}
            <div className="flex items-center gap-6 ml-4">
              <button
                onClick={() => navigate('/login')}
                className="text-sm font-semibold text-slate-300 hover:text-white transition-colors"
              >
                Login
              </button>
              <button
                onClick={handleGetStarted}
                className="px-6 py-2.5 rounded-full bg-white text-[#020617] text-sm font-bold hover:bg-cyan-50 transition-all shadow-xl hover:shadow-white/10 active:scale-95 border border-white/20"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      <main className="relative z-10">
        {/* Dynamic Hero Section */}
        <section className="relative pt-48 pb-32 px-6 lg:px-8 overflow-hidden">
          <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/5 text-cyan-300 text-xs font-semibold mb-10 tracking-wide"
            >
              <Command className="w-3.5 h-3.5" />
              INTRODUCING THE NEXT GENERATION OF INCENTIVES
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-6xl sm:text-8xl lg:text-9xl font-black tracking-tighter mb-8 leading-[0.95] text-white"
            >
              Scale with <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 animate-gradient-x">
                Infinite Revenue
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-2xl text-xl text-slate-400 mb-12 leading-relaxed"
            >
              The advanced enterprise engine designed to automate, optimize, and supercharge your sales performance with math-perfect accuracy.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto"
            >
              <button
                onClick={handleGetStarted}
                className="group relative px-10 py-5 bg-cyan-500 hover:bg-cyan-400 text-[#020617] rounded-full font-black text-lg transition-all hover:scale-105 active:scale-95 shadow-[0_0_50px_-10px_rgba(6,182,212,0.5)]"
              >
                Start Transacting Free
                <ArrowRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-10 py-5 bg-white/5 hover:bg-white/10 text-white rounded-full font-bold text-lg border border-white/10 backdrop-blur-md transition-all">
                Watch Demo
              </button>
            </motion.div>

            {/* Trust Bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="mt-24 w-full"
            >
              <p className="text-xs font-bold tracking-[0.3em] uppercase text-slate-500 mb-8">Powering Infrastructure for</p>
              <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-40 grayscale group hover:grayscale-0 transition-all duration-700">
                {partners.map(p => (
                  <span key={p} className="text-2xl font-black tracking-tighter hover:text-cyan-400 transition-colors cursor-default">{p}</span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Hero Visualization */}
          <motion.div
            style={{ opacity, scale }}
            className="max-w-7xl mx-auto mt-32 relative"
          >
            <div className="enterprise-glass rounded-3xl p-3 md:p-6 shadow-2xl relative z-10 border border-white/10">
              <div className="rounded-2xl bg-[#0b1222]/80 overflow-hidden aspect-video border border-white/5 relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                {/* Dashboard Mock Content */}
                <div className="p-8 h-full flex flex-col gap-8">
                  <div className="flex justify-between items-center">
                    <div className="space-y-2">
                      <div className="h-2 w-24 bg-white/10 rounded-full" />
                      <div className="h-6 w-48 bg-white/20 rounded-lg" />
                    </div>
                    <div className="flex gap-2">
                      <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10" />
                      <div className="h-10 w-10 rounded-xl bg-cyan-500 shadow-lg shadow-cyan-500/20" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="h-24 rounded-2xl bg-white/5 border border-white/5 p-4 animate-shimmer">
                        <div className="h-2 w-16 bg-white/10 rounded-full mb-2" />
                        <div className="h-4 w-32 bg-white/20 rounded-lg" />
                      </div>
                    ))}
                  </div>

                  <div className="flex-1 rounded-2xl bg-[#020617] border border-white/5 p-6 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/10 to-transparent" />
                    <div className="w-full h-full flex items-end gap-1">
                      {Array.from({ length: 48 }).map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ height: 0 }}
                          animate={{ height: `${Math.random() * 80 + 20}%` }}
                          transition={{ repeat: Infinity, duration: 2 + Math.random() * 2, repeatType: 'reverse' }}
                          className="flex-1 bg-cyan-500/40 rounded-t-sm"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Absolute Widgets */}
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -right-10 top-20 hidden lg:block"
            >
              <div className="enterprise-glass p-5 rounded-2xl w-64 shadow-2xl border border-cyan-500/30">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-sm font-bold">Earnings Paced</div>
                    <div className="text-[10px] text-slate-500 tracking-widest uppercase">+28% vs Target</div>
                  </div>
                </div>
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-400 w-[75%]" />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* Bento Feature Grid */}
        <section id="features" className="py-32 px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-black mb-6">Engineered for Complexity</h2>
              <p className="text-slate-400 max-w-xl mx-auto">Native capabilities that handle everything from basic commissions to enterprise-grade territories.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-6 gap-6 h-auto md:h-[600px]">
              <motion.div
                whileHover={{ y: -5 }}
                className="md:col-span-3 enterprise-glass rounded-[2rem] p-10 flex flex-col justify-end group transition-all"
              >
                <div className="mb-auto p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 w-fit">
                  <Shield className="w-8 h-8 text-cyan-400" />
                </div>
                <h3 className="text-3xl font-bold mb-4">Enterprise Security</h3>
                <p className="text-slate-400">SOC2 Type II compliant with granular audit trails for every single transaction and adjustment.</p>
              </motion.div>

              <motion.div
                whileHover={{ y: -5 }}
                className="md:col-span-3 enterprise-glass rounded-[2rem] p-10 flex flex-col justify-end overflow-hidden relative"
              >
                <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-100 transition-opacity">
                  <Activity className="w-32 h-32 text-indigo-500" />
                </div>
                <h3 className="text-3xl font-bold mb-4">Real-time Pulse</h3>
                <p className="text-slate-400">Sync with any modern CRM and get sub-second updates on quota attainment and earnings.</p>
              </motion.div>

              <motion.div
                whileHover={{ y: -5 }}
                className="md:col-span-2 enterprise-glass rounded-[2rem] p-8"
              >
                <PieChart className="w-8 h-8 text-purple-400 mb-6" />
                <h3 className="text-xl font-bold mb-2">Complex Splits</h3>
                <p className="text-sm text-slate-500">Easily manage overlays, shared deals, and multi-currency payouts.</p>
              </motion.div>

              <motion.div
                whileHover={{ y: -5 }}
                className="md:col-span-2 enterprise-glass rounded-[2rem] p-8"
              >
                <Trophy className="w-8 h-8 text-amber-400 mb-6" />
                <h3 className="text-xl font-bold mb-2">Gamification</h3>
                <p className="text-sm text-slate-500">Live leaderboards and automated milestone celebrations.</p>
              </motion.div>

              <motion.div
                whileHover={{ y: -5 }}
                className="md:col-span-2 enterprise-glass rounded-[2rem] p-8"
              >
                <Globe className="w-8 h-8 text-emerald-400 mb-6" />
                <h3 className="text-xl font-bold mb-2">Global Scale</h3>
                <p className="text-sm text-slate-500">Payout to any country with automated tax localization engine.</p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Dynamic Workflow Section */}
        <section className="py-32 bg-white/[0.02] border-y border-white/5 relative">
          <div className="max-w-7xl mx-auto px-6 overflow-hidden">
            <div className="flex flex-col lg:flex-row items-center gap-20">
              <div className="flex-1 text-center lg:text-left">
                <span className="text-cyan-400 font-bold tracking-[0.2em] text-xs uppercase mb-6 block">Unified Workflow</span>
                <h2 className="text-4xl md:text-6xl font-black mb-8">Deploy in minutes, <br />Scale for years.</h2>
                <div className="space-y-6">
                  {workflowSteps.map((step, i) => (
                    <div key={i} className="flex items-center gap-4 group cursor-default">
                      <div className={`w-12 h-12 rounded-xl border ${step.border} ${step.bg} flex items-center justify-center shrink-0 group-hover:scale-110 transition-all`}>
                        <step.icon className={`w-6 h-6 ${step.color}`} />
                      </div>
                      <div className="text-lg font-bold group-hover:text-cyan-400 transition-colors">{step.title}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex-1 relative w-full border border-white/10 rounded-3xl p-8 bg-[#0b1222]">
                <div className="space-y-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-16 w-full rounded-2xl bg-white/5 border border-white/5 flex items-center px-4 gap-4 animate-shimmer">
                      <div className="w-10 h-10 rounded-full bg-white/10" />
                      <div className="space-y-2">
                        <div className="h-2 w-32 bg-white/20 rounded-full" />
                        <div className="h-2 w-24 bg-white/10 rounded-full" />
                      </div>
                      <div className="ml-auto w-20 h-6 bg-cyan-500/20 rounded-full border border-cyan-500/30" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* High-Impact CTA */}
        <section className="py-40 px-6">
          <div className="max-w-5xl mx-auto relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 rounded-[3rem] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-700" />
            <div className="relative enterprise-glass rounded-[3rem] p-12 md:p-24 text-center border-white/20 overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-5 translate-x-1/2 -translate-y-1/2">
                <Zap className="w-96 h-96" />
              </div>

              <h2 className="text-4xl md:text-7xl font-black mb-10 tracking-tight text-white leading-tight">
                Start automating your <br /> revenue engine today.
              </h2>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <button onClick={handleGetStarted} className="px-12 py-6 bg-white text-[#020617] rounded-full font-black text-xl hover:bg-cyan-50 shadow-2xl transition-all hover:scale-105 active:scale-95">
                  Create Account
                </button>
                <button className="px-12 py-6 bg-white/5 border border-white/20 rounded-full font-black text-xl hover:bg-white/10 text-white backdrop-blur-3xl transition-all">
                  Talk to Sales
                </button>
              </div>
              <p className="mt-12 text-slate-500 font-medium">Join 2,500+ world-class organizations building on SalesReward.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-20 px-6 border-t border-white/5 relative z-10 bg-[#020617]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-3">
            <Zap className="w-8 h-8 text-cyan-400" />
            <span className="text-2xl font-black tracking-tighter text-white">SalesReward.</span>
          </div>

          <div className="flex gap-10 text-sm font-medium text-slate-500">
            <a href="#" className="hover:text-cyan-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-cyan-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-cyan-400 transition-colors">Security</a>
            <a href="#" className="hover:text-cyan-400 transition-colors">Status</a>
          </div>

          <div className="text-slate-600 text-xs font-bold tracking-widest uppercase">
            &copy; {new Date().getFullYear()} GLOBAL SCALE CORP.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
