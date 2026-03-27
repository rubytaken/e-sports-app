"use client";

import Link from "next/link";
import { Home, ArrowLeft, Crosshair } from "lucide-react";
import { useLocale } from "@/hooks/use-locale";
import { motion } from "framer-motion";

export default function NotFound() {
  const { t } = useLocale();

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        {/* Large 404 */}
        <div className="relative mb-8">
          <span className="text-[120px] sm:text-[160px] font-extrabold text-surface-2 leading-none select-none">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-16 w-16 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center shadow-lg shadow-accent/10">
              <Crosshair size={28} className="text-accent" />
            </div>
          </div>
        </div>

        <h1 className="text-xl font-bold text-text-0 mb-2">{t("404.title")}</h1>
        <p className="text-sm text-text-2 mb-8">{t("404.desc")}</p>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface-1 px-5 py-2.5 text-xs font-semibold text-text-1 hover:text-text-0 hover:bg-surface-2 hover:border-border-hover transition-all"
          >
            <ArrowLeft size={13} />
            {t("back")}
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-xs font-semibold text-white hover:bg-accent-hover shadow-sm shadow-accent/20 transition-all"
          >
            <Home size={13} />
            {t("404.home")}
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
