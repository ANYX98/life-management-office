import { isSupabaseConfigured } from "@/lib/supabase/client";
import { guestRepository } from "./guestRepository";
import { supabaseRepository } from "./supabaseRepository";
import type { CitizenRepository } from "./types";

/** 환경 변수가 있으면 Supabase, 없으면 이 브라우저의 게스트 저장소를 쓴다. */
export const citizenRepository: CitizenRepository = isSupabaseConfigured ? supabaseRepository : guestRepository;
