"use client";
import * as React from "react";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useInView, useMotionValue, useSpring, useTransform, animate } from "framer-motion";
import { Search, ArrowRight, ShieldCheck, MapPin, Check } from "lucide-react";
import { BlurReveal, StaggerTextContainer, SplitText } from "@/components/ui/motion";

function AnimatedCounter({ value, active, prefix = "", suffix = "", duration = 1.5 }: { value: number, active: boolean, prefix?: string, suffix?: string, duration?: number }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, Math.round);
  const display = useTransform(rounded, (v) => `${prefix}${v.toLocaleString("id-ID")}${suffix}`);

  useEffect(() => {
    if (active) {
      const controls = animate(count, value, { duration, ease: [0.16, 1, 0.3, 1] });
      return controls.stop;
    } else {
      count.set(0); 
    }
  }, [active, value, duration, count]);

  return <motion.span>{display}</motion.span>;
}

const PointerCursor = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-xl">
    <path d="M4 4L11 25L14.5 16.5L23 13L4 4Z" fill="#0f172a" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
  </svg>
);

const candidates = [
  { name: "Wawan Subianto", role: "Tukang Kayu", score: 98, img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150&h=150&auto=format&fit=crop" },
  { name: "Rizky Pratama", role: "Montir", score: 85, img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=150&h=150&auto=format&fit=crop" },
  { name: "Ahmad Fauzi", role: "Tukang Cat", score: 79, img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&h=150&auto=format&fit=crop" }
];

function getWorkflowStep(phase: number) {
  if (phase >= 1 && phase <= 6) return 1;
  if (phase >= 7 && phase <= 10) return 2;
  if (phase >= 11 && phase <= 14) return 3;
  if (phase >= 15) return 4;
  return 0;
}

function getCursorStyle(phase: number) {
  // Container uses pt-8 (32px top offset)
  switch (phase) {
    case 0: return { x: 300, y: 550, opacity: 0, scale: 1 };
    case 1: return { x: 300, y: 550, opacity: 0, scale: 1 };
    case 2: return { x: 350, y: 70, opacity: 1, scale: 1 }; // Hover search
    case 3: return { x: 350, y: 70, opacity: 1, scale: 0.8 }; // Click search
    case 4: return { x: 350, y: 70, opacity: 1, scale: 1 }; // Release search
    case 5: return { x: 240, y: 160, opacity: 1, scale: 1 }; // Hover candidate
    case 6: return { x: 240, y: 160, opacity: 1, scale: 0.8 }; // Click candidate
    case 7:
    case 8:
    case 9:
    case 10:
    case 11:
    case 12: return { x: 440, y: 350, opacity: 1, scale: 1 }; // Move out of way
    case 13: return { x: 370, y: 535, opacity: 1, scale: 1 }; // Hover CTA
    case 14: return { x: 370, y: 535, opacity: 1, scale: 0.8 }; // Click CTA
    case 15: return { x: 400, y: 550, opacity: 0, scale: 1 }; // Hide on success
    default: return { x: 400, y: 550, opacity: 0, scale: 1 };
  }
}

export function EmployersSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, margin: "-10%" });
  const [phase, setPhase] = useState(0);

  // Parallax Setup
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x * 12);
    mouseY.set(y * 12);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const cardX = useSpring(mouseX, { stiffness: 100, damping: 20 });
  const cardY = useSpring(mouseY, { stiffness: 100, damping: 20 });

  // Storytelling Loop
  useEffect(() => {
    if (!isInView) {
      setPhase(0);
      return;
    }
    
    let isActive = true;
    const runSequence = async () => {
      while (isActive) {
        setPhase(1); // Start
        await new Promise(r => setTimeout(r, 600));
        if (!isActive) break;
        
        setPhase(2); // Hover Search
        await new Promise(r => setTimeout(r, 800));
        if (!isActive) break;
        
        setPhase(3); // Click Search
        await new Promise(r => setTimeout(r, 300));
        if (!isActive) break;
        
        setPhase(4); // List Appears
        await new Promise(r => setTimeout(r, 1000));
        if (!isActive) break;
        
        setPhase(5); // Hover candidate
        await new Promise(r => setTimeout(r, 800));
        if (!isActive) break;
        
        setPhase(6); // Click candidate
        await new Promise(r => setTimeout(r, 300));
        if (!isActive) break;
        
        setPhase(7); // Expanded Card Profile
        await new Promise(r => setTimeout(r, 1000));
        if (!isActive) break;
        
        setPhase(8); // Trust Score
        await new Promise(r => setTimeout(r, 1200));
        if (!isActive) break;
        
        setPhase(9); // Badge
        await new Promise(r => setTimeout(r, 1200));
        if (!isActive) break;
        
        setPhase(10); // Foto Before -> After
        await new Promise(r => setTimeout(r, 3500)); 
        if (!isActive) break;
        
        setPhase(11); // Wage
        await new Promise(r => setTimeout(r, 1200));
        if (!isActive) break;
        
        setPhase(12); // CTA Appears
        await new Promise(r => setTimeout(r, 1000));
        if (!isActive) break;
        
        setPhase(13); // Hover CTA
        await new Promise(r => setTimeout(r, 800));
        if (!isActive) break;
    
        setPhase(14); // Click CTA
        await new Promise(r => setTimeout(r, 300));
        if (!isActive) break;
    
        setPhase(15); // Success Screen (Selesai)
        await new Promise(r => setTimeout(r, 5500));
        if (!isActive) break;
        
        setPhase(0); // Reset
        await new Promise(r => setTimeout(r, 800));
      }
    };
    
    runSequence();
    return () => { isActive = false; };
  }, [isInView]);

  const activeStep = getWorkflowStep(phase);

  return (
    <section 
      id="untuk-pemberi-kerja" 
      className="relative bg-navy py-24 md:py-32 lg:py-40 overflow-hidden"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Premium Background Depth */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[10%] w-[50%] h-[50%] bg-sky/5 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-teal-500/5 rounded-full blur-[120px]" />
        
        {/* Subtle Noise Texture */}
        <div 
          className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} 
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1200px] relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Kolom Kiri: Narasi & Workflow Indicator */}
          <BlurReveal 
            className="flex flex-col gap-12 lg:max-w-[480px]"
          >
            {/* Header Content */}
            <div className="flex flex-col gap-6">
              <div className="inline-flex self-start items-center px-3.5 py-1.5 rounded-full bg-sky/10 border border-sky/20 text-[10px] font-bold uppercase tracking-widest text-sky">
                Untuk Pemberi Kerja
              </div>
              
              <StaggerTextContainer delayChildren={0.1} className="text-[2.5rem] md:text-[3.25rem] font-heading font-semibold text-bg leading-[1.15] tracking-tight">
                <SplitText text="Temukan pekerja berdasarkan" /> <span className="text-sky font-medium"><SplitText text="bukti" /></span><SplitText text=", bukan sekadar janji." />
              </StaggerTextContainer>
              
              <p className="text-lg text-bg/70 leading-relaxed font-light mt-2">
                Setiap pekerja di Upahku memiliki riwayat proyek terverifikasi. Anda tidak perlu lagi menebak-nebak kualitas hasil kerja mereka.
              </p>
            </div>
            
            {/* Workflow Indicator */}
            <div className="flex flex-col gap-8 border-t border-white/10 pt-10">
              <span className="text-[11px] uppercase font-bold tracking-widest text-text-muted">Cara Kerja Upahku</span>
              
              <div className="flex flex-col gap-0 relative">
                 {/* Progress Line */}
                 <div className="absolute left-[15px] top-4 bottom-4 w-px bg-white/10">
                   <motion.div 
                     className="w-full bg-sky"
                     initial={{ height: "0%" }}
                     animate={{ height: activeStep === 1 ? "0%" : activeStep === 2 ? "33%" : activeStep === 3 ? "66%" : activeStep === 4 ? "100%" : "0%" }}
                     transition={{ duration: 0.6, ease: "easeInOut" }}
                   />
                 </div>
                 
                 {/* Step 1 */}
                 <div className={`relative flex items-start gap-5 py-4 transition-all duration-500 ${activeStep >= 1 ? 'opacity-100' : 'opacity-40'}`}>
                   <div className={`relative z-10 w-8 h-8 rounded-full border flex items-center justify-center text-xs font-bold transition-colors duration-500 ${activeStep >= 1 ? 'bg-sky text-navy border-sky shadow-[0_0_15px_rgba(56,189,248,0.4)]' : 'bg-navy border-white/20 text-white/50'}`}>1</div>
                   <div className="flex flex-col pt-1">
                     <span className={`text-lg font-medium transition-colors duration-500 ${activeStep >= 1 ? 'text-white' : 'text-white/60'}`}>Cari Kandidat</span>
                   </div>
                 </div>
                 
                 {/* Step 2 */}
                 <div className={`relative flex items-start gap-5 py-4 transition-all duration-500 ${activeStep >= 2 ? 'opacity-100' : 'opacity-40'}`}>
                   <div className={`relative z-10 w-8 h-8 rounded-full border flex items-center justify-center text-xs font-bold transition-colors duration-500 ${activeStep >= 2 ? 'bg-sky text-navy border-sky shadow-[0_0_15px_rgba(56,189,248,0.4)]' : 'bg-navy border-white/20 text-white/50'}`}>2</div>
                   <div className="flex flex-col pt-1">
                     <span className={`text-lg font-medium transition-colors duration-500 ${activeStep >= 2 ? 'text-white' : 'text-white/60'}`}>Lihat Bukti Nyata</span>
                   </div>
                 </div>

                 {/* Step 3 */}
                 <div className={`relative flex items-start gap-5 py-4 transition-all duration-500 ${activeStep >= 3 ? 'opacity-100' : 'opacity-40'}`}>
                   <div className={`relative z-10 w-8 h-8 rounded-full border flex items-center justify-center text-xs font-bold transition-colors duration-500 ${activeStep >= 3 ? 'bg-sky text-navy border-sky shadow-[0_0_15px_rgba(56,189,248,0.4)]' : 'bg-navy border-white/20 text-white/50'}`}>3</div>
                   <div className="flex flex-col pt-1">
                     <span className={`text-lg font-medium transition-colors duration-500 ${activeStep >= 3 ? 'text-white' : 'text-white/60'}`}>Rekrut dengan Percaya Diri</span>
                   </div>
                 </div>

                 {/* Step 4 */}
                 <div className={`relative flex items-start gap-5 py-4 transition-all duration-500 ${activeStep >= 4 ? 'opacity-100' : 'opacity-40'}`}>
                   <div className={`relative z-10 w-8 h-8 rounded-full border flex items-center justify-center text-xs font-bold transition-colors duration-500 ${activeStep >= 4 ? 'bg-green-400 text-navy border-green-400 shadow-[0_0_15px_rgba(74,222,128,0.4)]' : 'bg-navy border-white/20 text-white/50'}`}>
                     <Check className="w-4 h-4" />
                   </div>
                   <div className="flex flex-col pt-1">
                     <span className={`text-lg font-medium transition-colors duration-500 ${activeStep >= 4 ? 'text-white' : 'text-white/60'}`}>Selesai</span>
                   </div>
                 </div>
              </div>
            </div>
          </BlurReveal>

          {/* Kolom Kanan: Visual Storytelling Stage */}
          <BlurReveal delay={0.2} className="relative w-full min-h-[600px] flex items-center justify-center perspective-[1000px]">
            <motion.div 
              style={{ x: cardX, y: cardY }}
              className="w-full max-w-[480px] h-[580px] flex flex-col pt-8 relative will-change-transform"
            >
              
              {/* Animated Cursor Effect */}
              <motion.div 
                initial={{ opacity: 0, x: 400, y: 550 }}
                animate={getCursorStyle(phase)}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} 
                className="absolute top-0 left-0 z-50 pointer-events-none"
              >
                <PointerCursor />
              </motion.div>

              <AnimatePresence mode="wait">
                
                {/* Phase 1 - 6: Search and List */}
                {phase >= 1 && phase <= 6 && (
                  <motion.div 
                    key="search-stage"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    className="w-full flex flex-col gap-4"
                  >
                    {/* Search Bar */}
                    <div className="w-full h-16 bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl flex items-center px-6 shadow-[0_20px_40px_rgba(0,0,0,0.2)]">
                      <Search className="text-white/50 w-5 h-5" />
                      <span className="ml-4 text-white/70 font-medium text-lg tracking-wide">
                        {phase >= 4 ? "Tukang Kayu, Jakarta..." : <span className="opacity-50">Ketik jenis pekerja...</span>}
                      </span>
                    </div>

                    {/* Candidate List */}
                    <AnimatePresence>
                      {phase >= 4 && (
                        <motion.div 
                          initial={{ opacity: 0 }} 
                          animate={{ opacity: 1 }} 
                          className="flex flex-col gap-3 mt-2"
                        >
                          {candidates.map((c, i) => (
                            <motion.div 
                              key={i} 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i * 0.15 }}
                              className={`bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center justify-between transition-colors ${
                                i === 0 
                                  ? phase >= 6 
                                    ? 'bg-white/20 border-sky/50 shadow-[0_0_20px_rgba(56,189,248,0.3)]' 
                                    : 'bg-white/15 border-sky/30 shadow-[0_0_20px_rgba(56,189,248,0.1)]' 
                                  : ''
                              }`}
                            >
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 bg-white/10 border border-white/20">
                                  <img src={c.img} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-white font-heading font-medium">{c.name}</span>
                                  <span className="text-white/50 text-xs mt-0.5">{c.role}</span>
                                </div>
                              </div>
                              <div className="flex flex-col items-end">
                                <span className="text-white font-bold">{c.score}</span>
                                <span className="text-white/40 text-[10px] uppercase font-bold tracking-wider">Score</span>
                              </div>
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}

                {/* Phase 7 - 14: Expanded Profile Card */}
                {phase >= 7 && phase <= 14 && (
                  <motion.div 
                    key="card-stage"
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -20 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="bg-white border border-white/20 rounded-[32px] p-6 md:p-8 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] flex flex-col w-full"
                  >
                    
                    {/* Header (Always visible in this phase) */}
                    <motion.div layout="position" className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 border border-border/50 bg-bg-alt shadow-sm">
                        <img src={candidates[0].img} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-heading font-semibold text-lg text-navy">{candidates[0].name}</span>
                        <span className="text-sm font-medium text-text-muted mt-0.5 flex items-center gap-1.5">
                          {candidates[0].role} <span className="text-border">•</span> <MapPin className="w-3.5 h-3.5" /> Jakarta
                        </span>
                      </div>
                    </motion.div>

                    {/* Expanding Content Container */}
                    <motion.div layout className="flex flex-col overflow-hidden">
                      
                      {/* Divider */}
                      {phase >= 8 && (
                        <motion.div 
                          initial={{ opacity: 0 }} 
                          animate={{ opacity: 1 }} 
                          className="w-full h-px bg-border/50 mt-6 mb-6" 
                        />
                      )}

                      {/* Trust Score & Verification */}
                      {phase >= 8 && (
                        <motion.div 
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center justify-between"
                        >
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-1">Trust Score</span>
                            <div className="flex items-end gap-1">
                              <span className="text-[2.5rem] font-heading font-bold text-navy leading-none tracking-tight">
                                <AnimatedCounter value={98} active={phase >= 8} />
                              </span>
                              <span className="text-sm font-medium text-text-muted mb-1">/ 100</span>
                            </div>
                          </div>

                          {phase >= 9 && (
                            <motion.div 
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ type: "spring", bounce: 0.5 }}
                              className="flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1.5 rounded-full border border-green-200 shadow-sm"
                            >
                              <ShieldCheck className="w-4 h-4" />
                              <span className="text-[11px] font-bold tracking-wide">Warga Verified</span>
                            </motion.div>
                          )}
                        </motion.div>
                      )}

                      {/* Portfolio */}
                      {phase >= 10 && (
                        <motion.div 
                          layout
                          initial={{ opacity: 0, y: 10, height: 0 }}
                          animate={{ opacity: 1, y: 0, height: "auto" }}
                          className="mt-6"
                        >
                          <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-bg-alt border border-border shadow-inner">
                            <motion.img 
                              src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=600&h=400&auto=format&fit=crop" 
                              className="absolute inset-0 w-full h-full object-cover"
                              initial={{ opacity: 1 }}
                            />
                            <motion.img 
                              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600&h=400&auto=format&fit=crop" 
                              className="absolute inset-0 w-full h-full object-cover"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 1.5, duration: 1 }} 
                            />
                            
                            <motion.div 
                              className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-md"
                              initial={{ opacity: 1 }}
                              animate={{ opacity: 0 }}
                              transition={{ delay: 1.5, duration: 0.5 }}
                            >SEBELUM</motion.div>
                            <motion.div 
                              className="absolute top-3 left-3 bg-sky/90 backdrop-blur-md text-navy text-[10px] font-bold px-2 py-1 rounded-md"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 1.5, duration: 0.5 }}
                            >SESUDAH</motion.div>
                          </div>
                        </motion.div>
                      )}

                      {/* Wage & CTA */}
                      {phase >= 11 && (
                        <motion.div 
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-6 pt-6 border-t border-border/50 flex items-center justify-between"
                        >
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-0.5">Est. Upah</span>
                            <span className="text-xl font-heading font-semibold text-sky tracking-tight">
                              <AnimatedCounter value={250000} active={phase >= 11} prefix="Rp " /> /hr
                            </span>
                          </div>
                          
                          {phase >= 12 && (
                            <motion.button 
                              initial={{ scale: 0.9, opacity: 0 }}
                              animate={{ scale: phase >= 14 ? 0.95 : 1, opacity: 1, backgroundColor: phase >= 14 ? '#0284c7' : '#38bdf8' }}
                              transition={{ duration: 0.2 }}
                              className="text-navy px-6 py-3 rounded-full font-semibold text-sm flex items-center gap-2 shadow-[0_10px_20px_-5px_rgba(56,189,248,0.4)]"
                            >
                              Pilih Pekerja <ArrowRight className="w-4 h-4" />
                            </motion.button>
                          )}
                        </motion.div>
                      )}

                    </motion.div>
                  </motion.div>
                )}

                {/* Phase 15: Success Screen */}
                {phase === 15 && (
                  <motion.div 
                    key="success-stage"
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -20 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="bg-white border border-white/20 rounded-[32px] p-8 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] flex flex-col w-full relative overflow-hidden"
                  >
                    {/* Success Header */}
                    <div className="flex flex-col items-center text-center pb-6 border-b border-border/50">
                      <div className="relative mb-6 mt-2">
                         {/* Pulsing rings */}
                         <motion.div 
                           initial={{ scale: 0.5, opacity: 0 }}
                           animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                           transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                           className="absolute inset-0 bg-green-400 rounded-full"
                         />
                         <motion.div 
                           initial={{ scale: 0 }}
                           animate={{ scale: 1 }}
                           transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
                           className="relative z-10 w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center shadow-inner border border-green-100"
                         >
                           <Check className="w-8 h-8" strokeWidth={3} />
                         </motion.div>
                      </div>
                      <motion.h3 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-2xl font-heading font-bold text-navy mb-2"
                      >
                        Pekerja Berhasil Dipilih!
                      </motion.h3>
                      <motion.p 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="text-text-muted text-sm px-4"
                      >
                        Permintaan Anda telah disetujui secara instan oleh <strong>Wawan Subianto</strong>.
                      </motion.p>
                    </div>
                  
                    {/* Agreement Summary */}
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                      className="pt-6 flex flex-col gap-4"
                    >
                      <div className="flex items-center justify-between bg-bg-alt rounded-2xl p-4 border border-border/50">
                         <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-full overflow-hidden border border-border bg-white">
                             <img src={candidates[0].img} className="w-full h-full object-cover" />
                           </div>
                           <div className="flex flex-col">
                             <span className="font-heading font-semibold text-sm text-navy">{candidates[0].name}</span>
                             <span className="text-xs text-text-muted">{candidates[0].role}</span>
                           </div>
                         </div>
                         <div className="bg-sky/10 text-sky px-3 py-1 rounded-full text-[10px] font-bold border border-sky/20">
                           Disewa
                         </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                         <div className="bg-bg-alt/50 border border-border/50 p-3 rounded-2xl flex flex-col">
                           <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-1">Upah Harian</span>
                           <span className="text-sm font-semibold text-navy">Rp 250.000</span>
                         </div>
                         <div className="bg-bg-alt/50 border border-border/50 p-3 rounded-2xl flex flex-col">
                           <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-1">Jadwal</span>
                           <span className="text-sm font-semibold text-navy">Mulai Besok</span>
                         </div>
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 }}
                      className="mt-6 flex justify-center"
                    >
                      <span className="text-xs text-sky font-medium flex items-center gap-1.5 bg-sky/5 px-4 py-2 rounded-full border border-sky/10 transition-colors">
                        Lihat Detail Kontrak <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </motion.div>
                  
                  </motion.div>
                )}
                
              </AnimatePresence>
            </motion.div>
          </BlurReveal>
          
        </div>
      </div>
    </section>
  );
}
