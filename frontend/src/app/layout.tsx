import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Freetracker",
  description: "Onboard clients, track scope",
};

export default function RootLayout({ children }: {children: React.ReactNode; }) {
  return (
    <html lang="en">
      <head>
        <link href='https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600&family=Inter:wght@400;500;600&display=swap' rel='stylesheet'/>
      </head>
      <body className="font-body">{children}</body>
    </html>
  );
}
