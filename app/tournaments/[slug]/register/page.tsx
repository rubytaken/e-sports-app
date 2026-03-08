"use client";

import { use, useState } from "react";
import { SafeImage } from "@/components/shared/safe-image";
import { GameIcon } from "@/components/shared/game-icon";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Trophy, Users, ClipboardCheck, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTournament } from "@/lib/api/tournaments";
import { TierBadge } from "@/components/shared/tier-badge";
import { PageSkeleton } from "@/components/shared/loading-skeleton";
import { ErrorState } from "@/components/shared/error-state";
import { PageTransition } from "@/components/shared/animated-container";
import { useLocale } from "@/hooks/use-locale";
import { cn, formatDate } from "@/lib/utils";

interface PlayerEntry {
  name: string;
  role: string;
  rank: string;
}

interface FormData {
  teamName: string;
  teamTag: string;
  captainName: string;
  captainEmail: string;
  captainDiscord: string;
  players: PlayerEntry[];
  substitute: PlayerEntry;
  agreeRules: boolean;
}

const initialPlayer: PlayerEntry = { name: "", role: "", rank: "" };

const initialForm: FormData = {
  teamName: "",
  teamTag: "",
  captainName: "",
  captainEmail: "",
  captainDiscord: "",
  players: [
    { ...initialPlayer },
    { ...initialPlayer },
    { ...initialPlayer },
    { ...initialPlayer },
    { ...initialPlayer },
  ],
  substitute: { ...initialPlayer },
  agreeRules: false,
};

const steps = [
  { key: "info", icon: Trophy },
  { key: "roster", icon: Users },
  { key: "confirm", icon: ClipboardCheck },
] as const;

function InputField({
  label, value, onChange, placeholder, type = "text", error, required,
}: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string;
  type?: string; error?: string; required?: boolean;
}) {
  return (
    <div>
      <label className="block text-[11px] font-medium text-text-1 mb-1.5">
        {label} {required && <span className="text-live">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "h-9 w-full rounded-lg border bg-surface-0 px-3 text-xs text-text-0 placeholder:text-text-2 outline-none transition-colors focus:border-accent/50 focus:ring-1 focus:ring-accent/20",
          error ? "border-live/50" : "border-border"
        )}
      />
      {error && <p className="text-[10px] text-live mt-1">{error}</p>}
    </div>
  );
}

export default function TournamentRegister({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { t } = useLocale();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { data: tournament, isLoading, isError, refetch } = useTournament(slug);

  if (isLoading) return <PageSkeleton />;
  if (isError || !tournament) return <ErrorState message="Failed to load tournament." onRetry={() => refetch()} />;

  const updateField = (field: keyof FormData, value: string | boolean) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: "" }));
  };

  const updatePlayer = (index: number, field: keyof PlayerEntry, value: string) => {
    setForm((f) => {
      const players = [...f.players];
      players[index] = { ...players[index], [field]: value };
      return { ...f, players };
    });
    setErrors((e) => ({ ...e, [`player_${index}_${field}`]: "" }));
  };

  const updateSub = (field: keyof PlayerEntry, value: string) => {
    setForm((f) => ({ ...f, substitute: { ...f.substitute, [field]: value } }));
  };

  const validateStep0 = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.teamName.trim()) errs.teamName = t("register.required");
    if (!form.teamTag.trim()) errs.teamTag = t("register.required");
    if (!form.captainName.trim()) errs.captainName = t("register.required");
    if (!form.captainEmail.trim()) {
      errs.captainEmail = t("register.required");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.captainEmail)) {
      errs.captainEmail = t("register.email_invalid");
    }
    if (!form.captainDiscord.trim()) errs.captainDiscord = t("register.required");
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep1 = (): boolean => {
    const errs: Record<string, string> = {};
    form.players.forEach((p, i) => {
      if (!p.name.trim()) errs[`player_${i}_name`] = t("register.required");
      if (!p.role.trim()) errs[`player_${i}_role`] = t("register.required");
    });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const next = () => {
    if (step === 0 && !validateStep0()) return;
    if (step === 1 && !validateStep1()) return;
    setStep((s) => Math.min(s + 1, 2));
  };

  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const submit = async () => {
    if (!form.agreeRules) {
      setErrors({ agreeRules: t("register.required") });
      return;
    }
    setSubmitting(true);
    // Simulate submission
    await new Promise((r) => setTimeout(r, 1500));
    setSubmitting(false);
    setSubmitted(true);
  };

  // Success screen
  if (submitted) {
    return (
      <PageTransition>
        <div className="mx-auto max-w-[600px] px-5 py-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="h-16 w-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-6">
              <Check size={28} className="text-accent" />
            </div>
            <h1 className="text-2xl font-bold text-text-0 mb-2">{t("register.success.title")}</h1>
            <p className="text-sm text-text-2 mb-8 max-w-sm mx-auto">{t("register.success.desc")}</p>

            <div className="rounded-xl border border-border bg-surface-1 p-5 text-left mb-8">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-text-2">{t("register.team_name")}</span>
                  <p className="font-medium text-text-0 mt-0.5">{form.teamName}</p>
                </div>
                <div>
                  <span className="text-text-2">{t("register.team_tag")}</span>
                  <p className="font-medium text-text-0 mt-0.5">{form.teamTag}</p>
                </div>
                <div>
                  <span className="text-text-2">{t("register.captain_name")}</span>
                  <p className="font-medium text-text-0 mt-0.5">{form.captainName}</p>
                </div>
                <div>
                  <span className="text-text-2">{t("tournament")}</span>
                  <p className="font-medium text-text-0 mt-0.5">{tournament.name}</p>
                </div>
              </div>
            </div>

            <Link
              href={`/tournaments/${slug}`}
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent-hover transition-colors"
            >
              <ArrowLeft size={14} />
              {t("register.back_tournament")}
            </Link>
          </motion.div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="mx-auto max-w-[700px] px-5 py-10">
        {/* Back */}
        <Link href={`/tournaments/${slug}`} className="inline-flex items-center gap-1.5 text-xs text-text-2 hover:text-text-0 transition-colors mb-8">
          <ArrowLeft size={13} /> {t("back")}
        </Link>

        {/* Tournament Info Bar */}
        <div className="rounded-xl border border-border bg-surface-1 p-4 mb-8">
          <div className="flex items-center gap-3">
            {tournament.league?.image_url && (
              <div className="h-10 w-10 shrink-0 rounded-lg bg-logo-bg shadow-sm ring-1 ring-black/5 dark:ring-white/5 overflow-hidden flex items-center justify-center">
                <SafeImage src={tournament.league.image_url} alt="" width={28} height={28} className="object-contain" fallbackText={tournament.league?.name?.[0] || "?"} fallbackClassName="text-sm font-bold text-text-2" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold text-text-0 truncate">{tournament.name}</h2>
                <TierBadge tier={tournament.tier} />
              </div>
              <div className="flex items-center gap-2 text-[10px] text-text-2 mt-0.5">
                <span className="flex items-center gap-1">
                  {tournament.videogame?.slug && <GameIcon slug={tournament.videogame.slug} size={10} />}
                  {tournament.videogame?.name}
                </span>
                <span>&middot;</span>
                <span>{formatDate(tournament.begin_at)} — {formatDate(tournament.end_at)}</span>
                {tournament.prizepool && (
                  <>
                    <span>&middot;</span>
                    <span className="text-accent font-medium">{tournament.prizepool}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <h1 className="text-lg font-bold text-text-0 mb-1">{t("register.title")}</h1>
        <p className="text-xs text-text-2 mb-6">{t("register.subtitle")}</p>

        {/* Step Indicator */}
        <div className="flex items-center gap-2 mb-8">
          {steps.map((s, i) => {
            const Icon = s.icon;
            const isActive = i === step;
            const isCompleted = i < step;
            return (
              <div key={s.key} className="flex items-center gap-2 flex-1">
                <div className={cn(
                  "h-9 w-9 rounded-full flex items-center justify-center shrink-0 text-xs font-semibold transition-all",
                  isCompleted ? "step-completed" : isActive ? "step-active" : "bg-surface-2 text-text-2"
                )}>
                  {isCompleted ? <Check size={14} /> : <Icon size={14} />}
                </div>
                <span className={cn(
                  "text-[11px] font-medium hidden sm:block",
                  isActive ? "text-text-0" : "text-text-2"
                )}>
                  {t(`register.step.${s.key}`)}
                </span>
                {i < steps.length - 1 && (
                  <div className={cn(
                    "flex-1 h-px",
                    isCompleted ? "bg-accent" : "bg-border"
                  )} />
                )}
              </div>
            );
          })}
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            {/* Step 0: Team Info */}
            {step === 0 && (
              <div className="space-y-4">
                <div className="rounded-xl border border-border bg-surface-1 p-5">
                  <h3 className="text-sm font-semibold text-text-0 mb-4">{t("register.step.info")}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputField
                      label={t("register.team_name")}
                      value={form.teamName}
                      onChange={(v) => updateField("teamName", v)}
                      placeholder="Team Liquid"
                      error={errors.teamName}
                      required
                    />
                    <InputField
                      label={t("register.team_tag")}
                      value={form.teamTag}
                      onChange={(v) => updateField("teamTag", v)}
                      placeholder="TL"
                      error={errors.teamTag}
                      required
                    />
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-surface-1 p-5">
                  <h3 className="text-sm font-semibold text-text-0 mb-4">{t("register.captain_name")}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputField
                      label={t("register.captain_name")}
                      value={form.captainName}
                      onChange={(v) => updateField("captainName", v)}
                      placeholder="John Doe"
                      error={errors.captainName}
                      required
                    />
                    <InputField
                      label={t("register.captain_email")}
                      value={form.captainEmail}
                      onChange={(v) => updateField("captainEmail", v)}
                      placeholder="captain@team.gg"
                      type="email"
                      error={errors.captainEmail}
                      required
                    />
                    <InputField
                      label={t("register.captain_discord")}
                      value={form.captainDiscord}
                      onChange={(v) => updateField("captainDiscord", v)}
                      placeholder="captain#1234"
                      error={errors.captainDiscord}
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 1: Roster */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="rounded-xl border border-border bg-surface-1 p-5">
                  <h3 className="text-sm font-semibold text-text-0 mb-4">{t("register.step.roster")}</h3>
                  <div className="space-y-4">
                    {form.players.map((player, i) => (
                      <div key={i} className="rounded-lg border border-border bg-surface-0 p-4">
                        <span className="text-[11px] font-semibold text-accent mb-3 block">
                          {t("register.player")} {i + 1} {i === 0 && "(Captain)"}
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <InputField
                            label={t("register.player_name")}
                            value={player.name}
                            onChange={(v) => updatePlayer(i, "name", v)}
                            placeholder="Player IGN"
                            error={errors[`player_${i}_name`]}
                            required
                          />
                          <InputField
                            label={t("register.player_role")}
                            value={player.role}
                            onChange={(v) => updatePlayer(i, "role", v)}
                            placeholder="Entry / IGL / AWP"
                            error={errors[`player_${i}_role`]}
                            required
                          />
                          <InputField
                            label={t("register.player_rank")}
                            value={player.rank}
                            onChange={(v) => updatePlayer(i, "rank", v)}
                            placeholder="Global Elite / Radiant"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Substitute */}
                <div className="rounded-xl border border-border/50 bg-surface-1/50 p-5">
                  <h3 className="text-sm font-medium text-text-1 mb-4">{t("register.sub")}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <InputField
                      label={t("register.player_name")}
                      value={form.substitute.name}
                      onChange={(v) => updateSub("name", v)}
                      placeholder="Sub IGN"
                    />
                    <InputField
                      label={t("register.player_role")}
                      value={form.substitute.role}
                      onChange={(v) => updateSub("role", v)}
                      placeholder="Flex"
                    />
                    <InputField
                      label={t("register.player_rank")}
                      value={form.substitute.rank}
                      onChange={(v) => updateSub("rank", v)}
                      placeholder="Rank"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Confirm */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="rounded-xl border border-border bg-surface-1 p-5">
                  <h3 className="text-sm font-semibold text-text-0 mb-4">{t("register.step.confirm")}</h3>

                  {/* Team Summary */}
                  <div className="rounded-lg bg-surface-0 border border-border p-4 mb-4">
                    <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-xs">
                      <div>
                        <span className="text-text-2">{t("register.team_name")}</span>
                        <p className="font-medium text-text-0">{form.teamName}</p>
                      </div>
                      <div>
                        <span className="text-text-2">{t("register.team_tag")}</span>
                        <p className="font-medium text-text-0">{form.teamTag}</p>
                      </div>
                      <div>
                        <span className="text-text-2">{t("register.captain_name")}</span>
                        <p className="font-medium text-text-0">{form.captainName}</p>
                      </div>
                      <div>
                        <span className="text-text-2">{t("register.captain_email")}</span>
                        <p className="font-medium text-text-0">{form.captainEmail}</p>
                      </div>
                      <div>
                        <span className="text-text-2">{t("register.captain_discord")}</span>
                        <p className="font-medium text-text-0">{form.captainDiscord}</p>
                      </div>
                    </div>
                  </div>

                  {/* Roster Summary */}
                  <div className="rounded-lg bg-surface-0 border border-border p-4 mb-4">
                    <span className="text-[11px] font-medium text-text-2 uppercase tracking-wider mb-3 block">{t("roster")}</span>
                    <div className="space-y-2">
                      {form.players.map((p, i) => (
                        <div key={i} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span className="h-5 w-5 rounded bg-accent/10 text-accent text-[10px] font-bold flex items-center justify-center">{i + 1}</span>
                            <span className="text-text-0 font-medium">{p.name || "—"}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-text-2">{p.role || "—"}</span>
                            {p.rank && <span className="text-[10px] bg-surface-2 text-text-2 rounded px-1.5 py-0.5">{p.rank}</span>}
                          </div>
                        </div>
                      ))}
                      {form.substitute.name && (
                        <div className="flex items-center justify-between text-xs pt-2 border-t border-border/50">
                          <div className="flex items-center gap-2">
                            <span className="h-5 w-5 rounded bg-surface-2 text-text-2 text-[10px] font-bold flex items-center justify-center">S</span>
                            <span className="text-text-1">{form.substitute.name}</span>
                          </div>
                          <span className="text-text-2">{form.substitute.role}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Agree */}
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.agreeRules}
                      onChange={(e) => updateField("agreeRules", e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-border accent-accent"
                    />
                    <span className="text-xs text-text-1">{t("register.agree")}</span>
                  </label>
                  {errors.agreeRules && <p className="text-[10px] text-live mt-1">{errors.agreeRules}</p>}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8">
          <button
            onClick={prev}
            disabled={step === 0}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-xs font-medium transition-colors",
              step === 0
                ? "opacity-30 cursor-not-allowed text-text-2"
                : "text-text-1 hover:text-text-0 hover:bg-surface-2"
            )}
          >
            <ArrowLeft size={13} />
            {t("register.prev")}
          </button>

          {step < 2 ? (
            <button
              onClick={next}
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-xs font-medium text-white hover:bg-accent-hover transition-colors"
            >
              {t("register.next")}
              <ArrowRight size={13} />
            </button>
          ) : (
            <button
              onClick={submit}
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-xs font-medium text-white hover:bg-accent-hover transition-colors disabled:opacity-60"
            >
              {submitting ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <Check size={13} />
              )}
              {t("register.submit")}
            </button>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
