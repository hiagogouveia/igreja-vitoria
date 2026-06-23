import type { Metadata } from "next";
import "./globals.css";
import RevealManager from "@/components/site/RevealManager";

export const metadata: Metadata = {
  title: "Igreja Vitória · Campo Grande — MS",
  description:
    "Igreja Vitória · Campo Grande — MS. Uma igreja formada de pessoas imperfeitas, mas que amam um Deus que é Perfeito. Cultos aos domingos 18h (Culto da Família) e quartas 19h30 (Quarta Flow). Encontre fé, propósito e família.",
  metadataBase: new URL("https://igreja-vitoria.vercel.app"),
  openGraph: {
    type: "website",
    siteName: "Igreja Vitória",
    title: "Igreja Vitória · Campo Grande — MS",
    description:
      "Encontre Deus. Viva em família. Transforme sua história. Cultos aos domingos 18h e quartas 19h30 em Campo Grande — MS.",
    images: ["/assets/worship-arms.jpg"],
    locale: "pt_BR",
  },
  twitter: { card: "summary_large_image" },
  icons: { icon: "/logo-v-final.png" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&family=Archivo:wght@500;600;700;800;900&family=Archivo+Expanded:wght@600;700;800;900&family=Pirata+One&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <meta name="theme-color" content="#050505" />
      </head>
      <body className="antialiased">
        {children}
        <RevealManager />
      </body>
    </html>
  );
}
