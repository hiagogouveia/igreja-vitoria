/**
 * Meta Pixel — utilitários para eventos.
 *
 * O código base (init + PageView) é carregado globalmente por
 * `public/meta-pixel.js` através de `components/analytics/MetaPixel.tsx`.
 * Este módulo existe para que eventos futuros sejam plugados sem refatoração:
 *
 *   import { trackEvent } from "@/lib/meta-pixel";
 *   trackEvent("Lead");
 *   trackEvent("Purchase", { value: 159, currency: "BRL" });
 *
 * Nenhum evento é disparado automaticamente aqui.
 */

/** ID oficial do Pixel da Igreja Vitória. */
export const FB_PIXEL_ID = "2266189376864307";

type PixelParams = Record<string, unknown>;

/** Eventos padrão da Meta mais prováveis para este site (autocompletar/typo-safety). */
export type MetaStandardEvent =
  | "ViewContent"
  | "CompleteRegistration"
  | "Lead"
  | "Purchase"
  | "Contact"
  | "Search"
  | "Subscribe"
  | "PageView";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

/** true quando o Pixel já está disponível no browser. */
function ready(): boolean {
  return typeof window !== "undefined" && typeof window.fbq === "function";
}

/** Dispara um evento PADRÃO da Meta. Ex.: trackEvent("Lead"). */
export function trackEvent(name: MetaStandardEvent, params?: PixelParams): void {
  if (!ready()) return;
  window.fbq!("track", name, params);
}

/** Dispara um evento CUSTOMIZADO (nome livre, fora da lista padrão da Meta). */
export function trackCustom(name: string, params?: PixelParams): void {
  if (!ready()) return;
  window.fbq!("trackCustom", name, params);
}

/**
 * PageView manual. O código base já dispara um PageView no carregamento —
 * use isto apenas se um dia quisermos registrar também as navegações
 * client-side (SPA) do App Router.
 */
export function trackPageView(): void {
  trackEvent("PageView");
}
