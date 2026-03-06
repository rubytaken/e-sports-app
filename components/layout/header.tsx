"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sun, Moon, Search, Menu, X, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/hooks/use-theme";
import { useLocale } from "@/hooks/use-locale";
import { locales, localeNames, type Locale } from "@/lib/i18n";
import { SearchModal } from "@/components/shared/search-modal";
import { cn } from "@/lib/utils";

export function Header() {
  const path = usePathname();
  const { theme, toggle } = useTheme();
  const { locale, setLocale, t } = useLocale();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const nav = [
    { href: "/matches", key: "nav.matches" },
    { href: "/tournaments", key: "nav.tournaments" },
    { href: "/teams", key: "nav.teams" },
    { href: "/players", key: "nav.players" },
    { href: "/news", key: "nav.news" },
  ];

  // Close mobile nav on route change
  useEffect(() => { setMobileOpen(false); }, [path]);

  // Ctrl+K to open search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Close lang dropdown when clicking outside
  useEffect(() => {
    if (!langOpen) return;
    const handler = () => setLangOpen(false);
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, [langOpen]);

  const isActive = useCallback((href: string) => {
    return href === "/" ? path === "/" : path.startsWith(href);
  }, [path]);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-surface-0/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-[1100px] items-center justify-between px-5">
          {/* Left: logo */}
          <Link href="/" className="text-base font-display font-bold tracking-wide text-text-0 shrink-0">
            <span className="text-accent">e</span>-scores
          </Link>

          {/* Center: desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors",
                  isActive(item.href) ? "bg-surface-2 text-text-0" : "text-text-2 hover:text-text-1"
                )}
              >
                {t(item.key)}
              </Link>
            ))}
          </nav>

          {/* Right: actions */}
          <div className="flex items-center gap-0.5">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(true)}
              className="rounded-md p-2 text-text-2 hover:text-text-0 hover:bg-surface-2 transition-colors"
              aria-label="Search"
            >
              <Search size={15} />
            </button>

            {/* Language */}
            <div className="relative">
              <button
                onClick={(e) => { e.stopPropagation(); setLangOpen(!langOpen); }}
                className="rounded-md p-2 text-text-2 hover:text-text-0 hover:bg-surface-2 transition-colors flex items-center gap-1"
                aria-label="Language"
              >
                <Globe size={15} />
                <span className="text-[10px] font-medium uppercase hidden sm:inline">{locale}</span>
              </button>

              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-1 w-36 rounded-xl border border-border bg-surface-0 shadow-xl overflow-hidden z-50"
                  >
                    {locales.map((l) => (
                      <button
                        key={l}
                        onClick={() => { setLocale(l); setLangOpen(false); }}
                        className={cn(
                          "flex w-full items-center gap-2.5 px-3 py-2.5 text-xs transition-colors",
                          l === locale ? "bg-surface-2 text-text-0" : "text-text-2 hover:bg-surface-1 hover:text-text-0"
                        )}
                      >
                        <span className="font-semibold uppercase w-5">{l}</span>
                        <span>{localeNames[l]}</span>
                        {l === locale && (
                          <span className="ml-auto h-1.5 w-1.5 rounded-full bg-accent" />
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Theme */}
            <button
              onClick={toggle}
              className="rounded-md p-2 text-text-2 hover:text-text-0 hover:bg-surface-2 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden rounded-md p-2 text-text-2 hover:text-text-0 hover:bg-surface-2 transition-colors"
              aria-label="Menu"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-border bg-surface-0 overflow-hidden"
            >
              <nav className="flex flex-col px-5 py-3 gap-0.5">
                {nav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive(item.href) ? "bg-surface-2 text-text-0" : "text-text-2 hover:text-text-0 hover:bg-surface-1"
                    )}
                  >
                    {t(item.key)}
                  </Link>
                ))}

                {/* Mobile language */}
                <div className="border-t border-border mt-2 pt-2">
                  <p className="px-3 py-1 text-[10px] text-text-2 uppercase tracking-wide font-medium">{t("language")}</p>
                  <div className="flex flex-wrap gap-1 px-3 py-1.5">
                    {locales.map((l) => (
                      <button
                        key={l}
                        onClick={() => setLocale(l)}
                        className={cn(
                          "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                          l === locale ? "bg-accent text-white" : "bg-surface-2 text-text-2 hover:text-text-0"
                        )}
                      >
                        {l.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Search modal */}
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
