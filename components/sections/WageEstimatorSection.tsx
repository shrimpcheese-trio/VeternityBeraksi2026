"use client";
import * as React from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";
import { CheckCircle2, MapPin, Briefcase, Award, Database, Sparkles } from "lucide-react";

const InputCard = ({ icon: Icon, text, label, delay, phase, index }: { icon: React.ElementType, text: string, label: string, delay: number, phase: number, index: number }) => {
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
    if (phase === 0) {
      countMin.set(0);
      countMax.set(0);
    }
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

const ScanningAnimation = () => {
  return (
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
};

export function WageEstimatorSection() {
  const [phase, setPhase] = React.useState(0);

  React.useEffect(() => {
    let isMounted = true;
    const runSequence = async () => {
      while (isMounted) {
        setPhase(0); // Reset
        await new Promise(r => setTimeout(r, 600));
        setPhase(1); // Inputs Enter
        await new Promise(r => setTimeout(r, 1400));
        setPhase(2); // Scanning DB
        await new Promise(r => setTimeout(r, 1800));
        setPhase(3); // Computing Result
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
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-sky/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-coral/5 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1200px] relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* Left Column: Interactive Storytelling Mockup */}
          <div className="order-2 lg:order-1 w-full flex justify-center lg:justify-start">
            <div className="bg-bg-alt/5 border border-white/10 rounded-[32px] p-8 md:p-12 w-full max-w-[520px] backdrop-blur-md shadow-2xl relative flex flex-col items-center justify-center min-h-[460px]">

              <div className="flex flex-col w-full max-w-[340px] relative z-10">

                {/* Phase 1: Inputs */}
                <div className="flex flex-col gap-3">
                  <InputCard icon={Briefcase} label="Kategori Pekerjaan" text="Teknisi AC" delay={0.1} phase={phase} index={0} />
                  <InputCard icon={MapPin} label="Area Layanan" text="Jakarta Selatan" delay={0.2} phase={phase} index={1} />
                  <InputCard icon={Award} label="Tingkat Pengalaman" text="3-5 Tahun" delay={0.3} phase={phase} index={2} />
                </div>

                {/* Phase 2: Connecting / Scanning Animation */}
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

                {/* Phase 3 & 4: Result */}
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
          </div>

          {/* Right Column: Typography & Text */}
          <div className="flex flex-col gap-6 order-1 lg:order-2 max-w-[560px] lg:pl-4">
            <h2 className="text-[2.75rem] md:text-[3.5rem] lg:text-[4rem] font-heading font-medium text-bg leading-[1.05] tracking-tight">
              Fair Wage <br />
              <span className="text-sky relative inline-block mt-2">
                Estimator
                <svg className="absolute -bottom-3 left-0 w-full h-3 text-sky/40" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
                </svg>
              </span>
            </h2>
            <p className="text-lg md:text-xl text-bg-alt/90 leading-relaxed mb-2 max-w-[520px] font-light">
              Ketahui standar harga layananmu di pasaran. Analitik data nyata membantu kamu menentukan tarif yang adil tanpa takut kemurahan.
            </p>
          </div>

        </div>
      </div>
    </motion.section>
  );
}
