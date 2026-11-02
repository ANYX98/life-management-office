"use client";

import { motion } from "framer-motion";
import { useState, type ReactNode } from "react";
import { Character } from "@/components/character/Character";
import { CATEGORIES, DEFAULT_CHARACTER, randomCharacter, type CharacterConfig } from "@/lib/character/catalog";

type Props = {
  value: CharacterConfig;
  onChange: (next: CharacterConfig) => void;
  /** 저장/다음 버튼 자리 */
  primaryAction: ReactNode;
  /** 초기화 시 돌아갈 값. 수정 화면에서는 저장돼 있던 모습이다. */
  resetTo?: CharacterConfig;
};

export function CharacterEditor({ value, onChange, primaryAction, resetTo = DEFAULT_CHARACTER }: Props) {
  const [categoryKey, setCategoryKey] = useState(CATEGORIES[0].key);
  const [shot, setShot] = useState(0);
  const category = CATEGORIES.find((item) => item.key === categoryKey) ?? CATEGORIES[0];

  const set = (key: string, id: string) => {
    onChange({ ...value, [key]: id } as CharacterConfig);
    setShot((count) => count + 1);
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[150px_minmax(0,1fr)_minmax(0,380px)] lg:items-start">
      {/* 미리 보기: 모바일에서는 위에 고정되어 고르는 동안 계속 보인다. */}
      <div className="sticky top-1 z-20 lg:static lg:order-2">
        <div className="photo-backdrop paper h-[34dvh] min-h-56 overflow-hidden lg:h-[480px]">
          <motion.div
            key={shot}
            initial={{ scale: 0.95, rotate: -1.5 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 16 }}
            className="absolute inset-2 top-7"
          >
            <Character config={value} size={340} className="block size-full" title="만들고 있는 시민 캐릭터" />
          </motion.div>
          <span className="absolute top-2 left-3 font-hand text-base font-bold">증명사진 촬영 중</span>
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2 lg:mt-5">
          <button
            type="button"
            className="btn"
            onClick={() => {
              onChange(randomCharacter());
              setShot((count) => count + 1);
            }}
          >
            랜덤 꾸미기
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => {
              onChange(resetTo);
              setShot((count) => count + 1);
            }}
          >
            초기화
          </button>
          <span className="hidden lg:contents">{primaryAction}</span>
        </div>
      </div>

      {/* 부위 메뉴 */}
      <nav aria-label="꾸밀 부위" className="-mx-4 overflow-x-auto px-4 lg:order-1 lg:mx-0 lg:overflow-visible lg:px-0">
        <div className="flex w-max gap-1.5 lg:w-auto lg:flex-col" role="tablist">
          {CATEGORIES.map((item) => {
            const active = item.key === categoryKey;
            return (
              <button
                key={item.key}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setCategoryKey(item.key)}
                className={`min-h-11 rounded-[12px_14px_4px_4px] border-[2.5px] border-ink px-3.5 font-display whitespace-nowrap lg:rounded-[4px_14px_14px_4px] lg:text-left ${
                  active ? "bg-mustard" : "bg-sheet"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </nav>

      {/* 아이템 */}
      <div className="lg:order-3">
        <OptionGrid title={category.label} kind={category.kind} configKey={category.key} options={category.options} value={value} onPick={set} />
        {category.swatch && (
          <div className="mt-5">
            <OptionGrid title={category.swatch.label} kind="color" configKey={category.swatch.key} options={category.swatch.options} value={value} onPick={set} />
          </div>
        )}
      </div>

      {/* 모바일 하단 고정 버튼 */}
      <div className="sticky bottom-0 z-20 -mx-4 border-t-[2.5px] border-ink bg-cream px-4 py-3 lg:hidden">
        <div className="grid">{primaryAction}</div>
      </div>
    </div>
  );
}

function OptionGrid({
  title,
  kind,
  configKey,
  options,
  value,
  onPick,
}: {
  title: string;
  kind: "part" | "color";
  configKey: string;
  options: readonly { id: string; label: string }[];
  value: CharacterConfig;
  onPick: (key: string, id: string) => void;
}) {
  const current = (value as unknown as Record<string, string>)[configKey];
  return (
    <fieldset className="m-0 border-0 p-0">
      <legend className="mb-2 p-0 font-display text-lg">{title}</legend>
      <div className={kind === "color" ? "grid grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-4" : "grid grid-cols-3 gap-2 sm:grid-cols-4"}>
        {options.map((option) => {
          const selected = current === option.id;
          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={selected}
              onClick={() => onPick(configKey, option.id)}
              className={`relative grid justify-items-center gap-0.5 rounded-[12px_15px_11px_16px] border-[2.5px] border-ink p-1.5 text-center text-[13px] leading-tight ${
                selected ? "bg-mustard" : "bg-sheet"
              }`}
            >
              {kind === "color" ? (
                <span className="my-1 block size-10 rounded-full border-[2.5px] border-ink" style={{ background: option.id }} />
              ) : (
                <Character config={{ ...value, [configKey]: option.id } as CharacterConfig} size={76} rough={false} title={option.label} />
              )}
              <span className="font-official">{option.label}</span>
              {selected && (
                <span className="thud absolute -top-2 -right-1 rounded-full border-2 border-brick bg-sheet px-1.5 font-display text-[11px] text-brick">
                  선택
                </span>
              )}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
