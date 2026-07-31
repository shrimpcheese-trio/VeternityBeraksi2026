"use client";
import * as React from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";
import { CheckCircle2, ShieldCheck, Clock, FileText, Star, MapPin, Briefcase, Award, Database, Sparkles } from "lucide-react";
import { BlurReveal, StaggerTextContainer, SplitText } from "@/components/ui/motion";

// ==========================================
// TRUST SCORE COMPONENTS
// ==========================================
const FactorCard = ({ icon: Icon, text, delay, phase, index }: { icon: React.ElementType, text: string, delay: number, phase: number, index: number }) => {
  const isProcessing = phase === 2;
  const isDone = phase >= 3;
  const isVisible = phase >= 1;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ 
        opacity: isVisible ? (isDone ? 0.6 : 1) : 0, 
        x: isVisible ? 0 : -20,
        scale: isProcessing ? [1, 1.02, 1] : 1,
        borderColor: isProcessing ? "var(--color-sky)" : "var(--color-border)",
      }}
      transition={{ 
        duration: 0.5, 
        delay: isVisible && !isProcessing ? delay : 0,
        scale: { duration: 0.8, delay: index * 0.15, repeat: isProcessing ? Infinity : 0 }
      }}
      whileHover={{ y: -2, scale: 1.02, borderColor: "var(--color-sky)", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.05)" }}
      className="bg-bg border border-border/60 rounded-2xl p-3 flex items-center gap-3 relative z-10 cursor-default group transition-shadow shadow-sm"
    >
      <div className="bg-bg-alt/50 w-9 h-9 rounded-xl flex items-center justify-center">
        <Icon className="w-4 h-4 text-navy transition-transform duration-300 group-hover:scale-110" />
      </div>
      <span className="text-sm font-semibold text-text-body">{text}</span>
    </motion.div>
  );
};

const AnimatedScoreAndCircle = ({ phase }: { phase: number }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, Math.round);
  const pathLength = useTransform(count, [0, 100], [0, 1]);

  React.useEffect(() => {
    if (phase === 0) count.set(0);
    if (phase === 3) {
      animate(count, 72, { duration: 0.6, ease: "easeOut" });
      setTimeout(() => animate(count, 84, { duration: 0.6, ease: "easeOut" }), 1200);
      setTimeout(() => animate(count, 92, { duration: 0.8, ease: "easeOut" }), 2200);
    }
  }, [phase, count]);

  return (
    <div className="relative w-44 h-44 flex items-center justify-center">
      <svg className="absolute inset-0 w-full h-full -rotate-90 drop-shadow-md" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="42" stroke="var(--color-bg-alt)" strokeWidth="5" fill="none" />
        <motion.circle 
          cx="50" cy="50" r="42" 
          stroke="var(--color-sky)" 
          strokeWidth="6" 
          fill="none" 
          strokeLinecap="round"
          style={{ pathLength }} 
        />
      </svg>
      <div className="flex flex-col items-center">
        <motion.span className="text-[2.75rem] font-heading font-bold text-navy tabular-nums leading-none tracking-tight">
          {rounded}
        </motion.span>
        <span className="text-[10px] uppercase font-bold tracking-widest text-text-muted mt-2">Trust Score</span>
      </div>
    </div>
  );
};

const TrustScoreBlock = () => {
  const [phase, setPhase] = React.useState(0);

  React.useEffect(() => {
    let isMounted = true;
    const runSequence = async () => {
      while(isMounted) {
        setPhase(0); 
        await new Promise(r => setTimeout(r, 600)); 
        setPhase(1); 
        await new Promise(r => setTimeout(r, 1400)); 
        setPhase(2); 
        await new Promise(r => setTimeout(r, 1800)); 
        setPhase(3); 
        await new Promise(r => setTimeout(r, 3400)); 
        setPhase(4); 
        await new Promise(r => setTimeout(r, 3500)); 
      }
    };
    runSequence();
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
      {/* Left Column: Typography */}
      <BlurReveal 
        className="flex flex-col gap-6 order-2 lg:order-1 max-w-[560px]"
      >
        <StaggerTextContainer delayChildren={0.1} className="text-[2.5rem] md:text-[3rem] lg:text-[3.5rem] font-heading font-medium text-bg leading-[1.05] tracking-tight">
          <SplitText text="Sistem Penilaian" /> <br /> 
          <span className="text-sky relative inline-block mt-2">
            <SplitText text="Anti-Manipulasi" />
            <svg className="absolute -bottom-3 left-0 w-full h-3 text-sky/40" viewBox="0 0 100 10" preserveAspectRatio="none">
              <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
            </svg>
          </span>
        </StaggerTextContainer>
        <p className="text-lg md:text-xl text-bg-alt/90 leading-relaxed mb-2 max-w-[520px] font-light">
          Trust Score dibangun dari berbagai faktor yang tervalidasi, bukan berasal dari satu ulasan fiktif. Sistem kami memastikan reputasimu terbangun secara adil dan akurat.
        </p>
      </BlurReveal>

      {/* Right Column: Mockup */}
      <BlurReveal 
        delay={0.2}
        className="order-1 lg:order-2 w-full flex justify-center lg:justify-end"
      >
         <div className="bg-bg-alt/5 border border-white/10 rounded-[32px] p-5 sm:p-8 md:p-12 w-full max-w-[520px] backdrop-blur-md shadow-2xl relative flex items-center justify-center min-h-[460px]">
            {/* Visual Connection Lines */}
            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden rounded-[32px]">
              <AnimatePresence>
                {phase === 2 && (
                  <>
                    <motion.div initial={{ opacity: 0, x: "20%" }} animate={{ opacity: [0, 0.5, 0], x: ["20%", "60%"] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0 }} className="absolute top-[30%] w-24 h-px bg-gradient-to-r from-transparent via-sky to-transparent" />
                    <motion.div initial={{ opacity: 0, x: "20%" }} animate={{ opacity: [0, 0.5, 0], x: ["20%", "60%"] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }} className="absolute top-[50%] w-24 h-px bg-gradient-to-r from-transparent via-sky to-transparent" />
                    <motion.div initial={{ opacity: 0, x: "20%" }} animate={{ opacity: [0, 0.5, 0], x: ["20%", "60%"] }} transition={{ duration: 1.5, repeat: Infinity, delay: 1.0 }} className="absolute top-[70%] w-24 h-px bg-gradient-to-r from-transparent via-sky to-transparent" />
                  </>
                )}
              </AnimatePresence>
            </div>

            <div className="flex flex-col sm:flex-row w-full gap-5 sm:gap-6 md:gap-10 relative z-10">
              <div className="flex flex-col justify-center gap-2.5 sm:gap-3 w-full sm:flex-1">
                <FactorCard icon={FileText} text="Bukti Kerja" delay={0.1} phase={phase} index={0} />
                <FactorCard icon={ShieldCheck} text="Verifikasi" delay={0.2} phase={phase} index={1} />
                <FactorCard icon={Clock} text="On-Time" delay={0.3} phase={phase} index={2} />
                <FactorCard icon={CheckCircle2} text="Selesai" delay={0.4} phase={phase} index={3} />
                <FactorCard icon={Star} text="Ulasan" delay={0.5} phase={phase} index={4} />
              </div>
              <div className="w-full sm:flex-1 flex flex-col items-center justify-center mt-2 sm:mt-0">
                <motion.div 
                  className="bg-bg rounded-[28px] p-4 sm:p-6 shadow-xl border border-border w-full max-w-[200px] sm:max-w-none aspect-square flex flex-col items-center justify-center relative transition-shadow mx-auto"
                  animate={{ 
                    scale: phase >= 2 ? 1.05 : 1, 
                    borderColor: phase >= 2 ? "var(--color-sky)" : "var(--color-border)",
                    boxShadow: phase >= 3 ? "0 20px 40px -10px rgba(56, 189, 248, 0.15)" : "0 10px 15px -3px rgba(0,0,0,0.05)"
                  }}
                  transition={{ duration: 0.6 }}
                >
                  <AnimatedScoreAndCircle phase={phase} />
                  <AnimatePresence>
                    {phase >= 4 && (
                       <motion.div 
                         initial={{ scale: 0, y: 15, opacity: 0 }} 
                         animate={{ scale: 1, y: 0, opacity: 1 }} 
                         exit={{ scale: 0, opacity: 0 }}
                         transition={{ type: "spring", stiffness: 300, damping: 20 }}
                         className="absolute -bottom-4 bg-navy text-bg text-[10px] sm:text-[11px] font-semibold px-3 sm:px-4 py-1.5 sm:py-2 rounded-full flex items-center gap-1.5 shadow-lg whitespace-nowrap"
                       >
                          <ShieldCheck className="w-3.5 h-3.5 text-sky" /> Terverifikasi
                       </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>
            </div>
         </div>
      </BlurReveal>
    </div>
  );
};


// ==========================================
// WAGE ESTIMATOR COMPONENTS
// ==========================================
const InputCard = ({ icon: Icon, text, label, delay, phase, index }: { icon: any, text: string, label: string, delay: number, phase: number, index: number }) => {
  const isVisible = phase >= 1;
  const isProcessing = phase === 2;
  const isDone = phase >= 3;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ 
        opacity: isVisible ? (isDone ? 0.6 : 1) : 0, 
        y: isVisible ? 0 : 15,
        scale: isProcessing ? [1, 1.02, 1] : 1,
        borderColor: isProcessing ? "var(--color-sky)" : "var(--color-border)",
      }}
      transition={{ 
        duration: 0.5, 
        delay: isVisible && !isProcessing ? delay : 0,
        scale: { duration: 0.8, delay: index * 0.15, repeat: isProcessing ? Infinity : 0 }
      }}
      whileHover={{ y: -2, scale: 1.02, borderColor: "var(--color-sky)", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.05)" }}
      className="bg-bg border border-border/60 rounded-2xl p-3 flex items-center gap-3.5 relative z-10 cursor-default group transition-shadow shadow-sm w-full"
    >
      <div className="bg-bg-alt/50 w-10 h-10 rounded-xl flex items-center justify-center shrink-0">
        <Icon className="w-4.5 h-4.5 text-navy transition-transform duration-300 group-hover:scale-110" />
      </div>
      <div className="flex flex-col">
         <span className="text-[9px] text-text-muted font-bold uppercase tracking-widest">{label}</span>
         <span className="text-sm font-semibold text-text-body truncate mt-0.5">{text}</span>
      </div>
    </motion.div>
  );
};

const AnimatedResult = ({ phase }: { phase: number }) => {
  const countMin = useMotionValue(0);
  const countMax = useMotionValue(0);
  
  const formattedMin = useTransform(countMin, (val) => `Rp ${Math.round(val)}k`);
  const formattedMax = useTransform(countMax, (val) => `Rp ${Math.round(val)}k`);

  React.useEffect(() => {
    if (phase === 0) { countMin.set(0); countMax.set(0); }
    if (phase === 3) {
      animate(countMin, 180, { duration: 1.2, ease: "easeOut" });
      setTimeout(() => animate(countMax, 250, { duration: 1.2, ease: "easeOut" }), 800);
    }
  }, [phase, countMin, countMax]);

  return (
    <div className="flex items-center justify-center gap-2">
      <motion.span className="text-2xl lg:text-3xl font-heading font-bold text-navy tabular-nums leading-none">
        {formattedMin}
      </motion.span>
      <span className="text-sky font-medium text-xl leading-none">–</span>
      <motion.span className="text-2xl lg:text-3xl font-heading font-bold text-navy tabular-nums leading-none">
        {formattedMax}
      </motion.span>
    </div>
  );
};

const ScanningAnimation = () => (
  <motion.div 
    initial={{ height: 0, opacity: 0 }}
    animate={{ height: 40, opacity: 1 }}
    exit={{ height: 0, opacity: 0 }}
    className="w-px bg-gradient-to-b from-sky/0 via-sky to-sky/0 relative mx-auto my-1"
  >
    <motion.div 
      className="absolute left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-sky shadow-[0_0_12px_4px_rgba(56,189,248,0.4)]"
      animate={{ y: [0, 40, 0] }}
      transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
    />
  </motion.div>
);

const WageEstimatorBlock = () => {
  const [phase, setPhase] = React.useState(0);

  React.useEffect(() => {
    let isMounted = true;
    const runSequence = async () => {
      while(isMounted) {
        setPhase(0); 
        await new Promise(r => setTimeout(r, 600)); 
        setPhase(1); 
        await new Promise(r => setTimeout(r, 1400)); 
        setPhase(2); 
        await new Promise(r => setTimeout(r, 1800)); 
        setPhase(3); 
        await new Promise(r => setTimeout(r, 3400)); 
        setPhase(4); 
        await new Promise(r => setTimeout(r, 3500)); 
      }
    };
    runSequence();
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
      {/* Left Column: Mockup */}
      <BlurReveal 
        className="order-2 lg:order-1 w-full flex justify-center lg:justify-start"
      >
         <div className="bg-bg-alt/5 border border-white/10 rounded-[32px] p-8 md:p-12 w-full max-w-[520px] backdrop-blur-md shadow-2xl relative flex flex-col items-center justify-center min-h-[460px]">
            <div className="flex flex-col w-full max-w-[340px] relative z-10">
              <div className="flex flex-col gap-3">
                <InputCard icon={Briefcase} label="Kategori Pekerjaan" text="Teknisi AC" delay={0.1} phase={phase} index={0} />
                <InputCard icon={MapPin} label="Area Layanan" text="Jakarta Selatan" delay={0.2} phase={phase} index={1} />
                <InputCard icon={Award} label="Tingkat Pengalaman" text="3-5 Tahun" delay={0.3} phase={phase} index={2} />
              </div>
              <div className="flex justify-center h-10 w-full">
                 <AnimatePresence>
                   {phase === 2 && (
                     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center justify-center w-full relative">
                        <ScanningAnimation />
                        <div className="absolute left-1/2 ml-4 flex items-center gap-1.5 text-sky opacity-80">
                           <Database className="w-3 h-3 animate-pulse" />
                           <span className="text-[10px] uppercase font-bold tracking-widest">Querying...</span>
                        </div>
                     </motion.div>
                   )}
                 </AnimatePresence>
              </div>
              <motion.div 
                className="bg-bg border border-border/60 rounded-[24px] p-6 flex flex-col items-center justify-center shadow-lg relative overflow-hidden mt-1 transition-shadow"
                animate={{ 
                  scale: phase >= 3 ? 1.05 : 1,
                  borderColor: phase >= 3 ? "var(--color-sky)" : "var(--color-border)",
                  boxShadow: phase >= 4 ? "0 20px 40px -10px rgba(56, 189, 248, 0.15)" : "0 10px 15px -3px rgba(0,0,0,0.05)"
                }}
                transition={{ duration: 0.6 }}
              >
                 <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-3 flex items-center gap-1.5">
                   <Sparkles className="w-3 h-3 text-sky" /> Estimasi Upah Wajar
                 </span>
                 <AnimatedResult phase={phase} />
                 <span className="text-xs font-medium text-text-muted mt-3">per kunjungan rata-rata</span>
                 <AnimatePresence>
                   {phase >= 4 && (
                     <motion.div 
                       initial={{ opacity: 0, scale: 0.8 }}
                       animate={{ opacity: 1, scale: 1 }}
                       exit={{ opacity: 0, scale: 0.8 }}
                       className="absolute top-2 right-2 bg-sky/10 text-sky text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1"
                     >
                       <CheckCircle2 className="w-3 h-3" /> Data Akurat
                     </motion.div>
                   )}
                 </AnimatePresence>
              </motion.div>
            </div>
         </div>
      </BlurReveal>

      {/* Right Column: Typography */}
      <BlurReveal 
        delay={0.2}
        className="flex flex-col gap-6 order-1 lg:order-2 max-w-[560px] lg:pl-4"
      >
        <StaggerTextContainer delayChildren={0.1} className="text-[2.5rem] md:text-[3rem] lg:text-[3.5rem] font-heading font-medium text-bg leading-[1.05] tracking-tight">
          <SplitText text="Fair Wage" /> <br /> 
          <span className="text-sky relative inline-block mt-2">
            <SplitText text="Estimator" />
            <svg className="absolute -bottom-3 left-0 w-full h-3 text-sky/40" viewBox="0 0 100 10" preserveAspectRatio="none">
              <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
            </svg>
          </span>
        </StaggerTextContainer>
        <p className="text-lg md:text-xl text-bg-alt/90 leading-relaxed mb-2 max-w-[520px] font-light">
          Ketahui standar harga layananmu di pasaran. Analitik data nyata membantu kamu menentukan tarif yang adil tanpa takut kemurahan.
        </p>
      </BlurReveal>
    </div>
  );
};


// ==========================================
// MAIN COMBINED SECTION
// ==========================================
export function CoreFeaturesSection() {
  return (
    <section id="fitur-utama" className="bg-navy py-24 md:py-32 lg:py-40 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[5%] left-[-10%] w-[50%] h-[50%] bg-sky/10 rounded-full blur-[150px]" />
        <div className="absolute top-[40%] right-[-10%] w-[60%] h-[60%] bg-coral/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] bg-sky/5 rounded-full blur-[150px]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1200px] relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 lg:mb-32 flex flex-col items-center">
           <BlurReveal>
             <span className="text-sky font-bold tracking-widest uppercase text-xs mb-4 inline-block bg-sky/10 px-4 py-2 rounded-full">
               Mesin Penggerak Keadilan
             </span>
           </BlurReveal>
           <StaggerTextContainer className="text-[2rem] md:text-[3rem] font-heading font-semibold text-bg leading-[1.2] tracking-tight">
              <SplitText text="Dirancang untuk membangun" /> <br className="hidden md:block" /> 
              <span className="text-bg-alt font-light"><SplitText text="reputasi dan pendapatanmu." /></span>
           </StaggerTextContainer>
        </div>

        {/* Feature 1 */}
        <TrustScoreBlock />

        {/* Separator / Connector space */}
        <div className="h-32 md:h-40 lg:h-48 w-full flex items-center justify-center">
          <div className="w-px h-full bg-gradient-to-b from-border/0 via-border/20 to-border/0" />
        </div>

        {/* Feature 2 */}
        <WageEstimatorBlock />
        
      </div>
    </section>
  );
}
