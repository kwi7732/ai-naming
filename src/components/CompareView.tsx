"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, CheckCircle, Share2, ChevronDown, ChevronUp, Clock, X } from "lucide-react";
import toast from "react-hot-toast";
import type { AIResult, NamingForm, NameSuggestion } from "@/types";

interface Props {
  results: AIResult[];
  prompt: string;
  form: NamingForm;
  sessionId: string;
}

// ── Detail Panel (선택된 이름의 상세 정보) ───────────────────────────────────
function DetailPanel({
  s,
  color,
  lastName,
  onClose,
}: {
  s: NameSuggestion;
  color: string;
  lastName: string;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      style={{ overflow: "hidden" }}
    >
      <div
        className="rounded-2xl"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: `1px solid ${color}33`,
          padding: "2rem",
          marginTop: 16,
        }}
      >
        {/* Detail header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-baseline gap-3 flex-wrap">
            <span
              className="font-serif"
              style={{ fontSize: "1.8rem", fontWeight: 700, color }}
            >
              {lastName}{s.name}
            </span>
            <span style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.5)" }}>
              {s.hanja}{s.hanjaReading ? ` · ${s.hanjaReading}` : ""}
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "50%",
              width: 32,
              height: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "var(--muted)",
              flexShrink: 0,
            }}
          >
            <X size={14} />
          </button>
        </div>

        {/* Detail sections — 3 column on desktop */}
        <div
          className="grid gap-6"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}
        >
          {/* 의미 */}
          <div
            className="rounded-xl"
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
              padding: "1.25rem",
            }}
          >
            <p
              style={{
                fontSize: "0.72rem",
                fontWeight: 700,
                color: "var(--muted)",
                marginBottom: 12,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              의미
            </p>
            <p
              style={{
                fontSize: "0.88rem",
                lineHeight: 1.9,
                color: "rgba(240,246,252,0.85)",
              }}
            >
              {s.meaning}
            </p>
          </div>

          {/* 작명 이야기 */}
          <div
            className="rounded-xl"
            style={{
              background: `${color}08`,
              border: `1px solid ${color}22`,
              padding: "1.25rem",
            }}
          >
            <p
              style={{
                fontSize: "0.72rem",
                fontWeight: 700,
                color,
                marginBottom: 12,
                letterSpacing: "0.05em",
              }}
            >
              ✦ 작명 이야기
            </p>
            <p
              className="font-serif"
              style={{
                fontSize: "0.88rem",
                lineHeight: 1.9,
                color: "rgba(240,246,252,0.9)",
                wordBreak: "keep-all",
              }}
            >
              {s.story}
            </p>
          </div>

          {/* 발음 */}
          <div
            className="rounded-xl"
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
              padding: "1.25rem",
            }}
          >
            <p
              style={{
                fontSize: "0.72rem",
                fontWeight: 700,
                color: "var(--muted)",
                marginBottom: 12,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              발음
            </p>
            <p
              style={{
                fontSize: "0.88rem",
                lineHeight: 1.9,
                color: "rgba(240,246,252,0.75)",
              }}
            >
              {s.pronunciation}
            </p>
          </div>
        </div>

        {/* 덕목 */}
        <div className="flex flex-wrap gap-2 mt-5">
          {s.virtues?.map((v) => (
            <span
              key={v}
              className="virtue-pill"
              style={{
                color,
                borderColor: `${color}44`,
                background: `${color}11`,
                padding: "0.3rem 0.75rem",
                fontSize: "0.78rem",
              }}
            >
              {v}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ── Name Card (그리드 안의 카드) ─────────────────────────────────────────────
function NameCard({
  s,
  i,
  color,
  lastName,
  isSelected,
  onSelect,
}: {
  s: NameSuggestion;
  i: number;
  color: string;
  lastName: string;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <motion.button
      onClick={onSelect}
      className="w-full text-center rounded-2xl"
      style={{
        background: isSelected ? `${color}0c` : "rgba(255,255,255,0.025)",
        border: isSelected ? `2px solid ${color}66` : "1px solid rgba(255,255,255,0.06)",
        padding: "1.5rem 1rem",
        cursor: "pointer",
        transition: "all 0.2s ease",
        outline: "none",
        position: "relative",
      }}
      whileHover={{
        scale: 1.02,
        borderColor: `${color}44`,
      }}
      whileTap={{ scale: 0.98 }}
    >
      {/* 순번 */}
      <span
        style={{
          position: "absolute",
          top: 10,
          left: 12,
          width: 22,
          height: 22,
          borderRadius: "50%",
          background: `${color}18`,
          border: `1px solid ${color}33`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "0.65rem",
          fontWeight: 700,
          color,
        }}
      >
        {i + 1}
      </span>

      {/* 이름 */}
      <span
        className="font-serif block"
        style={{
          fontSize: "1.65rem",
          fontWeight: 700,
          color: isSelected ? color : "var(--white)",
          marginBottom: 6,
          transition: "color 0.2s",
        }}
      >
        {lastName}{s.name}
      </span>

      {/* 한자 + 훈음 */}
      <span
        className="block"
        style={{
          fontSize: "0.78rem",
          color: "rgba(255,255,255,0.4)",
          marginBottom: 12,
        }}
      >
        {s.hanja}{s.hanjaReading ? ` · ${s.hanjaReading}` : ""}
      </span>

      {/* 덕목 */}
      <div className="flex flex-wrap justify-center gap-1.5">
        {s.virtues?.map((v) => (
          <span
            key={v}
            style={{
              fontSize: "0.68rem",
              padding: "0.2rem 0.5rem",
              borderRadius: 99,
              background: `${color}11`,
              border: `1px solid ${color}33`,
              color: isSelected ? color : "rgba(255,255,255,0.45)",
              fontWeight: 500,
              transition: "color 0.2s",
            }}
          >
            {v}
          </span>
        ))}
      </div>

      {/* 선택 indicator */}
      {isSelected && (
        <motion.div
          layoutId="selected-indicator"
          style={{
            position: "absolute",
            bottom: -8,
            left: "50%",
            transform: "translateX(-50%)",
            width: 0,
            height: 0,
            borderLeft: "8px solid transparent",
            borderRight: "8px solid transparent",
            borderTop: `8px solid ${color}66`,
          }}
        />
      )}
    </motion.button>
  );
}

// ── AI Column (한 AI의 결과 전체) ────────────────────────────────────────────
function AIColumn({
  result,
  lastName,
  index,
}: {
  result: AIResult;
  lastName: string;
  index: number;
}) {
  const [copied, setCopied] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(0);

  const handleCopy = () => {
    const text = result.names
      .map(
        (n, i) => `${i + 1}. ${lastName}${n.name} (${n.hanja}) — ${n.meaning}`
      )
      .join("\n");
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      toast.success("이름 목록이 복사되었습니다!");
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const selectedName = result.names[selectedIdx];

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
        className="rounded-xl flex items-center justify-between gap-3"
        style={{
          background: `${result.color}0f`,
          border: `1px solid ${result.color}33`,
          padding: "1.1rem 1.25rem",
          marginBottom: 24,
        }}
      >
        <div>
          <div className="flex items-center gap-2.5" style={{ marginBottom: 6 }}>
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: result.color,
                display: "inline-block",
              }}
            />
            <span
              style={{
                fontWeight: 700,
                fontSize: "1rem",
                color: result.color,
              }}
            >
              {result.label}
            </span>
          </div>
          <div
            className="flex items-center gap-2"
            style={{ color: "var(--muted)", fontSize: "0.72rem", paddingLeft: 22 }}
          >
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
          style={{
            padding: "0.35rem 0.65rem",
            fontSize: "0.72rem",
            borderRadius: 6,
          }}
          id={`copy-${result.model}`}
          title="이름 복사"
        >
          {copied ? (
            <CheckCircle size={13} style={{ color: result.color }} />
          ) : (
            <Copy size={13} />
          )}
        </button>
      </div>

      {/* Error state */}
      {result.error ? (
        <div
          className="rounded-xl p-5 flex flex-col items-center justify-center text-center"
          style={{
            border: "1px dashed rgba(255,255,255,0.08)",
            minHeight: 120,
            gap: 8,
          }}
        >
          <span style={{ fontSize: "1.5rem" }}>🔧</span>
          <p
            style={{
              fontSize: "0.82rem",
              fontWeight: 600,
              color: "var(--white)",
            }}
          >
            현재 준비 중인 전문가입니다
          </p>
          <p
            style={{
              fontSize: "0.74rem",
              color: "var(--muted)",
              lineHeight: 1.6,
              wordBreak: "keep-all",
            }}
          >
            해당 전문가는 아직 서비스 연동 중이에요.
            <br />
            다른 전문가의 추천을 참고해주세요.
          </p>
        </div>
      ) : (
        <>
          {/* 🔥 Name card grid — 반응형 (모바일 1열, 데스크톱 3열) */}
          <div
            style={{
              display: "grid",
              gap: 16,
              gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
            }}
          >
            {result.names.map((n, i) => (
              <NameCard
                key={i}
                s={n}
                i={i}
                color={result.color}
                lastName={lastName}
                isSelected={selectedIdx === i}
                onSelect={() => setSelectedIdx(selectedIdx === i ? -1 : i)}
              />
            ))}
          </div>

          {/* 🔥 Detail panel — 선택된 이름 상세 */}
          <AnimatePresence>
            {selectedName && selectedIdx >= 0 && (
              <DetailPanel
                key={selectedIdx}
                s={selectedName}
                color={result.color}
                lastName={lastName}
                onClose={() => setSelectedIdx(-1)}
              />
            )}
          </AnimatePresence>
        </>
      )}
    </motion.div>
  );
}

// ── Main CompareView ─────────────────────────────────────────────────────────
export default function CompareView({
  results,
  prompt,
  form,
  sessionId,
}: Props) {
  const [activeTab, setActiveTab] = useState<string>(
    results[0]?.model ?? "gpt"
  );
  const [showPrompt, setShowPrompt] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(`${window.location.origin}/share/${sessionId}`)
      .then(() => {
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
      {/* ── Top bar */}
      <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
        <div>
          <h2
            className="font-serif"
            style={{
              fontSize: "1.35rem",
              fontWeight: 700,
              color: "var(--white)",
            }}
          >
            전문가 패널 추천 비교
          </h2>
          <p
            style={{
              fontSize: "0.78rem",
              color: "var(--muted)",
              marginTop: 2,
            }}
          >
            {form.husband.name} ❤️ {form.wife.name} · {form.lastName} 씨 아이
          </p>
        </div>
        <div className="flex gap-2">
          <button
            className="btn btn-ghost"
            style={{
              padding: "0.5rem 0.9rem",
              fontSize: "0.78rem",
              borderRadius: 8,
            }}
            onClick={() => setShowPrompt((v) => !v)}
            id="toggle-prompt"
          >
            {showPrompt ? "프롬프트 숨기기" : "공통 프롬프트 보기"}
          </button>
          <button
            className="btn btn-ghost"
            style={{
              padding: "0.5rem 0.9rem",
              fontSize: "0.78rem",
              borderRadius: 8,
            }}
            onClick={handleCopyLink}
            id="copy-share-link"
          >
            {copiedLink ? (
              <CheckCircle size={14} style={{ color: "var(--gold)" }} />
            ) : (
              <Share2 size={14} />
            )}
          </button>
        </div>
      </div>

      {/* ── Shared prompt preview */}
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
                style={{
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  color: "var(--gold)",
                  marginBottom: 8,
                  textTransform: "uppercase",
                  letterSpacing: "0.07em",
                }}
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

      {/* ── Tab bar (모든 화면) */}
      <div className="flex gap-2 mb-6">
        {results.map((r) => (
          <button
            key={r.model}
            onClick={() => setActiveTab(r.model)}
            className={`btn flex-1 ${
              activeTab === r.model ? "tab-active" : "btn-ghost"
            }`}
            style={{
              padding: "0.6rem 0.5rem",
              fontSize: "0.82rem",
              borderRadius: 10,
              borderColor: activeTab === r.model ? r.color : undefined,
              color: activeTab === r.model ? r.color : undefined,
              background:
                activeTab === r.model ? `${r.color}12` : undefined,
              fontWeight: activeTab === r.model ? 600 : 400,
            }}
            id={`tab-${r.model}`}
          >
            {r.label}
          </button>
        ))}
      </div>

      {/* ── Active tab content */}
      <AnimatePresence mode="wait">
        {results.map((r) =>
          r.model === activeTab ? (
            <AIColumn
              key={r.model}
              result={r}
              lastName={form.lastName}
              index={0}
            />
          ) : null
        )}
      </AnimatePresence>
    </motion.div>
  );
}
