"use client";

import Link from "next/link";
import { Crosshair, Github, Twitter } from "lucide-react";
import { useLocale } from "@/hooks/use-locale";

export function Footer() {
  const { t } = useLocale();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface-1/30">
      <div className="mx-auto max-w-[1200px] px-5 py-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          {/* Left: branding */}
          <div>
            <Link href="/" className="flex items-center gap-2 group">
              <div className="h-7 w-7 rounded-lg bg-accent/10 flex items-center justify-center border border-accent/20">
                <Crosshair size={13} className="text-accent" />
              </div>
              <span className="text-sm font-bold tracking-tight text-text-0">
                <span className="text-accent">e</span>-scores
              </span>
            </Link>
            <p className="text-xs text-text-2 mt-2 max-w-xs">{t("footer.tagline")}</p>
          </div>

          {/* Center: nav links */}
          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            <Link href="/matches" className="text-xs text-text-2 hover:text-accent transition-colors">
              {t("nav.matches")}
            </Link>
            <Link href="/tournaments" className="text-xs text-text-2 hover:text-accent transition-colors">
              {t("nav.tournaments")}
            </Link>
            <Link href="/teams" className="text-xs text-text-2 hover:text-accent transition-colors">
              {t("nav.teams")}
            </Link>
            <Link href="/players" className="text-xs text-text-2 hover:text-accent transition-colors">
              {t("nav.players")}
            </Link>
            <Link href="/news" className="text-xs text-text-2 hover:text-accent transition-colors">
              {t("nav.news")}
            </Link>
          </nav>
        </div>

        {/* Divider */}
        <div className="h-px bg-border my-6" />

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[10px] text-text-2">
            &copy; {year} e-scores. {t("footer.rights")}
          </p>
          <div className="flex items-center gap-3">
            <p className="text-[10px] text-text-2">
              {t("footer.built_by")}
            </p>
            <span className="text-[10px] text-text-2/30">|</span>
            <p className="text-[10px] text-text-2">
              Powered by PandaScore API
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
