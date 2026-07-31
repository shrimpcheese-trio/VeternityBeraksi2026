"use client";

import * as React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, ArrowRight } from "lucide-react";
import { BlurReveal, StaggerContainer, StaggerItem, StaggerTextContainer, SplitText } from "@/components/ui/motion";

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "Apa itu Upahku?",
      answer: "Platform yang membantu pekerja informal Indonesia mengubah pekerjaan yang sudah selesai menjadi reputasi yang bisa diverifikasi, supaya upahnya lebih adil dan pekerjaannya lebih besar."
    },
    {
      question: "Bagaimana bukti kerja diverifikasi agar tidak bisa dipalsukan?",
      answer: "Setiap bukti kerja butuh foto sebelum/sesudah, tanggal, jenis pekerjaan, dan konfirmasi langsung dari pelanggan. Sistem juga menandai pola mencurigakan seperti foto yang dipakai berulang."
    },
    {
      question: "Siapa yang bisa memberi Community Verification?",
      answer: "Mandor, ketua RT, ketua banjar, pemilik toko, atau pihak lain yang mengenal langsung riwayat kerja seseorang di lingkungannya."
    },
    {
      question: "Kenapa estimasi upah saya tidak muncul?",
      answer: "Estimasi upah hanya ditampilkan kalau tersedia cukup data untuk kombinasi kota, jenis pekerjaan, dan pengalamanmu. Kami tidak menampilkan angka perkiraan tanpa data nyata."
    },
    {
      question: "Apakah Trust Score bisa didongkrak dengan satu ulasan bagus?",
      answer: "Tidak. Trust Score dirancang supaya tidak ada satu sumber — satu ulasan, satu verifikator, atau satu pelanggan — yang bisa mendominasi angkanya sendirian."
    },
    {
      question: "Bagaimana cara mendaftar sebagai pekerja?",
      answer: "Buat akun, lengkapi profil dasar (nama, kota, jenis pekerjaan), lalu mulai catat pekerjaan pertamamu sebagai bukti kerja."
    }
  ];

  // Stagger animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } }
  };

  return (
    <section id="faq" className="relative bg-bg py-24 md:py-32 lg:py-40 overflow-hidden">
      {/* Background with subtle blur and gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[20%] left-[-10%] w-[50%] h-[50%] bg-sky/5 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-sky-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1200px] relative z-10">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">

          {/* Kolom Kiri: Header & Deskripsi */}
          <BlurReveal
            className="lg:col-span-5 flex flex-col gap-6"
          >
            <div className="inline-flex self-start items-center px-3.5 py-1.5 rounded-full bg-navy/5 border border-navy/10 text-[10px] font-bold uppercase tracking-widest text-navy">
              Pertanyaan Umum
            </div>

            <StaggerTextContainer delayChildren={0.1} className="text-[2.5rem] md:text-[3.25rem] font-heading font-semibold text-navy leading-[1.15] tracking-tight">
              <SplitText text="Masih punya" /> <span className="text-sky"><SplitText text="pertanyaan?" /></span>
            </StaggerTextContainer>

            <p className="text-lg text-text-muted leading-relaxed font-light mt-2 max-w-[400px]">
              Kami sudah menyiapkan jawaban untuk hal-hal yang paling sering ditanyakan oleh pengguna kami.
            </p>

            <div className="mt-8 flex flex-col gap-3">
              <span className="text-sm font-medium text-navy">Masih belum menemukan jawaban?</span>
              <a href="#" className="inline-flex items-center gap-2 text-sky font-semibold hover:text-navy transition-colors w-fit group">
                Hubungi tim Upahku <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </BlurReveal>

          {/* Kolom Kanan: FAQ Cards */}
          <StaggerContainer
            delayChildren={0.2}
            staggerChildren={0.1}
            className="lg:col-span-7 flex flex-col gap-4"
          >
            {faqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <StaggerItem
                  key={idx}
                  className={`group relative rounded-[24px] transition-all duration-300 ${isOpen
                    ? 'bg-[#FCFDFF] border border-border/80 shadow-[0_15px_30px_-10px_rgba(0,0,0,0.08)] -translate-y-0.5'
                    : 'bg-white border border-border/40 hover:border-border/60 hover:shadow-[0_10px_20px_-10px_rgba(0,0,0,0.05)] hover:-translate-y-0.5'
                    }`}
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="w-full flex justify-between items-center px-6 py-6 md:px-8 md:py-8 text-left cursor-pointer focus:outline-none"
                  >
                    <span className="text-[1.125rem] md:text-[1.25rem] font-heading font-semibold text-navy pr-8">
                      {faq.question}
                    </span>
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-500 ${isOpen
                      ? 'bg-navy text-white rotate-180'
                      : 'bg-bg-alt text-text-muted group-hover:bg-sky/10 group-hover:text-sky rotate-0'
                      }`}>
                      {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0, y: -10 }}
                        animate={{ height: "auto", opacity: 1, y: 0 }}
                        exit={{ height: 0, opacity: 0, y: -10 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-8 md:px-8 md:pb-8 pt-0">
                          <p className="text-base text-text-muted leading-relaxed font-normal">
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </StaggerItem>
              );
            })}
          </StaggerContainer>

        </div>
      </div>
    </section>
  );
}
