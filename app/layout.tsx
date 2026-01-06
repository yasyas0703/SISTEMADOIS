import type { Metadata } from "next";
import { SistemaProvider } from "@/app/context/SistemaContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sistema de Abertura",
  description: "Gerenciamento de Processos e Departamentos",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <SistemaProvider>
          {children}
        </SistemaProvider>
      </body>
    </html>
  );
}
