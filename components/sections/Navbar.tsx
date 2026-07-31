"use client";
import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, Globe, ChevronDown } from "lucide-react";
import { setCookie } from "@/lib/cookie";

export function Navbar() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [langOpen, setLangOpen] = React.useState(false);
  const [lang, setLang] = React.useState("ID");

  React.useEffect(() => {
    if (typeof document !== "undefined") {
      const match = document.cookie.match(new RegExp('(^| )locale=([^;]+)'));
      if (match && match[2]) {
        setTimeout(() => setLang(match[2].toUpperCase()), 0);
      }
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const switchLanguage = (newLang: string) => {
    setLang(newLang);
    setLangOpen(false);
    setMobileOpen(false);
    setCookie("locale", newLang.toLowerCase(), 365);
    window.location.reload();
  };

  return (
    <header className={`fixed left-0 w-full z-50 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] flex justify-center ${isScrolled ? "top-3 md:top-5 px-4" : "top-0 px-0"
      }`}>
      {/* The Background Pill / Header Bar */}
      <div className={`w-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] bg-white/85 dark:bg-bg/90 backdrop-blur-2xl border-border flex justify-center ${isScrolled
        ? "max-w-[1050px] rounded-2xl md:rounded-2xl border shadow-2xl shadow-navy/5 py-3 md:py-3.5 px-5 md:px-8"
        : "max-w-full rounded-none border-b border-border/40 shadow-none py-4 md:py-5 px-6 md:px-10"
        }`}>

        {/* Content Container to control internal layout width seamlessly */}
        <div className={`relative w-full flex items-center justify-between transition-all duration-500 ${isScrolled ? "max-w-[1050px]" : "max-w-[1200px]"
          }`}>

          {/* Logo */}
          <Link 
            href="/" 
            onClick={(e) => {
              if (window.location.pathname === '/') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            className="flex items-center gap-2.5 group relative z-10"
          >
            <div className="w-8 h-8 md:w-9 md:h-9 rounded-[10px] bg-navy text-white flex items-center justify-center font-bold text-lg md:text-xl group-hover:scale-105 group-hover:rotate-[-5deg] transition-transform duration-300 shadow-md">U</div>
            <span className="font-heading font-bold text-xl md:text-2xl text-navy tracking-tight">Upahku</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            <Link href="#tentang" className="text-sm font-semibold text-text-body hover:text-navy hover:-translate-y-0.5 transition-all">Tentang</Link>
            <Link href="#cara-kerja" className="text-sm font-semibold text-text-body hover:text-navy hover:-translate-y-0.5 transition-all">Cara Kerja</Link>
            <Link href="#untuk-pekerja" className="text-sm font-semibold text-text-body hover:text-navy hover:-translate-y-0.5 transition-all">Pekerja</Link>
            <Link href="#untuk-pemberi-kerja" className="text-sm font-semibold text-text-body hover:text-navy hover:-translate-y-0.5 transition-all">Pemberi Kerja</Link>
          </nav>

          {/* Right side Actions */}
          <div className="hidden lg:flex items-center gap-5 relative z-10">
            {/* Lang Switcher */}
            <div className="relative">
              <button onClick={() => setLangOpen(!langOpen)} className="flex items-center gap-1.5 text-sm font-semibold text-text-body hover:text-navy transition-colors bg-bg-soft/50 hover:bg-bg-soft px-3 py-1.5 rounded-full border border-transparent hover:border-border">
                <Globe className="w-4 h-4" />
                {lang}
                <ChevronDown className={`w-3 h-3 transition-transform ${langOpen ? "rotate-180" : ""}`} />
              </button>
              {langOpen && (
                <div className="absolute top-full mt-3 right-0 w-36 bg-white/95 backdrop-blur-xl border border-border shadow-2xl rounded-2xl p-1.5 flex flex-col gap-1 animate-in fade-in zoom-in-95 origin-top-right">
                  <button onClick={() => switchLanguage("ID")} className={`flex items-center justify-between text-sm px-3 py-2.5 rounded-xl transition-all ${lang === "ID" ? "bg-bg-soft text-navy font-bold" : "text-text-body hover:bg-bg-soft font-medium"}`}>
                    <span>Indonesian</span>
                    {lang === "ID" && <span className="w-1.5 h-1.5 rounded-full bg-navy"></span>}
                  </button>
                  <button onClick={() => switchLanguage("EN")} className={`flex items-center justify-between text-sm px-3 py-2.5 rounded-xl transition-all ${lang === "EN" ? "bg-bg-soft text-navy font-bold" : "text-text-body hover:bg-bg-soft font-medium"}`}>
                    <span>English</span>
                    {lang === "EN" && <span className="w-1.5 h-1.5 rounded-full bg-navy"></span>}
                  </button>
                </div>
              )}
            </div>

            <div className="h-5 w-px bg-border/80"></div>

            <div className="flex items-center gap-2 md:gap-3">
              <Link href="/login" className="text-sm font-semibold text-text-body hover:text-navy px-3 py-2 rounded-xl hover:bg-bg-soft transition-colors">
                Masuk
              </Link>
              <Button asChild className="rounded-full hover:-translate-y-0.5 transition-all bg-sky text-white hover:bg-sky-active px-6 font-semibold shadow-md border border-sky-active/20">
                <Link href="/register">Daftar</Link>
              </Button>
            </div>
          </div>

          {/* Mobile Toggle */}
          <button className="lg:hidden text-navy p-2 bg-bg-soft/50 rounded-full border border-border relative z-10" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={20} strokeWidth={2.5} /> : <Menu size={20} strokeWidth={2.5} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileOpen && (
        <div className="lg:hidden absolute top-[calc(100%+0.5rem)] left-0 w-full px-4">
          <div className="w-full bg-white/95 backdrop-blur-3xl border border-border shadow-2xl p-6 flex flex-col gap-5 rounded-3xl animate-in fade-in slide-in-from-top-2">
            <div className="flex flex-col gap-1">
              <Link href="#tentang" onClick={() => setMobileOpen(false)} className="text-base font-semibold text-navy p-3 rounded-xl hover:bg-bg-soft transition-colors">Tentang</Link>
              <Link href="#cara-kerja" onClick={() => setMobileOpen(false)} className="text-base font-semibold text-navy p-3 rounded-xl hover:bg-bg-soft transition-colors">Cara Kerja</Link>
              <Link href="#untuk-pekerja" onClick={() => setMobileOpen(false)} className="text-base font-semibold text-navy p-3 rounded-xl hover:bg-bg-soft transition-colors">Untuk Pekerja</Link>
              <Link href="#untuk-pemberi-kerja" onClick={() => setMobileOpen(false)} className="text-base font-semibold text-navy p-3 rounded-xl hover:bg-bg-soft transition-colors">Untuk Pemberi Kerja</Link>
            </div>

            <div className="h-px bg-border w-full"></div>

            <div className="flex items-center justify-between px-3">
              <span className="text-sm font-medium text-text-muted">Bahasa</span>
              <div className="flex bg-bg-soft rounded-lg p-1">
                <button onClick={() => switchLanguage("ID")} className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${lang === "ID" ? "bg-white text-navy shadow-sm" : "text-text-muted"}`}>ID</button>
                <button onClick={() => switchLanguage("EN")} className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${lang === "EN" ? "bg-white text-navy shadow-sm" : "text-text-muted"}`}>EN</button>
              </div>
            </div>

            <div className="flex flex-col gap-3 mt-2">
              <Link href="/login" onClick={() => setMobileOpen(false)}>
                <Button variant="outline" className="w-full rounded-xl border-border text-navy h-12 font-bold text-base">Masuk</Button>
              </Link>
              <Link href="/register" onClick={() => setMobileOpen(false)}>
                <Button className="w-full rounded-xl bg-navy text-white h-12 font-bold text-base shadow-lg">Daftar Sekarang</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
