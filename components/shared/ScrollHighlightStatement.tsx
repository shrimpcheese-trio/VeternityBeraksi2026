"use client";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function ScrollHighlightStatement() {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const phrases = [
        { id: "w1", color: "#3B82F6" }, // sky
        { id: "w2", color: "#F43F5E" }, // coral
        { id: "w3", color: "#10B981" }, // emerald
      ];
      const baseColor = "#0F2A4A"; // text-navy

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Initial State
        gsap.set(".scroll-obj", { opacity: 0, scale: 0.9, y: 40, filter: "blur(12px)" });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "+=350%", // Longer distance
            scrub: 1.5, // THE MAGIC SAUCE: 1.5s lag for silky smooth "Ordina" feel
            pin: true,
          },
        });

        // Phase 1 (Bukti Kerja)
        tl.to("#w1", { color: phrases[0].color, duration: 1.5, ease: "power3.out" });
        tl.to(".phrase1-obj", { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 1.5, ease: "expo.out", stagger: 0.1 }, "<");

        tl.to({}, { duration: 1.5 }); // Hold Phase 1

        // Phase 2 (Verifikasi Komunitas)
        tl.to(".phrase1-obj", { opacity: 0, y: -20, scale: 0.95, filter: "blur(12px)", duration: 1, ease: "power3.inOut", stagger: 0.05 });
        tl.to("#w1", { color: baseColor, duration: 1 }, "<"); // REVERT W1

        tl.to("#w2", { color: phrases[1].color, duration: 1.5, ease: "power3.out" }, "<0.2");
        tl.to(".phrase2-obj", { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 1.5, ease: "expo.out", stagger: 0.1 }, "<");

        tl.to({}, { duration: 1.5 }); // Hold Phase 2

        // Phase 3 (Upah yang adil)
        tl.to(".phrase2-obj", { opacity: 0, y: -20, scale: 0.95, filter: "blur(12px)", duration: 1, ease: "power3.inOut", stagger: 0.05 });
        tl.to("#w2", { color: baseColor, duration: 1 }, "<"); // REVERT W2

        tl.to("#w3", { color: phrases[2].color, duration: 1.5, ease: "power3.out" }, "<0.2");
        tl.to(".phrase3-obj", { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 1.5, ease: "expo.out", stagger: 0.1 }, "<");

        tl.to({}, { duration: 2 }); // Hold Phase 3 (extra hold at the end)
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(`#w3`, { color: phrases[2].color });
        gsap.set(".scroll-obj", { display: "none" });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen flex items-center justify-center bg-white relative overflow-hidden">

      {/* Background Soft Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-50 via-white to-white pointer-events-none" />

      {/* Massive Typographical Statement */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1200px] relative z-10 flex justify-center">
        <p className="text-3xl md:text-4xl lg:text-[44px] font-heading font-semibold max-w-[700px] text-center text-navy leading-[1.3] transition-colors duration-300">
          Upahku menyatukan <span id="w1">bukti kerja</span>,{" "}
          <span id="w2">verifikasi komunitas</span>, dan{" "}
          <span id="w3">upah yang adil</span> menjadi satu reputasi yang bisa dipercaya.
        </p>
      </div>

      {/* Floating Objects Container */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">

        {/* ================= PHRASE 1 (Bukti Kerja) ================= */}
        <div className="scroll-obj phrase1-obj absolute top-[10%] left-[5%] md:left-[10%] lg:left-[15%] bg-white/90 backdrop-blur-2xl border border-slate-100 shadow-2xl rounded-2xl p-2 md:p-3 flex gap-2 rotate-[-6deg]">
          <img src="https://images.unsplash.com/photo-1581092921461-eab62e97a780?q=80&w=200&h=200&auto=format&fit=crop" className="w-16 h-16 md:w-24 md:h-24 lg:w-32 lg:h-32 rounded-xl object-cover" alt="Before" />
          <img src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=200&h=200&auto=format&fit=crop" className="w-16 h-16 md:w-24 md:h-24 lg:w-32 lg:h-32 rounded-xl object-cover" alt="After" />
        </div>

        <div className="scroll-obj phrase1-obj absolute bottom-[15%] right-[5%] md:right-[15%] lg:right-[20%] bg-white/90 backdrop-blur-2xl border border-slate-100 shadow-2xl rounded-2xl p-2 rotate-[4deg] flex flex-col items-center">
          <div className="relative">
            <img src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=300&h=300&auto=format&fit=crop" className="w-24 h-24 md:w-36 md:h-36 lg:w-48 lg:h-48 rounded-xl object-cover" alt="Worker" />
            <div className="absolute -bottom-4 -right-4 bg-navy text-white text-[10px] md:text-sm font-semibold px-3 py-1.5 md:px-5 md:py-2.5 rounded-full shadow-xl border-4 border-white whitespace-nowrap">
              📸 120 Foto Hasil
            </div>
          </div>
        </div>

        <div className="scroll-obj phrase1-obj absolute top-[30%] right-[8%] md:right-[12%] bg-sky text-white shadow-xl rounded-full px-4 py-2 flex items-center gap-2 rotate-[8deg]">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
          <span className="text-xs md:text-sm font-bold">100% Selesai</span>
        </div>

        <div className="scroll-obj phrase1-obj hidden md:flex absolute bottom-[35%] left-[8%] bg-white/90 backdrop-blur-xl border border-slate-200 shadow-xl rounded-xl p-3 items-center gap-3 rotate-[-4deg]">
          <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-lg">📍</div>
          <div className="flex flex-col">
            <span className="text-xs text-slate-400">Lokasi Proyek</span>
            <span className="text-sm font-bold text-navy">Kebayoran Baru</span>
          </div>
        </div>


        {/* ================= PHRASE 2 (Verifikasi Komunitas) ================= */}
        <div className="scroll-obj phrase2-obj absolute top-[15%] right-[5%] md:right-[12%] lg:right-[18%] bg-white/95 backdrop-blur-2xl border border-slate-100 shadow-2xl rounded-3xl p-4 md:p-5 flex flex-col gap-4 rotate-[3deg] w-48 md:w-64">
          <div className="flex items-center gap-3">
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&h=100&auto=format&fit=crop" className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover ring-4 ring-slate-50" alt="Avatar" />
            <div className="flex flex-col">
              <span className="text-xs md:text-sm font-bold text-navy leading-none">Pak RT Budi</span>
              <span className="text-[10px] md:text-xs text-slate-400 mt-1">Ketua Lingkungan</span>
            </div>
            <div className="ml-auto w-5 h-5 md:w-6 md:h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-[10px] md:text-xs">✓</div>
          </div>
          <div className="flex items-center gap-3">
            <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=100&h=100&auto=format&fit=crop" className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover ring-4 ring-slate-50" alt="Avatar" />
            <div className="flex flex-col">
              <span className="text-xs md:text-sm font-bold text-navy leading-none">Bu Siti</span>
              <span className="text-[10px] md:text-xs text-slate-400 mt-1">Pemilik Warung</span>
            </div>
            <div className="ml-auto w-5 h-5 md:w-6 md:h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-[10px] md:text-xs">✓</div>
          </div>
        </div>

        <div className="scroll-obj phrase2-obj absolute bottom-[15%] left-[5%] md:left-[10%] lg:left-[15%] bg-navy border-4 border-white shadow-2xl rounded-full px-5 py-3 md:px-7 md:py-4 flex items-center gap-3 rotate-[-5deg]">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/20 flex items-center justify-center text-white shrink-0">
            <span className="text-lg">🤝</span>
          </div>
          <span className="text-sm md:text-lg font-heading font-bold text-white">Terverifikasi Mandor</span>
        </div>

        <div className="scroll-obj phrase2-obj hidden md:flex absolute top-[40%] left-[8%] bg-white shadow-xl rounded-full px-4 py-2 items-center gap-2 rotate-[-8deg] border border-slate-100">
          <div className="flex -space-x-2">
            <div className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white"></div>
            <div className="w-6 h-6 rounded-full bg-slate-300 border-2 border-white"></div>
            <div className="w-6 h-6 rounded-full bg-slate-400 border-2 border-white"></div>
          </div>
          <span className="text-xs font-bold text-navy ml-1">Dipercaya 50+ Warga</span>
        </div>

        <div className="scroll-obj phrase2-obj hidden lg:flex absolute bottom-[30%] right-[10%] bg-white/90 backdrop-blur-xl border border-slate-100 shadow-xl rounded-2xl p-4 rotate-[6deg]">
          <div className="flex gap-1 text-amber-400 text-xl">
            <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
          </div>
        </div>


        {/* ================= PHRASE 3 OBJECTS ================= */}
        {/* Card 9: Dark Stats (Bottom Left) */}
        <div className="scroll-obj phrase3-obj absolute bottom-4 md:bottom-12 lg:bottom-16 left-2 md:left-8 lg:left-12 bg-gradient-to-br from-navy to-navy-active border border-white/10 shadow-2xl shadow-navy/20 rounded-2xl md:rounded-[24px] p-3 md:p-7 flex flex-col gap-1.5 md:gap-2 rotate-[-3deg] opacity-0 w-36 sm:w-44 md:w-64 lg:w-72 scale-[0.85] sm:scale-100 origin-bottom-left">
            <span className="text-3xl md:text-display-md lg:text-display-lg font-heading text-white tabular-nums leading-none tracking-tight">Rp 250k</span>
            <span className="text-[9px] md:text-xs text-white/70 leading-relaxed font-medium mt-0.5 md:mt-1">Estimasi upah wajar sesuai standar kota Anda</span>
            <div className="mt-1 md:mt-4 inline-flex w-fit items-center gap-1 sm:gap-1.5 bg-coral/20 border border-coral/30 text-coral text-[8px] md:text-xs font-semibold px-2 py-1 md:px-2.5 md:py-1.5 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-2 h-2 md:w-3 md:h-3"><path d="m18 15-6-6-6 6"/></svg>
              12% dari rata-rata
            </div>
        </div>

        <div className="scroll-obj phrase3-obj absolute top-[15%] right-[5%] md:right-[15%] lg:right-[20%] bg-white/95 backdrop-blur-xl border border-slate-200 shadow-2xl rounded-2xl p-4 flex items-center gap-4 rotate-[5deg]">
          <div className="w-12 h-12 rounded-full bg-sky/10 flex items-center justify-center text-sky text-2xl">
            ⚖️
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-navy">Skema Transparan</span>
            <span className="text-xs text-slate-500">Tanpa potongan tersembunyi</span>
          </div>
        </div>

        <div className="scroll-obj phrase3-obj hidden md:flex absolute top-[45%] left-[10%] bg-white shadow-xl rounded-full px-5 py-2.5 items-center gap-2 rotate-[-8deg] border border-slate-100">
          <span className="text-sm font-bold text-navy">Sesuai Standar Regional 🇮🇩</span>
        </div>

        <div className="scroll-obj phrase3-obj hidden lg:flex absolute bottom-[35%] right-[12%] bg-white shadow-xl rounded-xl p-3 items-center gap-3 rotate-[10deg] border border-slate-100">
          <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-xl">💳</div>
          <span className="text-sm font-bold text-slate-600">Pembayaran Aman</span>
        </div>

      </div>
    </div>
  );
}
