"use client";
import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Camera, CheckCircle2, Star } from "lucide-react";
import { BlurReveal, StaggerContainer, StaggerItem, StaggerTextContainer, SplitText } from "@/components/ui/motion";
import { useTranslations } from "next-intl";

// --- High-End SaaS Mockup Previews ---

const Preview0 = () => (
  <div className="absolute inset-0 w-full h-full flex items-end justify-center px-6 md:px-16 pt-16 overflow-hidden bg-[#F3F4F6]">
    <div className="w-full max-w-3xl bg-white rounded-t-2xl shadow-[0_-10px_40px_rgb(0,0,0,0.06)] border border-border border-b-0 h-[350px] md:h-[420px] flex overflow-hidden">

      {/* Sidebar Mockup */}
      <div className="hidden md:flex w-64 border-r border-border/50 bg-[#F9FAFB] p-6 flex-col gap-5">
        <div className="w-24 h-4 rounded-md bg-border/60 mb-6"></div>
        <div className="w-full h-9 rounded-lg bg-white border border-border shadow-sm flex items-center px-3 gap-3">
          <div className="w-3 h-3 rounded-full bg-[#0ea5e9]"></div>
          <div className="w-20 h-2.5 rounded bg-navy/80"></div>
        </div>
        <div className="w-full h-9 rounded-lg flex items-center px-3 gap-3 opacity-50">
          <div className="w-3 h-3 rounded-full bg-border"></div>
          <div className="w-24 h-2.5 rounded bg-navy/80"></div>
        </div>
        <div className="w-full h-9 rounded-lg flex items-center px-3 gap-3 opacity-50">
          <div className="w-3 h-3 rounded-full bg-border"></div>
          <div className="w-16 h-2.5 rounded bg-navy/80"></div>
        </div>
      </div>

      {/* Main Content Mockup */}
      <div className="flex-1 p-6 md:p-10 bg-white flex flex-col">
        <div className="flex justify-between items-center mb-10">
          <div className="flex flex-col gap-2">
            <div className="w-48 h-5 rounded-md bg-navy/80"></div>
            <div className="w-32 h-3 rounded-md bg-text-muted/40"></div>
          </div>
          <div className="w-28 h-9 rounded-lg bg-navy text-white text-[11px] font-bold flex items-center justify-center shadow-md">Unggah Bukti</div>
        </div>

        <div className="grid grid-cols-2 gap-4 md:gap-8 flex-1">
          <div className="border-2 border-dashed border-border rounded-2xl bg-[#F9FAFB] flex flex-col items-center justify-center text-text-muted/50 group hover:border-navy/30 transition-colors">
            <Camera className="w-8 h-8 mb-3 text-border group-hover:text-navy/40 transition-colors" />
            <span className="text-xs font-bold uppercase tracking-widest text-border group-hover:text-navy/50 transition-colors">Foto Sebelum</span>
          </div>
          <div className="border-2 border-dashed border-border rounded-2xl bg-[#F9FAFB] flex flex-col items-center justify-center text-text-muted/50 relative overflow-hidden group hover:border-navy/30 transition-colors">
            <motion.div
              initial={{ height: "0%" }}
              animate={{ height: "100%" }}
              transition={{ duration: 2, ease: "easeInOut", delay: 0.2 }}
              className="absolute bottom-0 w-full bg-[#0ea5e9]/10"
            ></motion.div>
            <Camera className="w-8 h-8 mb-3 text-border relative z-10 group-hover:text-navy/40 transition-colors" />
            <span className="text-xs font-bold uppercase tracking-widest text-border relative z-10 group-hover:text-navy/50 transition-colors">Foto Sesudah</span>
          </div>
        </div>
      </div>

    </div>
  </div>
);

const Preview1 = () => (
  <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center p-6 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-[#F9FAFB] to-[#F3F4F6]">
    <motion.div
      initial={{ scale: 0.95, opacity: 0, y: 10 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ type: "spring", bounce: 0.3, duration: 0.8 }}
      className="bg-white border border-border/80 p-8 md:p-10 rounded-3xl shadow-[0_20px_40px_rgb(0,0,0,0.04)]  w-full flex flex-col items-center"
    >
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-[#10B981]/20 blur-xl rounded-full"></div>
        <div className="w-16 h-16 rounded-full bg-[#10B981]/10 flex items-center justify-center text-[#10B981] relative z-10 border border-[#10B981]/20">
          <CheckCircle2 className="w-8 h-8" />
        </div>
      </div>
      <h4 className="font-heading font-bold text-navy text-2xl mb-3">Pekerjaan Disetujui</h4>
      <p className="text-sm text-text-muted text-center mb-8 leading-relaxed px-4">
        Pelanggan telah memverifikasi bukti kerja Anda. Hasil ini akan dicatat secara permanen ke dalam reputasi Anda.
      </p>

      <div className="w-full flex flex-col gap-3">
        <div className="w-full p-4 bg-[#F9FAFB] border border-border/60 rounded-2xl flex justify-between items-center">
          <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Status Validasi</span>
          <div className="flex items-center gap-1.5 bg-[#10B981]/10 px-2.5 py-1 rounded-md">
            <div className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></div>
            <span className="text-xs font-bold text-[#10B981] uppercase tracking-wider">Terverifikasi</span>
          </div>
        </div>
        <div className="w-full p-4 bg-[#F9FAFB] border border-border/60 rounded-2xl flex justify-between items-center">
          <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Poin Reputasi</span>
          <span className="text-sm font-bold text-navy">+15 Poin</span>
        </div>
      </div>
    </motion.div>
  </div>
);

const Preview2 = () => (
  <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-end px-6 md:px-16 pt-16 overflow-hidden bg-[#F3F4F6]">
    <div className="w-full max-w-4xl bg-white rounded-t-3xl shadow-[0_-10px_40px_rgb(0,0,0,0.06)] border border-border border-b-0 p-8 md:p-12 pb-0 flex flex-col h-[350px] md:h-[420px]">

      <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-12 gap-6">
        <div>
          <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-3">Trust Score Global</p>
          <h3 className="text-6xl md:text-7xl font-heading font-bold text-navy leading-none">
            98<span className="text-4xl md:text-5xl text-border">.5</span>
          </h3>
        </div>
        <div className="flex gap-2 text-[#10B981] items-center bg-[#10B981]/10 px-4 py-2 rounded-xl border border-[#10B981]/20">
          <Star className="w-4 h-4 fill-[#10B981]" />
          <span className="text-sm font-bold uppercase tracking-wider">Top 5% Pekerja</span>
        </div>
      </div>

      {/* Minimalist SaaS Line Chart */}
      <div className="w-full flex-1 relative mt-auto">
        {/* Chart Grid */}
        <div className="absolute inset-0 flex flex-col justify-between pb-8">
          <div className="w-full h-px bg-border/40"></div>
          <div className="w-full h-px bg-border/40"></div>
          <div className="w-full h-px bg-border/40"></div>
        </div>

        <div className="absolute inset-0 pb-8 h-full w-full">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 1000 200" preserveAspectRatio="none">
            {/* Gradient Fill */}
            <motion.path
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              d="M0,180 Q250,160 500,100 T800,60 T1000,20 L1000,200 L0,200 Z"
              fill="url(#chart-gradient)"
              className="opacity-40"
            />
            {/* Line */}
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              d="M0,180 Q250,160 500,100 T800,60 T1000,20"
              fill="none"
              stroke="#0ea5e9"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="chart-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Pulsing Dot */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.4, type: "spring", bounce: 0.5 }}
          className="absolute right-0 top-0 -mt-2 -mr-2 w-4 h-4 bg-white border-[3px] border-[#0ea5e9] rounded-full shadow-[0_0_15px_rgba(14,165,233,0.5)] z-10"
        ></motion.div>
      </div>

    </div>
  </div>
);

export function HowItWorksSection() {
  const t = useTranslations("howItWorks");
  const steps = t.raw("steps") as Array<{ title: string; desc: string }>;
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [progress, setProgress] = React.useState(0);
  const DURATION = 5000;

  React.useEffect(() => {
    let animationFrameId: number;
    let startTimestamp: number | null = null;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;

      const currentProgress = Math.min((elapsed / DURATION) * 100, 100);
      setProgress(currentProgress);

      if (elapsed < DURATION) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setActiveIndex((prev) => (prev + 1) % steps.length);
      }
    };

    animationFrameId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [activeIndex]);

  const handleTabClick = (index: number) => {
    if (index !== activeIndex) {
      setActiveIndex(index);
      setProgress(0);
    }
  };

  const previews = [<Preview0 key="0" />, <Preview1 key="1" />, <Preview2 key="2" />];

  return (
    <section id="cara-kerja" className="bg-bg py-24 md:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1100px]">

        {/* Header Section (Centered) */}
        <div className="flex flex-col items-center text-center mb-16 max-w-3xl mx-auto">
          <StaggerTextContainer className="text-[2.5rem] md:text-[3.5rem] font-heading font-semibold text-navy leading-[1.1] tracking-tight">
             <SplitText text={t("title")} />
          </StaggerTextContainer>
        </div>

        {/* Ordina-Style Borderless Tabs */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 lg:gap-16 mb-16">
          {steps.map((step, i) => {
            const isActive = i === activeIndex;
            return (
              <StaggerItem key={i}>
                <button
                  onClick={() => handleTabClick(i)}
                  className="relative text-left flex flex-col pt-6 focus:outline-none group w-full"
                >
                  {/* Background Track for Progress */}
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-border/40 transition-colors group-hover:bg-border"></div>

                  {/* Active Progress Bar */}
                  <div
                    className="absolute top-0 left-0 h-[2px] bg-navy"
                    style={{
                      width: isActive ? `${progress}%` : "0%",
                      transition: isActive ? "none" : "width 0.3s ease-out"
                    }}
                  />

                  <h3 className={`text-lg md:text-xl font-heading font-semibold mb-3 flex items-center gap-3 transition-colors duration-300 ${isActive ? 'text-navy' : 'text-text-muted group-hover:text-navy'
                    }`}>
                    <span className={`text-sm font-bold font-mono px-2 py-0.5 rounded-md transition-colors duration-300 ${isActive ? 'bg-navy text-white' : 'bg-border/40 text-text-muted group-hover:bg-border/60'
                      }`}>
                      0{i + 1}
                    </span>
                    {step.title}
                  </h3>
                  <p className={`text-sm leading-relaxed transition-colors duration-300 ${isActive ? 'text-text-muted' : 'text-text-muted/60 group-hover:text-text-muted'
                    }`}>
                    {step.desc}
                  </p>
                </button>
              </StaggerItem>
            );
          })}
        </StaggerContainer>

        {/* Massive SaaS Preview Area */}
        <BlurReveal delay={0.4}>
          <div className="w-full bg-[#F3F4F6] rounded-3xl overflow-hidden relative border border-border/60 p-0 h-[450px] lg:h-[500px] block">
            <div className="relative block w-full h-full max-w-5xl mx-auto overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="absolute inset-0 w-full h-full block"
                >
                  {previews[activeIndex]}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </BlurReveal>

      </div>
    </section>
  );
}
