import type { Metadata } from "next";
import "./globals.css";
import "./responsive.css";

export const metadata: Metadata = {
  title: "你是《美國女孩》中的哪個角色？｜中興國際星空電影節",
  description: "用 5 個問題，看看你與哪一種愛與歸屬最靠近。",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-Hant">
      <body>{children}</body>
    </html>
  );
}
