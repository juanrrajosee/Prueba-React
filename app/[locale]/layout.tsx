import "../globals.scss";
import { Sedan, Sedan_SC } from "next/font/google";

const sedan = Sedan({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-sedan",
});

const sedanSC = Sedan_SC({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-sedan-sc",
});

export const metadata = {
  title: "Login Santuario",
  description: "Página mágica de acceso",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${sedan.variable} ${sedanSC.variable}`}>
      <body>{children}</body>
    </html>
  );
}
