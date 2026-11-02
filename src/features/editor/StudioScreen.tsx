"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ErrorNote, LoadingNote, NeedRegistration } from "@/components/ui/StateNotes";
import { citizenRepository } from "@/lib/citizen/repository";
import { notifyCitizenChanged, useCitizen } from "@/lib/citizen/useCitizen";
import type { CharacterConfig } from "@/lib/character/catalog";
import { CharacterEditor } from "./CharacterEditor";

export function StudioScreen() {
  const { state, reload } = useCitizen();
  const router = useRouter();
  const [draft, setDraft] = useState<CharacterConfig | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (state.status === "ready") setDraft((current) => current ?? state.citizen.character);
  }, [state]);

  if (state.status === "loading") return <LoadingNote label="촬영실 문을 여는 중입니다" />;
  if (state.status === "error") return <ErrorNote message={state.message} onRetry={reload} />;
  if (state.status === "none") return <NeedRegistration />;
  if (!draft) return <LoadingNote label="촬영실 문을 여는 중입니다" />;

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      await citizenRepository.updateCharacter(draft);
      notifyCitizenChanged();
      router.push("/card");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "저장하지 못했습니다. 다시 시도해 주세요.");
      setSaving(false);
    }
  };

  return (
    <div className="grid gap-4">
      <h1 className="text-[28px]">증명사진 촬영실</h1>
      {error && <p role="alert" className="font-display text-brick">{error}</p>}
      <CharacterEditor
        value={draft}
        onChange={setDraft}
        resetTo={state.citizen.character}
        caseCount={state.citizen.caseCount}
        primaryAction={
          <button type="button" className="btn btn-primary" disabled={saving} onClick={save}>
            {saving ? "저장 중…" : "저장"}
          </button>
        }
      />
    </div>
  );
}
