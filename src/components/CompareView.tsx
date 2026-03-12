"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, CheckCircle, Share2, ChevronDown, ChevronUp, Clock } from "lucide-react";
import toast from "react-hot-toast";
import type { AIResult, NamingForm, NameSuggestion } from "@/types";

interface Props {
  results: AIResult[];
  prompt: string;
  form: NamingForm;
  sessionId: string;
}

// ── Single name card inside a column ────────────────────────────────────────
function NameCard({
  s,
  i,
  color,
  lastName,
}: {
  s: NameSuggestion;
  i: number;
  color: string;
  lastName: string;
}) {
  const [open, setOpen] = useState(i === 0);

  return (
    <div
      className="mb-3 rounded-xl overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: `1px solid rgba(255,255,255,0.06)`,
        transition: "border-color 0.2s",
      }}
    >
      {/* Header row */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full text-left flex items-start justify-between gap-3 p-4"
        style={{ background: "transparent", border: "none", cursor: "pointer" }}
        id={`name-toggle-${i}`}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span
              className="font-serif"
              style={{ fontSize: "1.5rem", fontWeight: 700, color }}
            >
              {lastName}{s.name}
            </span>
            <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.45)" }}>
              {s.hanja}
            </span>
          </div>
          {/* Virtues */}
          <div className="flex flex-wrap gap-1 mt-1.5">
            {s.virtues?.map((v) => (
              <span
                key={v}
                className="virtue-pill"
                style={{
                  color,
                  borderColor: `${color}44`,
                  background: `${color}11`,
                }}
              >
                {v}
              </span>
            ))}
          </div>
        </div>
        <span style={{ color: "var(--muted)", paddingTop: 2, flexShrink: 0 }}>
          {open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </span>
      </button>

      {/* Expanded */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ overflow: "hidden" }}
          >
            <div
              className="px-4 pb-4 space-y-3"
              style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
            >
              <div className="pt-3">
                <p style={{ fontSize: "0.68rem", fontWeight: 700, color: "var(--muted)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>의미</p>
                <p style={{ fontSize: "0.83rem", lineHeight: 1.75, color: "rgba(240,246,252,0.85)" }}>{s.meaning}</p>
              </div>
              <div
                className="rounded-lg p-3"
                style={{ background: `${color}0d`, border: `1px solid ${color}22` }}
              >
                <p style={{ fontSize: "0.68rem", fontWeight: 700, color, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>스토리</p>
                <p className="font-serif" style={{ fontSize: "0.82rem", lineHeight: 1.8, color: "rgba(240,246,252,0.9)", wordBreak: "keep-all" }}>
                  {s.story}
                </p>
              </div>
              <div>
                <p style={{ fontSize: "0.68rem", fontWeight: 700, color: "var(--muted)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>발음</p>
                <p style={{ fontSize: "0.8rem", color: "rgba(240,246,252,0.7)" }}>{s.pronunciation}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── AI result column ─────────────────────────────────────────────────────────
function AIColumn({ result, lastName, index }: { result: AIResult; lastName: string; index: number }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = result.names
      .map((n, i) => `${i + 1}. ${lastName}${n.name} (${n.hanja}) — ${n.meaning}`)
      .join("\n");
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      toast.success("이름 목록이 복사되었습니다!");
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <motion.div
      className="flex flex-col"
      style={{ minWidth: 0 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      {/* Column header */}
      <div
        className="rounded-xl p-4 mb-3 flex items-center justify-between gap-3"
        style={{
          background: `${result.color}0f`,
          border: `1px solid ${result.color}33`,
        }}
      >
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: result.color, display: "inline-block" }} />
            <span style={{ fontWeight: 700, fontSize: "0.9rem", color: result.color }}>
              {result.label}
            </span>
          </div>
          <div className="flex items-center gap-2" style={{ color: "var(--muted)", fontSize: "0.7rem" }}>
            <span>{result.vendor}</span>
            {result.durationMs > 0 && (
              <>
                <span>·</span>
                <Clock size={10} />
                <span>{(result.durationMs / 1000).toFixed(1)}s</span>
              </>
            )}
          </div>
        </div>
        <button
          onClick={handleCopy}
          className="btn btn-ghost"
          style={{ padding: "0.35rem 0.65rem", fontSize: "0.72rem", borderRadius: 6 }}
          id={`copy-${result.model}`}
          title="이름 복사"
        >
          {copied ? <CheckCircle size={13} style={{ color: result.color }} /> : <Copy size={13} />}
        </button>
      </div>

      {/* Names */}
      {result.error ? (
        <div
          className="rounded-xl p-5 flex flex-col items-center justify-center text-center"
          style={{ border: "1px dashed rgba(255,255,255,0.08)", minHeight: 120, gap: 8 }}
        >
          <span style={{ fontSize: "1.5rem" }}>🔧</span>
          <p style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--white)" }}>
            현재 준비 중인 전문가입니다
          </p>
          <p style={{ fontSize: "0.74rem", color: "var(--muted)", lineHeight: 1.6, wordBreak: "keep-all" }}>
            해당 전문가는 아직 서비스 연동 중이에요.<br />
            다른 전문가의 추천을 참고해주세요.
          </p>
        </div>
      ) : (
        result.names.map((n, i) => (
          <NameCard key={i} s={n} i={i} color={result.color} lastName={lastName} />
        ))
      )}
    </motion.div>
  );
}

// ── Main CompareView ─────────────────────────────────────────────────────────
export default function CompareView({ results, prompt, form, sessionId }: Props) {
  const [activeTab, setActiveTab] = useState<string>(results[0]?.model ?? "gpt");
  const [showPrompt, setShowPrompt] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/share/${sessionId}`).then(() => {
      setCopiedLink(true);
      toast.success("공유 링크 복사!");
      setTimeout(() => setCopiedLink(false), 2500);
    });
  };

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45 }}
    >
      {/* ── Top bar ─────────────────────────────────── */}
      <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
        <div>
          <h2 className="font-serif" style={{ fontSize: "1.35rem", fontWeight: 700, color: "var(--white)" }}>
                        전문가 패널 추천 비교
          </h2>
          <p style={{ fontSize: "0.78rem", color: "var(--muted)", marginTop: 2 }}>
            {form.husband.name} ❤️ {form.wife.name} · {form.lastName} 씨 아이
          </p>
        </div>
        <div className="flex gap-2">
          <button
            className="btn btn-ghost"
            style={{ padding: "0.5rem 0.9rem", fontSize: "0.78rem", borderRadius: 8 }}
            onClick={() => setShowPrompt((v) => !v)}
            id="toggle-prompt"
          >
            {showPrompt ? "프롬프트 숨기기" : "공통 프롬프트 보기"}
          </button>
          <button
            className="btn btn-ghost"
            style={{ padding: "0.5rem 0.9rem", fontSize: "0.78rem", borderRadius: 8 }}
            onClick={handleCopyLink}
            id="copy-share-link"
          >
            {copiedLink ? <CheckCircle size={14} style={{ color: "var(--gold)" }} /> : <Share2 size={14} />}
          </button>
        </div>
      </div>

      {/* ── Shared prompt preview ────────────────────── */}
      <AnimatePresence>
        {showPrompt && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ overflow: "hidden", marginBottom: 20 }}
          >
            <div
              className="rounded-xl p-4"
              style={{
                background: "var(--navy-2)",
                border: "1px solid var(--gold-dim)",
              }}
            >
              <p
                style={{ fontSize: "0.68rem", fontWeight: 700, color: "var(--gold)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.07em" }}
              >
               ✦ 4인의 전문가에게 동일하게 전송된 프롬프트
              </p>
              <pre
                style={{
                  fontSize: "0.75rem",
                  color: "rgba(240,246,252,0.7)",
                  lineHeight: 1.75,
                  whiteSpace: "pre-wrap",
                  fontFamily: "Inter, monospace",
                }}
              >
                {prompt}
              </pre>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Desktop: 3-column ────────────────────────── */}
      <div
        className="hidden md:grid gap-4"
        style={{ gridTemplateColumns: "repeat(4, 1fr)" }}
      >
        {results.map((r, i) => (
          <AIColumn key={r.model} result={r} lastName={form.lastName} index={i} />
        ))}
      </div>

      {/* ── Mobile: tabs ─────────────────────────────── */}
      <div className="md:hidden">
        {/* Tab bar */}
        <div className="flex gap-2 mb-4">
          {results.map((r) => (
            <button
              key={r.model}
              onClick={() => setActiveTab(r.model)}
              className={`btn flex-1 ${activeTab === r.model ? "tab-active" : "btn-ghost"}`}
              style={{
                padding: "0.55rem 0.4rem",
                fontSize: "0.78rem",
                borderRadius: 8,
                borderColor: activeTab === r.model ? r.color : undefined,
                color: activeTab === r.model ? r.color : undefined,
                background: activeTab === r.model ? `${r.color}12` : undefined,
              }}
              id={`tab-${r.model}`}
            >
              {r.label.split(" ")[0]}
            </button>
          ))}
        </div>
        {/* Active tab content */}
        {results.map((r) =>
          r.model === activeTab ? (
            <AIColumn key={r.model} result={r} lastName={form.lastName} index={0} />
          ) : null
        )}
      </div>
    </motion.div>
  );
}
