"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sun, Moon, Search, Menu, X, Globe, Crosshair, Swords, Gamepad2, Target, Zap } from "lucide-react";
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
  const [scrolled, setScrolled] = useState(false);

  const nav = [
    { href: "/matches", key: "nav.matches", icon: Swords },
    { href: "/tournaments", key: "nav.tournaments", icon: Trophy },
    { href: "/teams", key: "nav.teams", icon: Target },
    { href: "/players", key: "nav.players", icon: Gamepad2 },
    { href: "/news", key: "nav.news", icon: Zap },
  ];

  // Track scroll for header styling
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
      <header className={cn(
        "sticky top-0 z-50 header-glow transition-all duration-200",
        scrolled
          ? "bg-surface-0/95 backdrop-blur-xl shadow-lg shadow-black/5"
          : "bg-surface-0/80 backdrop-blur-md"
      )}>
        <div className="mx-auto flex h-14 max-w-[1200px] items-center justify-between px-5">
          {/* Left: logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <div className="h-8 w-8 rounded-lg bg-accent/10 flex items-center justify-center border border-accent/20 group-hover:bg-accent/15 transition-colors">
              <Crosshair size={16} className="text-accent" />
            </div>
            <span className="text-base font-bold tracking-tight text-text-0">
              <span className="text-accent">e</span>-scores
            </span>
          </Link>

          {/* Center: desktop nav */}
          <nav className="hidden md:flex items-center gap-0.5">
            {nav.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative flex items-center gap-1.5 rounded-lg px-3 py-2 text-[13px] font-medium transition-all",
                    active
                      ? "text-accent bg-accent/8"
                      : "text-text-1 hover:text-text-0 hover:bg-surface-2/50"
                  )}
                >
                  <Icon size={14} className={active ? "text-accent" : ""} />
                  {t(item.key)}
                  {active && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-accent"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right: actions */}
          <div className="flex items-center gap-1">
            {/* Search button */}
            <button
              onClick={() => setSearchOpen(true)}
              className="hidden sm:flex items-center gap-2 rounded-lg border border-border bg-surface-1/50 px-3 py-1.5 text-xs text-text-2 hover:text-text-1 hover:border-border-hover transition-all"
            >
              <Search size={13} />
              <span className="text-text-2/60">Search...</span>
              <kbd className="ml-2 rounded border border-border bg-surface-2/80 px-1 py-0.5 text-[9px] font-mono text-text-2">
                Ctrl+K
              </kbd>
            </button>

            {/* Mobile search icon */}
            <button
              onClick={() => setSearchOpen(true)}
              className="sm:hidden rounded-lg p-2 text-text-2 hover:text-text-0 hover:bg-surface-2/50 transition-colors"
              aria-label="Search"
            >
              <Search size={16} />
            </button>

            {/* Language */}
            <div className="relative">
              <button
                onClick={(e) => { e.stopPropagation(); setLangOpen(!langOpen); }}
                className="rounded-lg p-2 text-text-2 hover:text-text-0 hover:bg-surface-2/50 transition-colors"
                aria-label="Language"
              >
                <Globe size={15} />
              </button>

              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -4, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-1 w-40 rounded-xl border border-border bg-surface-1 shadow-2xl overflow-hidden z-50"
                  >
                    {locales.map((l) => (
                      <button
                        key={l}
                        onClick={() => { setLocale(l); setLangOpen(false); }}
                        className={cn(
                          "flex w-full items-center gap-2.5 px-3 py-2.5 text-xs transition-colors",
                          l === locale ? "bg-accent/8 text-accent" : "text-text-1 hover:bg-surface-2/50 hover:text-text-0"
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

            {/* Theme toggle */}
            <button
              onClick={toggle}
              className="rounded-lg p-2 text-text-2 hover:text-text-0 hover:bg-surface-2/50 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden rounded-lg p-2 text-text-2 hover:text-text-0 hover:bg-surface-2/50 transition-colors"
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
              className="md:hidden border-t border-border bg-surface-0/95 backdrop-blur-xl overflow-hidden"
            >
              <nav className="flex flex-col px-5 py-3 gap-0.5">
                {nav.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                        isActive(item.href) ? "bg-accent/8 text-accent" : "text-text-1 hover:text-text-0 hover:bg-surface-2/50"
                      )}
                    >
                      <Icon size={16} />
                      {t(item.key)}
                    </Link>
                  );
                })}

                {/* Mobile language */}
                <div className="border-t border-border mt-2 pt-2">
                  <p className="px-3 py-1 text-[10px] text-text-2 uppercase tracking-wider font-medium">{t("language")}</p>
                  <div className="flex flex-wrap gap-1 px-3 py-1.5">
                    {locales.map((l) => (
                      <button
                        key={l}
                        onClick={() => setLocale(l)}
                        className={cn(
                          "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
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

// Need to import Trophy for nav
import { Trophy } from "lucide-react";
