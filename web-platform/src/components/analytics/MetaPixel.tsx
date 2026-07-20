import Script from "next/script";
import { FB_PIXEL_ID } from "@/lib/meta-pixel";

/**
 * Meta Pixel — instalado UMA única vez, globalmente, pelo layout raiz.
 *
 * O código base oficial vive em `public/meta-pixel.js` (fonte única, também
 * reaproveitada pelas páginas estáticas de /public), então o snippet não é
 * duplicado. `strategy="afterInteractive"` é a recomendação do Next.js para
 * analytics: carrega logo após a hidratação, sem bloquear a renderização.
 */
export default function MetaPixel() {
  return (
    <>
      <Script src="/meta-pixel.js" strategy="afterInteractive" />
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          alt=""
          src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  );
}
