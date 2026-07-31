"use client";
import * as React from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { ShieldCheck, Calendar, CheckCircle2, Briefcase, Star, Users, Quote } from "lucide-react";
import { BlurReveal, StaggerTextContainer, SplitText } from "@/components/ui/motion";
import "swiper/css";

const testimonials = [
  {
    type: "Pemberi Kerja",
    quote: "Sebelumnya saya kesulitan menemukan tukang yang benar-benar terpercaya. Dengan Upahku, proses pencarian menjadi <span class='text-sky font-medium'>jauh lebih mudah</span> karena setiap pekerja memiliki riwayat yang jelas.",
    name: "Rudi Hartono",
    role: "Pemilik UMKM",
    location: "Denpasar",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150&h=150&auto=format&fit=crop",
    metadata: [
      { icon: Calendar, text: "Pengguna sejak 2024" },
      { icon: CheckCircle2, text: "Profil terverifikasi" }
    ]
  },
  {
    type: "Pekerja",
    quote: "Dulu kalau ganti nomor HP, saya harus mulai dari nol lagi cari pelanggan. Sekarang, profil Upahku jadi modal utama saya <span class='text-sky font-medium'>membangun karir jangka panjang.</span>",
    name: "Siti Aminah",
    role: "Guru Les Privat",
    location: "Surabaya",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&h=150&auto=format&fit=crop",
    metadata: [
      { icon: Briefcase, text: "45 pekerjaan selesai" },
      { icon: Star, text: "Rating 4.9/5" }
    ]
  },
  {
    type: "Pekerja",
    quote: "Estimator upah sangat membantu. Saya jadi tahu kalau harga pasaran pasang keramik di Bandung itu berapa, <span class='text-sky font-medium'>tidak asal tebak atau kemurahan.</span>",
    name: "Asep Mulyana",
    role: "Tukang Bangunan",
    location: "Bandung",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&h=150&auto=format&fit=crop",
    metadata: [
      { icon: Calendar, text: "Pengguna sejak 2023" },
      { icon: Briefcase, text: "128 pekerjaan selesai" }
    ]
  },
  {
    type: "Pemberi Kerja",
    quote: "Platform ini mengubah cara kami beroperasi. Verifikasi komunitas dari RT atau mandor <span class='text-sky font-medium'>benar-benar menyeleksi pekerja</span> dengan sangat baik.",
    name: "Budi Santoso",
    role: "Kontraktor Sipil",
    location: "Jakarta",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&h=150&auto=format&fit=crop",
    metadata: [
      { icon: CheckCircle2, text: "Verified Employer" },
      { icon: Users, text: "Mempekerjakan 30+ orang" }
    ]
  },
  {
    type: "Pekerja",
    quote: "Saya merasa lebih dihargai secara profesional. Ulasan dari pelanggan dan sistem anti-manipulasi <span class='text-sky font-medium'>membuat saya tenang bekerja</span> dengan standar tinggi.",
    name: "Dian Pratama",
    role: "Teknisi",
    location: "Medan",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=150&h=150&auto=format&fit=crop",
    metadata: [
      { icon: Star, text: "Rating 5.0/5" },
      { icon: CheckCircle2, text: "Profil terverifikasi" }
    ]
  }
];

// Duplicate data to ensure Swiper loop mode works flawlessly without warnings on wide screens
const extendedTestimonials = [...testimonials, ...testimonials];

export function TestimonialsSection() {
  return (
    <section className="bg-bg-alt py-24 md:py-32 lg:py-40 overflow-hidden relative">

      {/* Subtle background blurs for depth */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-50">
        <div className="absolute top-[20%] left-[-10%] w-[40%] h-[40%] bg-sky/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[50%] bg-navy/5 rounded-full blur-[120px]" />
      </div>

      {/* Global CSS for Swiper active/inactive transitions */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .testimonial-swiper {
           overflow: visible !important;
        }
        .testimonial-swiper .swiper-slide {
           transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
           opacity: 0.45;
           transform: scale(0.95);
        }
        .testimonial-swiper .swiper-slide-active {
           opacity: 1;
           transform: scale(1);
           z-index: 10;
        }
        
        .testimonial-card {
           transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
           border: 1px solid transparent;
           box-shadow: none;
        }
        
        .testimonial-swiper .swiper-slide-active .testimonial-card {
           border-color: rgba(0, 0, 0, 0.05);
           box-shadow: 0 10px 40px -10px rgba(0,0,0,0.06);
        }
        
        .testimonial-swiper .swiper-slide-active:hover .testimonial-card {
           transform: translateY(-4px);
           border-color: var(--color-sky);
           box-shadow: 0 25px 50px -12px rgba(0,0,0,0.1);
        }
      `}} />

      <div className="container mx-auto px-4 max-w-[1200px] relative z-10">

        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-16 md:mb-24">
          <BlurReveal delay={0.1}>
            <span className="text-[11px] uppercase font-bold tracking-widest text-sky mb-4 px-4 py-1.5 bg-sky/5 border border-sky/10 rounded-full">
              Testimonial
            </span>
          </BlurReveal>
          <StaggerTextContainer delayChildren={0.2} className="text-[2.75rem] md:text-[3.5rem] lg:text-[4rem] font-heading font-semibold text-navy leading-[1.1] tracking-tight mb-6 mt-4">
            <SplitText text="Cerita nyata" /> <br /> <span className="font-light text-sky"><SplitText text="dari para pengguna." /></span>
          </StaggerTextContainer>
          <BlurReveal delay={0.3}>
            <p className="text-lg md:text-xl text-text-body max-w-[480px] leading-relaxed">
              Dengarkan langsung bagaimana Upahku membangun ekosistem kerja informal yang lebih adil dan transparan.
            </p>
          </BlurReveal>
        </div>

      </div>

      {/* Full bleed slider container */}
      <BlurReveal 
        delay={0.2}
        className="w-full relative z-10"
      >
        <Swiper
          modules={[Autoplay]}
          spaceBetween={24}
          slidesPerView={1.2}
          centeredSlides={true}
          loop={true}
          grabCursor={true}
          autoplay={{ delay: 6000, disableOnInteraction: false }}
          breakpoints={{
            640: { slidesPerView: 1.5, spaceBetween: 32 },
            1024: { slidesPerView: 2.5, spaceBetween: 48 },
            1280: { slidesPerView: 3, spaceBetween: 48 },
          }}
          className="testimonial-swiper"
        >
          {extendedTestimonials.map((testi, idx) => (
            <SwiperSlide key={idx} className="h-auto">
              <div className="testimonial-card group relative bg-bg rounded-[32px] p-8 md:p-10 lg:p-12 flex flex-col justify-between h-full min-h-[480px] cursor-grab active:cursor-grabbing border border-border/40 overflow-hidden">

                {/* Decorative huge quote mark */}
                <Quote className="absolute top-8 right-8 w-24 h-24 text-bg-alt/60 select-none z-0 fill-bg-alt/20" strokeWidth={1} />

                {/* Top Badge */}
                <div className="mb-10 relative z-10">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-navy/5 text-navy text-[11px] font-bold uppercase tracking-widest border border-navy/10 group-hover:bg-sky/10 group-hover:text-sky transition-colors duration-300">
                    <ShieldCheck className="w-3.5 h-3.5" /> {testi.type}
                  </span>
                </div>

                {/* Quote */}
                <p
                  className="text-xl md:text-2xl font-light text-navy leading-[1.6] mb-12 tracking-tight relative z-10"
                  dangerouslySetInnerHTML={{ __html: testi.quote }}
                />

                {/* Bottom Area */}
                <div className="pt-6 border-t border-border/50 mt-auto flex flex-col gap-5 relative z-10">

                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 bg-bg-alt shadow-sm">
                      <img
                        src={testi.image}
                        alt={testi.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-heading font-semibold text-navy text-lg leading-tight">{testi.name}</span>
                      <span className="text-sm font-medium text-text-muted mt-0.5">{testi.role} • {testi.location}</span>
                    </div>
                  </div>

                  {/* Metadata Snippets */}
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    {testi.metadata.map((meta, i) => {
                      const Icon = meta.icon;
                      return (
                        <div key={i} className="flex items-center gap-1.5 text-[11px] text-text-muted font-medium bg-bg-alt/50 px-2.5 py-1.5 rounded-md border border-border/30">
                          <Icon className="w-3 h-3 text-sky" />
                          {meta.text}
                        </div>
                      )
                    })}
                  </div>

                </div>

              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </BlurReveal>

    </section>
  );
}
