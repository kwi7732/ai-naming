import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "AI 작명소 — 세 AI가 동시에 짓는 이름",
  description: "GPT, Claude, Gemini에 동일한 조건을 입력하고 세 AI의 작명 결과를 나란히 비교하세요.",
  keywords: ["AI 작명소", "아기 이름", "한자 이름", "ChatGPT", "Claude", "Gemini"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "#21262d",
              color: "#f0f6fc",
              border: "1px solid rgba(255,255,255,0.08)",
              fontFamily: "Inter, Noto Sans KR, sans-serif",
              fontSize: "0.875rem",
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
