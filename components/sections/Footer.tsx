"use client";

import * as React from "react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { Mail, ArrowUp } from "lucide-react";
import { BlurReveal, StaggerContainer, StaggerItem } from "@/components/ui/motion";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-white pt-24 pb-8 overflow-hidden flex flex-col border-t border-slate-100">

      {/* Background Soft Radial & Watermark */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-50 via-white to-white pointer-events-none" />
      <div className="absolute bottom-[-15%] left-1/2 -translate-x-1/2 w-full overflow-hidden pointer-events-none select-none flex justify-center z-0">
        <span className="font-heading font-black text-[24vw] text-slate-900 opacity-[0.03] leading-none tracking-tighter whitespace-nowrap">
          UPAHKU
        </span>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1200px] relative z-10 flex-1 flex flex-col justify-between">

        {/* Main Grid: 5 columns on desktop, 3 tablet, 1 mobile */}
        <StaggerContainer
          className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-12 lg:gap-8 pb-20"
        >

          {/* Column 1: Branding (Logo + Deskripsi) */}
          <StaggerItem className="flex flex-col gap-5 lg:pr-6">
            <Link href="/" className="group relative inline-flex flex-col w-fit">
              <div className="flex items-center transition-all duration-500 ease-out group-hover:-translate-y-[3px]">
                <span className="relative overflow-hidden font-heading font-bold text-[2.25rem] tracking-tight text-navy transition-all duration-500 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-sky group-hover:to-navy">
                  Upahku
                  {/* Shine effect */}
                  <span className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/60 to-transparent transition-all duration-500 ease-out group-hover:left-[100%]" />
                </span>
              </div>
              {/* Underline Logo */}
              <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-gradient-to-r from-sky to-navy transition-all duration-500 ease-out group-hover:w-full" />
            </Link>

            <p className="text-[16px] text-slate-500 font-light leading-relaxed max-w-[280px]">
              Platform reputasi yang mengubah bukti kerja nyata menjadi kepercayaan bernilai.
            </p>
          </StaggerItem>

          {/* Column 2: Produk */}
          <StaggerItem className="flex flex-col gap-5">
            <h4 className="text-[12px] font-semibold text-navy uppercase tracking-widest">Produk</h4>
            <nav className="flex flex-col gap-3">
              <FooterLink href="#cara-kerja">Cara Kerja</FooterLink>
              <FooterLink href="#untuk-pekerja">Untuk Pekerja</FooterLink>
              <FooterLink href="#untuk-pemberi-kerja">Untuk Pemberi Kerja</FooterLink>
              <FooterLink href="#estimasi">Estimasi Upah</FooterLink>
            </nav>
          </StaggerItem>

          {/* Column 3: Perusahaan */}
          <StaggerItem className="flex flex-col gap-5">
            <h4 className="text-[12px] font-semibold text-navy uppercase tracking-widest">Perusahaan</h4>
            <nav className="flex flex-col gap-3">
              <FooterLink href="#tentang">Tentang Kami</FooterLink>
              <FooterLink href="#blog">Blog</FooterLink>
              <FooterLink href="#karier">Karier</FooterLink>
            </nav>
          </StaggerItem>

          {/* Column 4: Legal */}
          <StaggerItem className="flex flex-col gap-5">
            <h4 className="text-[12px] font-semibold text-navy uppercase tracking-widest">Legal</h4>
            <nav className="flex flex-col gap-3">
              <FooterLink href="/privacy">Kebijakan Privasi</FooterLink>
              <FooterLink href="/terms">Syarat & Ketentuan</FooterLink>
              <FooterLink href="/cookies">Kebijakan Kuki</FooterLink>
              <FooterLink href="/faq">FAQ</FooterLink>
            </nav>
          </StaggerItem>

          {/* Column 5: Kontak */}
          <StaggerItem className="flex flex-col gap-5">
            <h4 className="text-[12px] font-semibold text-navy uppercase tracking-widest">Kontak</h4>
            <nav className="flex flex-col gap-3">
              <FooterLink href="mailto:halo@upahku.id">halo@upahku.id</FooterLink>
              <FooterLink href="#bantuan">Pusat Bantuan</FooterLink>
              <span className="text-[16px] text-slate-500 font-light mt-1">Jakarta, Indonesia</span>
            </nav>
          </StaggerItem>

        </StaggerContainer>

        {/* Bottom Section */}
        <BlurReveal
          delay={0.6}
          className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-slate-200/60"
        >
          {/* Copyright */}
          <div className="text-[14px] text-slate-500 font-light order-3 md:order-1">
            &copy; {currentYear} Upahku. Built in Indonesia.
          </div>

          {/* Social Media Icons - Dihapus sementara */}
          <div className="flex items-center gap-4 order-2">
            {/* Tempat untuk ikon sosial media nantinya */}
          </div>

          {/* Back to Top */}
          <div className="order-1 md:order-3">
            <button
              onClick={scrollToTop}
              className="group flex items-center justify-center w-10 h-10 rounded-full border border-slate-200 text-slate-500 hover:bg-navy hover:border-navy hover:text-white transition-all duration-300 hover:-translate-y-1"
              aria-label="Kembali ke atas"
            >
              <ArrowUp className="w-[18px] h-[18px] transition-transform duration-300 group-hover:-translate-y-0.5" />
            </button>
          </div>
        </BlurReveal>

      </div>
    </footer>
  );
}

// Reusable Footer Link with micro-interaction (text shift + underline)
function FooterLink({ href, children }: { href: string, children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="group relative flex items-center w-fit text-[16px] text-slate-500 transition-all duration-250 ease-out hover:text-navy hover:translate-x-1"
    >
      <span>{children}</span>
      <span className="absolute -bottom-0.5 left-0 w-0 h-[1px] bg-navy transition-all duration-250 ease-out group-hover:w-full opacity-50 group-hover:opacity-100" />
    </Link>
  );
}

// Reusable Social Icon with hover interaction
function SocialIcon({ href, icon }: { href: string, icon: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center w-9 h-9 rounded-full bg-transparent text-slate-400 transition-all duration-300 hover:bg-slate-100 hover:text-navy hover:-translate-y-1"
    >
      {icon}
    </a>
  );
}
