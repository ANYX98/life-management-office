import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 text-ink no-underline" aria-label="인생관리공단 광장으로">
      <span className="grid size-10 shrink-0 place-items-center rounded-full border-[2.5px] border-ink bg-potato font-display text-[15px] leading-none" aria-hidden>
        공단
      </span>
      <span className="leading-tight">
        <span className="block font-display text-xl">인생관리공단</span>
        <span className="hidden font-official text-[10px] tracking-wide text-ink-soft sm:block">LIFE MANAGEMENT OFFICE</span>
      </span>
    </Link>
  );
}
