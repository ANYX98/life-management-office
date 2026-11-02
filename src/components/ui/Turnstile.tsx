"use client";

import { useEffect, useRef } from "react";

export const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

type TurnstileApi = {
  render: (element: HTMLElement, options: Record<string, unknown>) => string;
  remove: (id: string) => void;
};

/** 키가 없으면 아무것도 그리지 않는다. 키가 있으면 통과 토큰을 onToken으로 넘긴다. */
export function Turnstile({ onToken }: { onToken: (token: string | null) => void }) {
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!TURNSTILE_SITE_KEY) return;
    let widgetId: string | null = null;
    let alive = true;
    const mount = () => {
      const api = (window as unknown as { turnstile?: TurnstileApi }).turnstile;
      if (!alive || !api || !box.current) return;
      widgetId = api.render(box.current, {
        sitekey: TURNSTILE_SITE_KEY,
        callback: (token: string) => onToken(token),
        "expired-callback": () => onToken(null),
        "error-callback": () => onToken(null),
      });
    };
    const ID = "cf-turnstile-script";
    const existing = document.getElementById(ID);
    if (existing) {
      if ((window as unknown as { turnstile?: TurnstileApi }).turnstile) mount();
      else existing.addEventListener("load", mount);
    } else {
      const script = document.createElement("script");
      script.id = ID;
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.addEventListener("load", mount);
      document.head.appendChild(script);
    }
    return () => {
      alive = false;
      const api = (window as unknown as { turnstile?: TurnstileApi }).turnstile;
      if (widgetId && api) api.remove(widgetId);
    };
  }, [onToken]);

  if (!TURNSTILE_SITE_KEY) return null;
  return <div ref={box} className="min-h-[65px]" />;
}
