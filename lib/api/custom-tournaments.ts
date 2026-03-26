import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase";

/* ── Types ── */

export interface CustomTournament {
  id: string;
  name: string;
  game: string;
  format: string;
  team_size: number;
  max_teams: number;
  prizepool: string | null;
  begin_at: string;
  end_at: string | null;
  description: string | null;
  region: string;
  created_at: string;
}

export type CreateTournamentInput = Omit<CustomTournament, "id" | "created_at">;

export interface TournamentTeam {
  id: string;
  tournament_id: string;
  name: string;
  tag: string;
  captain_name: string;
  captain_email: string;
  captain_discord: string | null;
  created_at: string;
  players?: TournamentPlayer[];
}

export interface TournamentPlayer {
  id: string;
  team_id: string;
  tournament_id: string;
  name: string;
  role: string | null;
  rank: string | null;
  is_substitute: boolean;
  created_at: string;
}

export interface RegisterTeamInput {
  tournament_id: string;
  name: string;
  tag: string;
  captain_name: string;
  captain_email: string;
  captain_discord?: string;
  players: Array<{
    name: string;
    role?: string;
    rank?: string;
    is_substitute?: boolean;
  }>;
}

/* ── Tournament hooks ── */

export function useCustomTournaments() {
  return useQuery<CustomTournament[]>({
    queryKey: ["custom-tournaments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("custom_tournaments")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    staleTime: 30_000,
  });
}

export function useCustomTournament(id: string) {
  return useQuery<CustomTournament>({
    queryKey: ["custom-tournament", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("custom_tournaments")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data as CustomTournament;
    },
    enabled: !!id,
    staleTime: 30_000,
  });
}

export function useCreateTournament() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateTournamentInput) => {
      const { data, error } = await supabase
        .from("custom_tournaments")
        .insert(input)
        .select()
        .single();
      if (error) throw error;
      return data as CustomTournament;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["custom-tournaments"] });
    },
  });
}

/* ── Team hooks ── */

export function useTournamentTeams(tournamentId: string) {
  return useQuery<TournamentTeam[]>({
    queryKey: ["tournament-teams", tournamentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tournament_teams")
        .select("*")
        .eq("tournament_id", tournamentId)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!tournamentId,
    staleTime: 15_000,
  });
}

export function useTournamentPlayers(tournamentId: string) {
  return useQuery<TournamentPlayer[]>({
    queryKey: ["tournament-players", tournamentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tournament_players")
        .select("*")
        .eq("tournament_id", tournamentId)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!tournamentId,
    staleTime: 15_000,
  });
}

export function useRegisterTeam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: RegisterTeamInput) => {
      // 1. Insert team
      const { data: team, error: teamError } = await supabase
        .from("tournament_teams")
        .insert({
          tournament_id: input.tournament_id,
          name: input.name,
          tag: input.tag,
          captain_name: input.captain_name,
          captain_email: input.captain_email,
          captain_discord: input.captain_discord || null,
        })
        .select()
        .single();

      if (teamError) throw teamError;

      // 2. Insert players
      const playersToInsert = input.players
        .filter((p) => p.name.trim())
        .map((p) => ({
          team_id: team.id,
          tournament_id: input.tournament_id,
          name: p.name.trim(),
          role: p.role || null,
          rank: p.rank || null,
          is_substitute: p.is_substitute || false,
        }));

      if (playersToInsert.length > 0) {
        const { error: playersError } = await supabase
          .from("tournament_players")
          .insert(playersToInsert);
        if (playersError) throw playersError;
      }

      return team as TournamentTeam;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["tournament-teams", variables.tournament_id] });
      queryClient.invalidateQueries({ queryKey: ["tournament-players", variables.tournament_id] });
    },
  });
}
