"use client";
import * as React from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";
import { CheckCircle2, ShieldCheck, Activity, Clock, FileText, Star } from "lucide-react";
import { StaggerTextContainer, SplitText } from "@/components/ui/motion";

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

export function TrustScoreSection() {
  const [phase, setPhase] = React.useState(0);

  React.useEffect(() => {
    let isMounted = true;
    const runSequence = async () => {
      while(isMounted) {
        setPhase(0); // Reset
        await new Promise(r => setTimeout(r, 600)); 
        setPhase(1); // Cards Enter
        await new Promise(r => setTimeout(r, 1400)); 
        setPhase(2); // Processing
        await new Promise(r => setTimeout(r, 1800)); 
        setPhase(3); // Score Counting
        await new Promise(r => setTimeout(r, 3400)); 
        setPhase(4); // Verified Badge
        await new Promise(r => setTimeout(r, 3500)); // Hold
      }
    };
    runSequence();
    return () => { isMounted = false; };
  }, []);

  return (
    <motion.section 
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="bg-navy py-24 md:py-32 lg:py-40 relative overflow-hidden"
    >
      {/* Subtle Premium Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-sky/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-coral/5 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1200px] relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Left Column: Typography & Text */}
          <div className="flex flex-col gap-6 order-2 lg:order-1 max-w-[560px]">
            <StaggerTextContainer className="text-[2.75rem] md:text-[3.5rem] lg:text-[4rem] font-heading font-medium text-bg leading-[1.05] tracking-tight">
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
          </div>

          {/* Right Column: Interactive Meaningful Mockup */}
          <div className="order-1 lg:order-2 w-full flex justify-center lg:justify-end">
             <div className="bg-bg-alt/5 border border-white/10 rounded-[32px] p-8 md:p-12 w-full max-w-[520px] backdrop-blur-md shadow-2xl relative flex items-center justify-center min-h-[460px]">
                
                {/* Visual Connection Lines (Phase 2) */}
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

                <div className="flex w-full gap-6 md:gap-10 relative z-10">
                  
                  {/* Factors (Left side of Mockup) */}
                  <div className="flex flex-col justify-center gap-3 flex-1">
                    <FactorCard icon={FileText} text="Bukti Kerja" delay={0.1} phase={phase} index={0} />
                    <FactorCard icon={ShieldCheck} text="Verifikasi" delay={0.2} phase={phase} index={1} />
                    <FactorCard icon={Clock} text="On-Time" delay={0.3} phase={phase} index={2} />
                    <FactorCard icon={CheckCircle2} text="Selesai" delay={0.4} phase={phase} index={3} />
                    <FactorCard icon={Star} text="Ulasan" delay={0.5} phase={phase} index={4} />
                  </div>

                  {/* Main Score (Right side of Mockup) */}
                  <div className="flex-1 flex flex-col items-center justify-center">
                    <motion.div 
                      className="bg-bg rounded-[28px] p-6 shadow-xl border border-border w-full aspect-square flex flex-col items-center justify-center relative transition-shadow"
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
                             className="absolute -bottom-4 bg-navy text-bg text-[11px] font-semibold px-4 py-2 rounded-full flex items-center gap-1.5 shadow-lg whitespace-nowrap"
                           >
                              <ShieldCheck className="w-3.5 h-3.5 text-sky" /> Terverifikasi
                           </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </div>

                </div>
             </div>
          </div>
          
        </div>
      </div>
    </motion.section>
  );
}
