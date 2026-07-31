"use client";

import * as React from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight, ShieldCheck, Users, CheckCircle2, BadgeDollarSign } from "lucide-react";
import { StaggerContainer, StaggerItem, StaggerTextContainer, SplitText } from "@/components/ui/motion";

export function CtaSection() {
  const cards = [
    { icon: <ShieldCheck className="w-5 h-5 text-sky" />, text: "Trust Score Server-Side" },
    { icon: <Users className="w-5 h-5 text-teal-500" />, text: "Community Verified" },
    { icon: <CheckCircle2 className="w-5 h-5 text-blue-500" />, text: "Bukti Kerja Tervalidasi" },
    { icon: <BadgeDollarSign className="w-5 h-5 text-emerald-500" />, text: "Estimasi Upah Regional" },
  ];

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / 20; 
    const y = (e.clientY - top - height / 2) / 20;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Ultra-smooth spring configuration
  const springConfig = { stiffness: 50, damping: 20, mass: 1 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  return (
    <section className="relative bg-bg py-24 md:py-32 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1200px] relative z-10">
        
        <StaggerContainer 
          delayChildren={0.1}
          staggerChildren={0.1}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative bg-white border border-border/60 rounded-[32px] md:rounded-[48px] shadow-[0_8px_40px_-12px_rgba(0,0,0,0.05)] overflow-hidden"
        >
          {/* Background Layer: Soft Radial Gradients */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-[80%] h-[80%] bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-sky/10 via-transparent to-transparent opacity-70" />
            <div className="absolute bottom-0 left-0 w-[60%] h-[60%] bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-teal-500/5 via-transparent to-transparent opacity-70" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center p-8 sm:p-12 md:p-20 relative z-10">
            
            {/* Kiri: Teks */}
            <div className="flex flex-col gap-8 lg:pr-8">
              <StaggerItem>
                <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-navy/[0.03] border border-navy/5 text-[11px] font-bold uppercase tracking-[0.2em] text-navy">
                  Mulai Sekarang
                </div>
              </StaggerItem>
              
              <StaggerItem className="flex flex-col gap-4">
                <StaggerTextContainer delayChildren={0.1} className="text-[2.5rem] sm:text-[3rem] md:text-[3.5rem] lg:text-[4rem] font-heading font-semibold text-navy leading-[1.05] tracking-tight">
                  <SplitText text="Bangun reputasi." /><br/>
                  <span className="text-sky"><SplitText text="Dapatkan peluang." /></span>
                </StaggerTextContainer>
                <p className="text-lg text-text-muted leading-relaxed font-light max-w-[420px]">
                  Bergabunglah dengan ribuan pekerja informal yang telah mengubah hasil kerja keras mereka menjadi karir yang terpercaya.
                </p>
              </StaggerItem>
              
              <StaggerItem>
                <button className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-navy text-white rounded-full font-medium text-base transition-all duration-300 hover:shadow-[0_12px_24px_-6px_rgba(10,37,64,0.3)] hover:-translate-y-0.5">
                  Coba Upahku Gratis
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </StaggerItem>
            </div>

            {/* Kanan: Structured Floating Cards with true parallax */}
            <div className="relative h-full flex flex-col justify-center items-center lg:items-end w-full lg:pr-8 pt-8 lg:pt-0">
              
              <div className="relative w-full max-w-[360px] flex flex-col gap-4 perspective-[1000px]">
                {cards.map((card, idx) => {
                  // Creates a depth effect where each subsequent card moves slightly more
                  const depthMultiplier = 1 + (idx * 0.2);
                  
                  return (
                    <StaggerItem
                      key={idx}
                      className="relative z-10"
                      style={{ 
                        marginLeft: `${idx * 24}px`, // Staggered staircase effect
                      }}
                    >
                      <motion.div
                        style={{ 
                          x: useTransform(springX, v => v * depthMultiplier), 
                          y: useTransform(springY, v => v * depthMultiplier)
                        }}
                      >
                        <motion.div
                          whileHover={{ scale: 1.02, x: 5, transition: { duration: 0.2 } }}
                          className="flex items-center gap-4 px-6 py-4 bg-white/90 backdrop-blur-xl border border-border/50 shadow-[0_15px_35px_-10px_rgba(0,0,0,0.05)] rounded-[20px] cursor-default"
                        >
                          <div className="w-10 h-10 rounded-full bg-bg flex items-center justify-center shrink-0 border border-border/40">
                            {card.icon}
                          </div>
                          <span className="font-semibold text-navy text-[15px]">{card.text}</span>
                        </motion.div>
                      </motion.div>
                    </StaggerItem>
                  );
                })}
              </div>
            </div>

          </div>
        </StaggerContainer>
      </div>
    </section>
  );
}
