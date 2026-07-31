"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { StaggerContainer, StaggerItem } from "@/components/ui/motion";
import Link from "next/link";

interface AuthSplitLayoutProps {
  brandName: string;
  heading: string;
  subtext: string;
  bottomText: string;
  bottomLinkText: string;
  bottomLinkHref: string;
  backHref?: string;
  children: ReactNode;
}

export function AuthSplitLayout({
  brandName,
  heading,
  subtext,
  bottomText,
  bottomLinkText,
  bottomLinkHref,
  backHref,
  children,
}: AuthSplitLayoutProps) {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 md:p-8">
      {/* Background Soft Gradients */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-sky/10 rounded-full blur-[100px]" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-teal-500/10 rounded-full blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="flex w-full max-w-5xl overflow-hidden rounded-[32px] bg-white border border-slate-200 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] relative z-10"
      >
        {/* Left Panel (Branding) */}
        <div className="relative hidden w-1/2 lg:block bg-navy overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-sky/20 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-teal-500/20 rounded-full blur-[120px]" />

            {/* Subtle Grid Pattern */}
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />
          </div>

          <div className="relative flex h-full w-full flex-col justify-between p-16 z-10">
            <div>
              <Link href="/" className="inline-flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-[12px] bg-sky text-navy flex items-center justify-center font-bold text-xl group-hover:scale-105 group-hover:rotate-[-5deg] transition-all duration-300 shadow-[0_0_20px_rgba(56,189,248,0.4)]">
                  U
                </div>
                <span className="font-heading text-2xl font-bold tracking-tight text-white">
                  {brandName}
                </span>
              </Link>
            </div>

            <div className="mb-8">
              <h3 className="text-3xl font-heading font-semibold text-white leading-tight mb-4">
                Ubah Pekerjaan
                <br />
                Menjadi <span className="text-sky">Reputasi.</span>
              </h3>
              <p className="text-white/60 text-sm leading-relaxed max-w-[300px]">
                Platform terpercaya bagi pekerja informal Indonesia untuk
                mendapatkan upah yang adil dan pekerjaan yang lebih baik.
              </p>
            </div>
          </div>
        </div>

        {/* Right Panel (Form) */}
        <div className="w-full lg:w-1/2 p-8 sm:p-12 md:p-16 relative bg-white">
          <StaggerContainer
            delayChildren={0.1}
            staggerChildren={0.08}
            className="w-full h-full flex flex-col justify-center max-w-[400px] mx-auto"
          >
            <StaggerItem className="w-full">
              <div className="flex items-center justify-between mb-10">
                {backHref ? (
                  <button
                    type="button"
                    onClick={() => router.push(backHref)}
                    className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 hover:text-navy transition-colors"
                  >
                    <ArrowLeft size={14} />
                    Kembali
                  </button>
                ) : (
                  <div />
                )}
                <span className="font-heading text-lg font-bold tracking-tight text-navy lg:hidden">
                  {brandName}
                </span>
              </div>
            </StaggerItem>

            <StaggerItem className="w-full">
              <h2 className="font-heading text-3xl font-bold tracking-tight text-navy">
                {heading}
              </h2>
              <p className="mt-2 text-sm text-slate-500 font-medium">
                {subtext}
              </p>
            </StaggerItem>

            <StaggerItem className="mt-8 w-full">{children}</StaggerItem>

            <StaggerItem className="mt-8 w-full">
              <p className="text-center text-sm text-slate-500">
                {bottomText}{" "}
                <Link
                  href={bottomLinkHref}
                  className="font-bold text-sky hover:text-navy transition-colors"
                >
                  {bottomLinkText}
                </Link>
              </p>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </motion.div>
    </div>
  );
}
