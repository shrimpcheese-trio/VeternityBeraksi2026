"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { ArrowRight, ShieldCheck, CheckCircle2, Star, TrendingUp } from "lucide-react";
import { SplitText } from "@/components/ui/motion";

export function HeroSection() {
  const scoreValue = useMotionValue(0);
  const roundedScore = useTransform(scoreValue, (latest) => Math.floor(latest));
  const decimalScore = useTransform(scoreValue, (latest) => {
     const dec = Math.floor((latest % 1) * 10);
     return `.${dec}`;
  });

  React.useEffect(() => {
    const controls = animate(scoreValue, 98.5, {
      duration: 2,
      delay: 1.2,
      ease: [0.16, 1, 0.3, 1],
    });
    return controls.stop;
  }, [scoreValue]);

  const staggerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } }
  };

  return (
    <section className="relative bg-bg pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden border-b border-border">
      
      {/* Background Meshes */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-[1400px] pointer-events-none -z-10">
        <motion.div 
          animate={{ scale: [1, 1.05, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-sky/10 rounded-[100%] blur-[120px] mix-blend-multiply dark:mix-blend-lighten" 
        />
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.6, 0.9, 0.6] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-teal-400/5 rounded-[100%] blur-[150px] mix-blend-multiply dark:mix-blend-lighten" 
        />
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1200px] flex flex-col items-center text-center">
          
        {/* Top — Centered Text */}
        <div className="flex flex-col items-center gap-6 lg:gap-8 max-w-[850px] relative z-10 mx-auto">
          
          {/* Main Headline */}
          <motion.h1 
            variants={staggerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="text-4xl sm:text-[4.25rem] lg:text-[5.25rem] font-heading font-bold text-navy leading-[1.1] sm:leading-[1.05] tracking-[-0.03em]"
          >
            <SplitText text="Ubah Setiap Pekerjaan Menjadi" /> <span className="text-sky relative inline-block">
              <SplitText text="Reputasi Permanen." />
              <svg className="absolute w-full h-3 -bottom-1 lg:-bottom-2 left-0 text-sky/20" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" /></svg>
            </span>
          </motion.h1>
          
          {/* Sub-headline */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg md:text-xl text-text-muted leading-relaxed max-w-[700px] font-medium"
          >
            Tinggalkan cara lama. Upahku mendokumentasikan kerja keras Anda menjadi Trust Score terverifikasi — membuka jalan untuk upah yang lebih adil dan pekerjaan yang lebih besar.
          </motion.p>
          
          {/* CTAs */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row justify-center gap-4 mt-2 w-full sm:w-auto relative"
          >
            <Button size="lg" className="h-14 rounded-full shadow-[0_10px_40px_-10px_rgba(14,165,233,0.4)] hover:shadow-[0_20px_40px_-10px_rgba(14,165,233,0.5)] hover:-translate-y-1 transition-all bg-sky text-white hover:bg-sky-active px-8 font-bold text-base group w-full sm:w-auto relative overflow-hidden">
              <span className="relative z-10 flex items-center">
                Mulai Catat Pekerjaan
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-sky-300/0 via-white/20 to-sky-300/0 -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            </Button>
            <Button variant="outline" size="lg" className="h-14 rounded-full bg-white/50 backdrop-blur-xl text-navy border-border/60 hover:bg-white hover:border-border px-8 font-bold text-base shadow-sm hover:shadow-md transition-all w-full sm:w-auto">
              Cari Pekerja
            </Button>
          </motion.div>
        </div>

        {/* Bottom — Floating Dashboard UI with Smooth Ordina Animation */}
        <motion.div 
          initial={{ opacity: 0, filter: "blur(12px)", y: 24, scale: 0.97 }}
          whileInView={{ opacity: 1, filter: "blur(0px)", y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto w-full max-w-[1024px] mt-20 md:mt-24 text-left z-20"
        >
          
          {/* Main Dashboard Window */}
          <div className="relative w-full rounded-[2rem] border border-white/60 bg-white/60 dark:bg-bg-card/60 backdrop-blur-3xl shadow-[0_30px_80px_-20px_rgba(9,64,103,0.12)] overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-[0_40px_100px_-20px_rgba(9,64,103,0.18)]">
            
            {/* Window Header */}
            <div className="w-full h-12 bg-white/50 border-b border-border/40 flex items-center px-6 gap-2">
               <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-border/60 hover:bg-coral transition-colors" />
                  <div className="w-3 h-3 rounded-full bg-border/60 hover:bg-amber-400 transition-colors" />
                  <div className="w-3 h-3 rounded-full bg-border/60 hover:bg-emerald-400 transition-colors" />
               </div>
               <div className="mx-auto bg-white/60 px-32 h-6 rounded-md border border-border/30" />
            </div>

            {/* Dashboard Content */}
            <div className="p-6 md:p-10 flex flex-col lg:flex-row gap-8 bg-gradient-to-b from-white/40 to-transparent">
               
               {/* Left Panel: Profile & Trust Score */}
               <div className="flex-1 flex flex-col gap-6">
                  {/* Floating Profile Card */}
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={{ y: -3, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)", borderColor: "rgba(226, 232, 240, 1)" }}
                    className="bg-white rounded-3xl p-6 border border-border/60 shadow-sm flex items-center gap-5 relative overflow-hidden transition-all duration-300"
                  >
                     <div className="absolute top-0 right-0 w-32 h-32 bg-sky/5 rounded-full -translate-y-1/2 translate-x-1/3" />
                     <div className="relative shrink-0">
                        <img src="https://images.unsplash.com/photo-1540569014015-19a7be504e3a?q=80&w=150&h=150&auto=format&fit=crop" className="w-16 h-16 rounded-2xl object-cover grayscale opacity-90 border border-border shadow-sm" />
                        <motion.div 
                           initial={{ scale: 0, opacity: 0 }}
                           animate={{ scale: 1, opacity: 1 }}
                           transition={{ duration: 0.5, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
                           className="absolute -bottom-1.5 -right-1.5 bg-[#10b981] p-1 rounded-full border-[2px] border-white shadow-sm"
                        >
                           <CheckCircle2 className="w-3 h-3 text-white" />
                        </motion.div>
                     </div>
                     <div className="flex flex-col z-10">
                        <span className="font-heading font-bold text-navy text-xl leading-tight">Budi Santoso</span>
                        <span className="text-sky font-semibold text-xs mt-0.5 bg-sky/10 w-fit px-2 py-0.5 rounded-md">Top 5% Pekerja</span>
                     </div>
                  </motion.div>

                  {/* Large Trust Score Widget */}
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={{ y: -3, boxShadow: "0 20px 40px -10px rgba(9,64,103,0.3)", borderColor: "rgba(59, 130, 246, 0.5)" }}
                    className="bg-navy rounded-3xl p-8 border border-navy-active shadow-xl relative overflow-hidden text-white flex flex-col justify-between h-full min-h-[220px] transition-all duration-300"
                  >
                     {/* Animated smooth curve chart */}
                     <svg className="absolute inset-0 w-[120%] h-full opacity-30" viewBox="0 0 600 200" preserveAspectRatio="none">
                        <defs>
                           <linearGradient id="hero-chart-gradient" x1="0" x2="0" y1="0" y2="1">
                              <stop offset="0%" stopColor="currentColor" stopOpacity="0.5" />
                              <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                           </linearGradient>
                        </defs>
                        
                        {/* Area Fill */}
                        <motion.path
                           initial={{ opacity: 0 }}
                           animate={{ opacity: 1 }}
                           transition={{ duration: 1.5, delay: 1.5, ease: "easeOut" }}
                           d="M0,180 C100,180 150,90 250,110 C350,130 450,40 600,50 L600,200 L0,200 Z"
                           fill="url(#hero-chart-gradient)"
                           stroke="none"
                        />
                        
                        {/* Dashed Secondary Line */}
                        <motion.path 
                           initial={{ pathLength: 0, opacity: 0 }}
                           animate={{ pathLength: 1, opacity: 0.6 }}
                           transition={{ duration: 2.5, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
                           d="M0,190 C120,190 200,130 300,140 C400,150 500,60 600,70" 
                           fill="none" 
                           stroke="currentColor" 
                           strokeWidth="2" 
                           strokeDasharray="6 6" 
                        />
                        
                        {/* Main Smooth Line */}
                        <motion.path 
                           initial={{ pathLength: 0, opacity: 0 }}
                           animate={{ pathLength: 1, opacity: 1 }}
                           transition={{ duration: 2.5, delay: 1, ease: [0.16, 1, 0.3, 1] }}
                           d="M0,180 C100,180 150,90 250,110 C350,130 450,40 600,50" 
                           fill="none" 
                           stroke="currentColor" 
                           strokeWidth="4" 
                           strokeLinecap="round"
                        />
                     </svg>

                     <div className="relative z-10 flex items-center gap-2 mb-4">
                        <ShieldCheck className="w-5 h-5 text-sky" />
                        <span className="text-xs font-bold uppercase tracking-widest text-sky">Trust Score Global</span>
                     </div>

                     <div className="relative z-10 flex items-end gap-3 mt-auto">
                        <span className="text-[5rem] font-heading font-black leading-none tracking-tighter flex items-end">
                           <motion.span>{roundedScore}</motion.span>
                           <motion.span className="text-[3rem] text-white/40 mb-2">{decimalScore}</motion.span>
                        </span>
                        <div className="flex flex-col mb-2">
                           <motion.span 
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.5, delay: 2, ease: [0.16, 1, 0.3, 1] }}
                              className="flex items-center gap-1 text-green-400 text-xs font-bold bg-green-400/10 px-2 py-1 rounded-md border border-green-400/20"
                           >
                              <TrendingUp className="w-3 h-3" /> +12%
                           </motion.span>
                        </div>
                     </div>
                  </motion.div>
               </div>

               {/* Right Panel: Recent Verified Jobs */}
               <div className="flex-[1.3] flex flex-col gap-4">
                  <motion.div 
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
                     className="flex items-center justify-between px-2"
                  >
                     <h3 className="text-sm font-bold text-navy uppercase tracking-widest">Bukti Kerja Terbaru</h3>
                     <span className="text-xs text-sky font-bold hover:underline cursor-pointer">Lihat Detail &rarr;</span>
                  </motion.div>

                  {/* Job Card */}
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={{ y: -3, boxShadow: "0 15px 35px -10px rgba(0,0,0,0.08)", borderColor: "rgba(56, 189, 248, 0.4)" }}
                    className="bg-white rounded-3xl p-6 border border-border/60 shadow-[0_5px_20px_-15px_rgba(0,0,0,0.05)] flex flex-col gap-5 h-full transition-all duration-300"
                  >
                     <div className="flex justify-between items-start">
                        <div className="flex flex-col gap-1">
                           <span className="font-heading font-bold text-navy text-xl">Cuci AC Split & Perbaikan Pipa</span>
                           <span className="text-xs font-semibold text-text-muted">Diselesaikan 2 hari lalu di Jakarta Selatan</span>
                        </div>
                        <div className="text-right">
                           <span className="font-bold text-navy text-lg">Rp 150.000</span>
                        </div>
                     </div>

                     {/* Photos Mini-Grid */}
                     <div className="grid grid-cols-2 gap-3 h-[140px]">
                        <div className="relative rounded-2xl bg-bg overflow-hidden border border-border group/photo">
                           <img src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=300&h=200&auto=format&fit=crop" className="w-full h-full object-cover grayscale opacity-70 group-hover/photo:scale-105 transition-transform duration-700" />
                           <div className="absolute top-2 left-2 bg-white/90 backdrop-blur text-navy text-[10px] font-bold px-2.5 py-1 rounded-md shadow-sm">SEBELUM</div>
                        </div>
                        <div className="relative rounded-2xl bg-bg overflow-hidden border border-border group/photo">
                           <img src="https://images.unsplash.com/photo-1621905252507-b35492cc74b4?q=80&w=300&h=200&auto=format&fit=crop" className="w-full h-full object-cover grayscale opacity-90 group-hover/photo:scale-105 transition-transform duration-700" />
                           <div className="absolute top-2 left-2 bg-sky text-white text-[10px] font-bold px-2.5 py-1 rounded-md shadow-sm">SESUDAH</div>
                        </div>
                     </div>

                     {/* Verification Status */}
                     <div className="bg-[#10b981]/10 border border-[#10b981]/20 rounded-xl p-3.5 flex items-center gap-3 mt-auto">
                        <motion.div 
                           initial={{ scale: 0 }}
                           animate={{ scale: 1 }}
                           transition={{ duration: 0.5, delay: 1.4, ease: [0.16, 1, 0.3, 1] }}
                           className="w-8 h-8 rounded-full bg-[#10b981] flex items-center justify-center shrink-0 shadow-sm border-[2px] border-white"
                        >
                           <Star className="w-4 h-4 text-white fill-white" />
                        </motion.div>
                        <div className="flex flex-col">
                           <span className="text-[13px] font-bold text-[#065f46]">Dikonfirmasi Pelanggan</span>
                           <span className="text-[11px] font-medium text-[#065f46]/80 mt-0.5">Rating 5/5 & Ulasan positif diverifikasi.</span>
                        </div>
                     </div>
                  </motion.div>
               </div>
            </div>
          </div>
          
          {/* Floating UI Elements (Staggered Entry + Gentle Float) */}
          <motion.div 
            initial={{ opacity: 0, y: 15, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="absolute -right-4 md:-right-8 top-12 md:-top-6 z-30"
          >
             <motion.div
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="bg-white/90 backdrop-blur-md border border-white p-4 rounded-2xl shadow-[0_15px_30px_-10px_rgba(0,0,0,0.08)] flex items-center gap-3"
             >
               <div className="w-10 h-10 bg-coral/10 rounded-full flex items-center justify-center border border-coral/20">
                  <span className="text-lg">💰</span>
               </div>
               <div className="flex flex-col pr-2">
                  <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Estimasi Upah</span>
                  <span className="text-navy font-bold text-sm">Sesuai Standar</span>
               </div>
             </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 15, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="absolute -left-4 md:-left-12 bottom-20 md:bottom-12 z-30"
          >
             <motion.div
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="bg-white/90 backdrop-blur-md border border-white p-4 rounded-2xl shadow-[0_15px_30px_-10px_rgba(0,0,0,0.08)] flex items-center gap-3"
             >
               <div className="w-10 h-10 bg-sky/10 rounded-full flex items-center justify-center border border-sky/20">
                  <ShieldCheck className="w-5 h-5 text-sky" />
               </div>
               <div className="flex flex-col pr-2">
                  <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Status Pekerja</span>
                  <span className="text-navy font-bold text-sm">Terverifikasi</span>
               </div>
             </motion.div>
          </motion.div>

        </motion.div>

      </div>
    </section>
  );
}
