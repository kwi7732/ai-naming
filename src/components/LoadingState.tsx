"use client";

import { motion } from "framer-motion";

const EXPERT_LIST = [
  { label: "GPT-4o mini", vendor: "OpenAI", color: "#10a37f" },
  { label: "Claude 3.5", vendor: "Anthropic", color: "#cc785c" },
  { label: "Gemini 2.0", vendor: "Google", color: "#4285f4" },
  { label: "Grok", vendor: "xAI", color: "#1d9bf0" },
];

export default function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center" style={{ padding: "5rem 1rem" }}>
      {/* Pulsing orb */}
      <div className="relative mb-10" style={{ width: 80, height: 80 }}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-full"
            style={{ border: "1px solid rgba(201,169,110,0.4)" }}
            animate={{ scale: [1, 1.5 + i * 0.2], opacity: [0.6, 0] }}
            transition={{ duration: 2, delay: i * 0.5, repeat: Infinity, ease: "easeOut" }}
          />
        ))}
        <div
          className="absolute inset-0 rounded-full flex items-center justify-center font-serif"
          style={{
            background: "rgba(201,169,110,0.1)",
            border: "1px solid rgba(201,169,110,0.3)",
            fontSize: "2rem",
            color: "var(--gold)",
          }}
        >
          名
        </div>
      </div>

      <h3 className="font-serif mb-2" style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--white)" }}>
        4인의 작명 전문가가 정성을 담고 있습니다
      </h3>
      <p style={{ fontSize: "0.8rem", color: "var(--muted)", marginBottom: "2.5rem" }}>
        각자의 감각으로 이름을 연구하는 중입니다
      </p>

      {/* AI progress indicators */}
      <div className="flex flex-col gap-3 w-full" style={{ maxWidth: 320 }}>
        {EXPERT_LIST.map((ai, i) => (
          <div key={ai.label} className="flex items-center gap-3">
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: ai.color, flexShrink: 0 }} />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span style={{ fontSize: "0.78rem", color: "var(--white)", fontWeight: 500 }}>{ai.label}</span>
                <span style={{ fontSize: "0.7rem", color: "var(--muted)" }}>{ai.vendor}</span>
              </div>
              {/* Progress bar */}
              <div style={{ height: 3, borderRadius: 2, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                <motion.div
                  style={{ height: "100%", borderRadius: 2, background: ai.color, width: "0%" }}
                  animate={{ width: ["0%", "70%", "85%", "92%"] }}
                  transition={{
                    duration: 8,
                    delay: i * 0.3,
                    ease: [0.4, 0, 0.2, 1],
                    repeat: Infinity,
                    repeatType: "loop",
                  }}
                />
              </div>
            </div>
            {/* Dots */}
            <span style={{ display: "flex", gap: 3 }}>
              {[0, 1, 2].map((d) => (
                <span
                  key={d}
                  className="dot"
                  style={{ background: ai.color, animationDelay: `${i * 0.2 + d * 0.15}s`, width: 5, height: 5 }}
                />
              ))}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
