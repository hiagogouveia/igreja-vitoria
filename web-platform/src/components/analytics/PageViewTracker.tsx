"use client";

import { Suspense, useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackPageView } from "@/lib/meta-pixel";

/**
 * Dispara PageView nas navegações client-side do App Router.
 *
 * O código base do Pixel (public/meta-pixel.js) já envia o PageView do
 * carregamento inicial; como o site navega em SPA, sem isto as trocas de rota
 * não seriam contabilizadas.
 *
 * Anti-duplicação: guardamos a última URL registrada. A primeira execução do
 * efeito apenas memoriza a URL inicial (sem disparar, pois o código base já
 * disparou), e execuções repetidas para a MESMA URL são ignoradas — o que
 * também neutraliza o efeito duplo do React Strict Mode.
 */
function Tracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastTracked = useRef<string | null>(null);

  useEffect(() => {
    const query = searchParams?.toString();
    const url = query ? `${pathname}?${query}` : pathname;

    // 1ª execução: o PageView desta URL já foi enviado pelo código base.
    if (lastTracked.current === null) {
      lastTracked.current = url;
      return;
    }
    // Mesma URL (re-render / Strict Mode): não duplica.
    if (lastTracked.current === url) return;

    lastTracked.current = url;
    trackPageView();
  }, [pathname, searchParams]);

  return null;
}

/** useSearchParams exige um limite de Suspense para não desativar a renderização estática. */
export default function PageViewTracker() {
  return (
    <Suspense fallback={null}>
      <Tracker />
    </Suspense>
  );
}
