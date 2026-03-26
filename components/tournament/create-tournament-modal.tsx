"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Plus, Trophy, Gamepad2, Users, Swords, MapPin,
  Calendar, FileText, ChevronDown, Loader2, Check, Sparkles,
} from "lucide-react";
import { useCreateTournament, type CreateTournamentInput } from "@/lib/api/custom-tournaments";
import { useLocale } from "@/hooks/use-locale";
import { cn } from "@/lib/utils";

const GAMES = [
  "CS2", "Valorant", "League of Legends", "Dota 2",
  "Overwatch 2", "Rainbow Six Siege", "Rocket League",
  "PUBG", "Apex Legends", "Fortnite",
] as const;

const FORMATS = [
  "Single Elimination", "Double Elimination",
  "Round Robin", "Swiss", "League",
] as const;

const TEAM_SIZES = [1, 2, 3, 5] as const;
const MAX_TEAMS_OPTIONS = [4, 8, 16, 32, 64, 128] as const;
const REGIONS = ["EU", "NA", "APAC", "SA", "CIS", "MENA", "OCE"] as const;

interface FormState {
  name: string;
  game: string;
  format: string;
  team_size: number;
  max_teams: number;
  prizepool: string;
  begin_at: string;
  end_at: string;
  description: string;
  region: string;
}

const initialForm: FormState = {
  name: "",
  game: "",
  format: "Single Elimination",
  team_size: 5,
  max_teams: 16,
  prizepool: "",
  begin_at: "",
  end_at: "",
  description: "",
  region: "EU",
};

/* ── Reusable field wrapper ── */
function Field({
  label, icon, error, required, children,
}: {
  label: string; icon: React.ReactNode; error?: string; required?: boolean; children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-[11px] font-medium text-text-1">
        <span className="text-text-2">{icon}</span>
        {label}
        {required && <span className="text-live text-[9px]">*</span>}
      </label>
      {children}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[10px] text-live font-medium"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}

/* ── Input ── */
function Input({
  value, onChange, placeholder, type = "text", error,
}: {
  value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string; error?: boolean;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={cn(
        "h-9 w-full rounded-lg border bg-surface-0 px-3 text-xs text-text-0 placeholder:text-text-2/50 outline-none transition-all",
        "focus:border-accent focus:ring-2 focus:ring-accent/15",
        error ? "border-live/50" : "border-border hover:border-border-hover"
      )}
    />
  );
}

/* ── Select ── */
function Select({
  value, onChange, options, placeholder, error,
}: {
  value: string | number; onChange: (v: string) => void;
  options: readonly (string | number)[]; placeholder?: string; error?: boolean;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "h-9 w-full appearance-none rounded-lg border bg-surface-0 px-3 pr-8 text-xs outline-none transition-all",
          "focus:border-accent focus:ring-2 focus:ring-accent/15",
          !value && placeholder ? "text-text-2/50" : "text-text-0",
          error ? "border-live/50" : "border-border hover:border-border-hover"
        )}
      >
        {placeholder && <option value="" disabled>{placeholder}</option>}
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
      <ChevronDown size={11} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-2 pointer-events-none" />
    </div>
  );
}

/* ═══════════════ MODAL ═══════════════ */

export function CreateTournamentModal() {
  const { t } = useLocale();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [success, setSuccess] = useState(false);

  const mutation = useCreateTournament();

  const set = (k: keyof FormState, v: string | number) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const validate = (): boolean => {
    const errs: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim()) errs.name = t("register.required");
    if (!form.game) errs.game = t("register.required");
    if (!form.begin_at) errs.begin_at = t("register.required");
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const input: CreateTournamentInput = {
      name: form.name.trim(),
      game: form.game,
      format: form.format,
      team_size: Number(form.team_size),
      max_teams: Number(form.max_teams),
      prizepool: form.prizepool || null,
      begin_at: new Date(form.begin_at).toISOString(),
      end_at: form.end_at ? new Date(form.end_at).toISOString() : null,
      description: form.description || null,
      region: form.region,
    };

    mutation.mutate(input, {
      onSuccess: () => {
        setSuccess(true);
        setTimeout(() => {
          setOpen(false);
          setTimeout(() => {
            setSuccess(false);
            setForm(initialForm);
            setErrors({});
          }, 300);
        }, 1800);
      },
    });
  };

  const handleOpenChange = (v: boolean) => {
    setOpen(v);
    if (!v) {
      setTimeout(() => {
        setForm(initialForm);
        setErrors({});
        setSuccess(false);
        mutation.reset();
      }, 300);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Trigger asChild>
        <button className="inline-flex items-center gap-1.5 rounded-[10px] bg-accent px-4 py-2 text-xs font-medium text-white hover:bg-accent-hover transition-colors btn-primary-shadow shrink-0">
          <Plus size={14} />
          <span className="hidden sm:inline">{t("tournaments.create")}</span>
          <span className="sm:hidden">Create</span>
        </button>
      </Dialog.Trigger>

      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            {/* Overlay */}
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
              />
            </Dialog.Overlay>

            {/* Content */}
            <Dialog.Content asChild>
              <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: 30 }}
                transition={{ type: "spring", duration: 0.45, bounce: 0.15 }}
                className={cn(
                  "fixed z-50 rounded-2xl border border-border bg-surface-1 shadow-xl",
                  "w-[calc(100%-2rem)] max-w-[520px]",
                  "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
                  "max-h-[calc(100vh-3rem)] overflow-hidden flex flex-col"
                )}
              >
                <AnimatePresence mode="wait">
                  {success ? (
                    /* ── Success state ── */
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ type: "spring", duration: 0.5 }}
                      className="flex flex-col items-center justify-center py-16 px-6"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", delay: 0.1, stiffness: 200 }}
                        className="relative mb-5"
                      >
                        <div className="h-16 w-16 rounded-2xl bg-accent/10 ring-2 ring-accent/20 flex items-center justify-center">
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 }}>
                            <Check size={30} className="text-accent" strokeWidth={3} />
                          </motion.div>
                        </div>
                        <motion.div
                          initial={{ opacity: 0, rotate: -20 }}
                          animate={{ opacity: 1, rotate: 0 }}
                          transition={{ delay: 0.5 }}
                          className="absolute -top-1.5 -right-1.5"
                        >
                          <Sparkles size={16} className="text-accent" />
                        </motion.div>
                      </motion.div>
                      <p className="text-sm font-bold text-text-0">Tournament Created!</p>
                      <p className="text-xs text-text-2 mt-1 text-center max-w-[260px]">
                        Your tournament is now live in the Community tab.
                      </p>
                    </motion.div>
                  ) : (
                    /* ── Form ── */
                    <motion.div
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col max-h-[calc(100vh-3rem)]"
                    >
                      {/* Header — fixed */}
                      <div className="flex items-center justify-between p-5 pb-4 border-b border-border shrink-0">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-xl bg-accent/10 ring-1 ring-accent/20 flex items-center justify-center">
                            <Trophy size={16} className="text-accent" />
                          </div>
                          <div>
                            <Dialog.Title className="text-sm font-bold text-text-0">
                              {t("tournaments.create")}
                            </Dialog.Title>
                            <Dialog.Description className="text-[10px] text-text-2 mt-0.5">
                              {t("tournaments.create_desc")}
                            </Dialog.Description>
                          </div>
                        </div>
                        <Dialog.Close className="h-8 w-8 rounded-lg border border-border flex items-center justify-center text-text-2 hover:text-text-0 hover:bg-surface-2 hover:border-border-hover transition-all">
                          <X size={14} />
                        </Dialog.Close>
                      </div>

                      {/* Scrollable form body */}
                      <div className="overflow-y-auto flex-1 custom-scrollbar">
                        <div className="p-5 space-y-4">

                          {/* Tournament Name */}
                          <Field label={t("tournaments.field.name")} icon={<Trophy size={10} />} error={errors.name} required>
                            <Input
                              value={form.name}
                              onChange={(v) => set("name", v)}
                              placeholder="Spring Championship 2026"
                              error={!!errors.name}
                            />
                          </Field>

                          {/* Game + Region — 2 col */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <Field label={t("tournaments.field.game")} icon={<Gamepad2 size={10} />} error={errors.game} required>
                              <Select
                                value={form.game}
                                onChange={(v) => set("game", v)}
                                options={GAMES}
                                placeholder="Select game"
                                error={!!errors.game}
                              />
                            </Field>
                            <Field label={t("tournaments.field.region")} icon={<MapPin size={10} />}>
                              <Select
                                value={form.region}
                                onChange={(v) => set("region", v)}
                                options={REGIONS}
                              />
                            </Field>
                          </div>

                          {/* Format + Team Size + Max Teams — 3 col on desktop, stack on mobile */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <Field label={t("tournaments.field.format")} icon={<Swords size={10} />}>
                              <Select
                                value={form.format}
                                onChange={(v) => set("format", v)}
                                options={FORMATS}
                              />
                            </Field>
                            <Field label={t("tournaments.field.team_size")} icon={<Users size={10} />}>
                              <Select
                                value={form.team_size}
                                onChange={(v) => set("team_size", Number(v))}
                                options={TEAM_SIZES}
                              />
                            </Field>
                            <Field label={t("tournaments.field.max_teams")} icon={<Users size={10} />}>
                              <Select
                                value={form.max_teams}
                                onChange={(v) => set("max_teams", Number(v))}
                                options={MAX_TEAMS_OPTIONS}
                              />
                            </Field>
                          </div>

                          {/* Dates — 2 col */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <Field label={t("tournaments.field.start_date")} icon={<Calendar size={10} />} error={errors.begin_at} required>
                              <Input
                                value={form.begin_at}
                                onChange={(v) => set("begin_at", v)}
                                type="datetime-local"
                                error={!!errors.begin_at}
                              />
                            </Field>
                            <Field label={t("tournaments.field.end_date")} icon={<Calendar size={10} />}>
                              <Input
                                value={form.end_at}
                                onChange={(v) => set("end_at", v)}
                                type="datetime-local"
                              />
                            </Field>
                          </div>

                          {/* Prizepool */}
                          <Field label={t("tournaments.field.prizepool")} icon={<Trophy size={10} />}>
                            <Input
                              value={form.prizepool}
                              onChange={(v) => set("prizepool", v)}
                              placeholder="$1,000 (optional)"
                            />
                          </Field>

                          {/* Description */}
                          <Field label={t("tournaments.field.description")} icon={<FileText size={10} />}>
                            <textarea
                              value={form.description}
                              onChange={(e) => set("description", e.target.value)}
                              placeholder="Rules, details, requirements..."
                              rows={3}
                              className="w-full rounded-lg border border-border bg-surface-0 px-3 py-2.5 text-xs text-text-0 placeholder:text-text-2/50 outline-none resize-none transition-all hover:border-border-hover focus:border-accent focus:ring-2 focus:ring-accent/15"
                            />
                          </Field>
                        </div>
                      </div>

                      {/* Footer — fixed */}
                      <div className="flex items-center justify-between gap-3 p-5 pt-4 border-t border-border shrink-0 bg-surface-1">
                        {mutation.isError && (
                          <p className="text-[10px] text-live font-medium flex-1">
                            Failed to create. Please try again.
                          </p>
                        )}
                        {!mutation.isError && <div className="flex-1" />}
                        <div className="flex items-center gap-2.5">
                          <Dialog.Close className="rounded-lg border border-border bg-surface-0 px-4 py-2 text-xs font-medium text-text-1 hover:border-border-hover hover:text-text-0 transition-all">
                            Cancel
                          </Dialog.Close>
                          <button
                            onClick={handleSubmit}
                            disabled={mutation.isPending}
                            className="inline-flex items-center gap-1.5 rounded-[10px] bg-accent px-5 py-2 text-xs font-medium text-white hover:bg-accent-hover transition-all disabled:opacity-60 btn-primary-shadow"
                          >
                            {mutation.isPending ? (
                              <Loader2 size={13} className="animate-spin" />
                            ) : (
                              <Plus size={13} />
                            )}
                            {t("tournaments.create")}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
