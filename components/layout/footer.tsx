"use client";

import Link from "next/link";
import { useLocale } from "@/hooks/use-locale";

export function Footer() {
  const { t } = useLocale();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface-1/50">
      <div className="mx-auto max-w-[1100px] px-5 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          {/* Left: branding */}
          <div>
            <Link href="/" className="text-base font-display font-bold tracking-wide text-text-0">
              <span className="text-accent">e</span>-scores
            </Link>
            <p className="text-xs text-text-2 mt-1">{t("footer.tagline")}</p>
          </div>

          {/* Center: nav links */}
          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            <Link href="/matches" className="text-xs text-text-2 hover:text-text-0 transition-colors">
              {t("nav.matches")}
            </Link>
            <Link href="/tournaments" className="text-xs text-text-2 hover:text-text-0 transition-colors">
              {t("nav.tournaments")}
            </Link>
            <Link href="/teams" className="text-xs text-text-2 hover:text-text-0 transition-colors">
              {t("nav.teams")}
            </Link>
            <Link href="/players" className="text-xs text-text-2 hover:text-text-0 transition-colors">
              {t("nav.players")}
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
            <span className="text-[10px] text-text-2/40">|</span>
            <p className="text-[10px] text-text-2">
              Powered by PandaScore API
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
