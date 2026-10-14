import type { Metadata } from "next";
import { Archivo, Hanken_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import RevealManager from "@/components/site/RevealManager";
import MetaPixel from "@/components/analytics/MetaPixel";

// Fontes servidas pelo próprio site (sem pedido ao Google na abertura da página).
// O "Archivo Expanded" do design é o Archivo no eixo de largura: font-stretch 125%.
const archivo = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--f-head", display: "swap" });
const hanken = Hanken_Grotesk({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--f-body", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--f-mono", display: "swap" });

const DESCRICAO =
  "Igreja apaixonada por Jesus em Campo Grande, MS. Cultos no domingo às 18h e na quarta às 19h30, na Rua Marechal Rondon, 163.";

export const metadata: Metadata = {
  title: "Igreja Vitória · Campo Grande, MS",
  description: DESCRICAO,
  metadataBase: new URL("https://www.igrejavitoriacg.com.br"),
  openGraph: {
    type: "website",
    siteName: "Igreja Vitória",
    title: "Igreja Vitória · Campo Grande, MS",
    description: DESCRICAO,
    images: ["/assets/worship-arms.jpg"],
    locale: "pt_BR",
  },
  twitter: { card: "summary_large_image" },
  // Favicon: gerado pelas convenções de arquivo do App Router
  // (src/app/icon.png, apple-icon.png, favicon.ico).
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning className={`${archivo.variable} ${hanken.variable} ${mono.variable}`}>
      <head>
        <meta name="theme-color" content="#050505" />
      </head>
      <body className="antialiased">
        {children}
        <RevealManager />
        <MetaPixel />
      </body>
    </html>
  );
}
