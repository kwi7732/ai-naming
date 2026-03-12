"use client";

import { motion } from "framer-motion";
import type { AIResult, NameSuggestion } from "@/types";
import { Share2, Copy, CheckCircle, ChevronDown } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

interface NameCardProps {
  result: AIResult;
  index: number;
  lastName: string;
  sessionId: string;
}

function VirtueTag({ virtue }: { virtue: string }) {
  return (
    <span
      className="inline-block px-2.5 py-1 rounded-full text-xs font-medium"
      style={{
        background: "rgba(201,169,110,0.12)",
        color: "var(--color-gold-dark)",
        border: "1px solid rgba(201,169,110,0.25)",
      }}
    >
      {virtue}
    </span>
  );
}

function SingleNameCard({
  suggestion,
  lastName,
  color,
  index,
}: {
  suggestion: NameSuggestion;
  lastName: string;
  color: string;
  index: number;
}) {
  const [expanded, setExpanded] = useState(index === 0);

  return (
    <motion.div
      className="name-card card-hover mb-4 cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.12, duration: 0.5 }}
      style={{ borderTop: `4px solid ${color}` }}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="p-5 md:p-6">
        {/* Name header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-baseline gap-3 mb-1">
              <span
                className="font-serif-kr text-4xl font-bold"
                style={{ color }}
              >
                {lastName}{suggestion.name}
              </span>
              <span
                className="text-base font-medium"
                style={{ color: "var(--color-ink-light)", fontFamily: "'Noto Serif KR', serif" }}
              >
                {suggestion.hanja}
              </span>
            </div>
            <p className="text-sm" style={{ color: "var(--color-ink-light)" }}>
              {suggestion.pronunciation}
            </p>
          </div>
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown size={20} style={{ color: "var(--color-gold)" }} />
          </motion.div>
        </div>

        {/* Virtues */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {suggestion.virtues?.map((v) => <VirtueTag key={v} virtue={v} />)}
        </div>

        {/* Expanded content */}
        <motion.div
          initial={false}
          animate={{ height: expanded ? "auto" : 0, opacity: expanded ? 1 : 0 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          style={{ overflow: "hidden" }}
        >
          <div className="mt-4 pt-4" style={{ borderTop: "1px solid rgba(201,169,110,0.15)" }}>
            {/* Meaning */}
            <div className="mb-3">
              <p className="text-xs font-semibold mb-1" style={{ color: "var(--color-gold-dark)" }}>
                ✦ 이름의 뜻
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "var(--color-ink)" }}>
                {suggestion.meaning}
              </p>
            </div>
            {/* Story */}
            <div
              className="p-4 rounded-xl"
              style={{ background: "rgba(201,169,110,0.07)", border: "1px solid rgba(201,169,110,0.12)" }}
            >
              <p className="text-xs font-semibold mb-2" style={{ color: "var(--color-gold-dark)" }}>
                📖 작명 스토리
              </p>
              <p
                className="text-sm leading-loose font-serif-kr"
                style={{ color: "var(--color-ink)", wordBreak: "keep-all" }}
              >
                {suggestion.story}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function NameCard({ result, index, lastName, sessionId }: NameCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    const shareUrl = `${window.location.origin}/share/${sessionId}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      toast.success("링크가 복사되었습니다!");
      setTimeout(() => setCopied(false), 3000);
    });
  };

  const handleKakaoShare = () => {
    const shareUrl = `${window.location.origin}/share/${sessionId}`;
    if (typeof window !== "undefined" && (window as any).Kakao?.isInitialized?.()) {
      (window as any).Kakao.Share.sendDefault({
        objectType: "text",
        text: `AI 작명소가 추천한 이름: ${result.names.map((n) => `${lastName}${n.name}`).join(", ")}`,
        link: { mobileWebUrl: shareUrl, webUrl: shareUrl },
      });
    } else {
      // Fallback: copy the link
      handleCopyLink();
      toast("카카오 SDK 없이 링크를 복사했습니다.", { icon: "📋" });
    }
  };

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
  };

  if (result.error || result.names.length === 0) {
    return (
      <motion.div
        className="glass rounded-2xl p-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.2 }}
      >
        <div className="text-4xl mb-3">{result.persona.emoji}</div>
        <h3 className="font-serif-kr text-xl font-bold mb-1" style={{ color: result.persona.color }}>
          {result.persona.name}
        </h3>
        <p className="text-sm" style={{ color: "var(--color-ink-light)" }}>
          {result.error ? "이 AI가 일시적으로 응답하지 않습니다." : "추천 이름을 생성하지 못했습니다."}
        </p>
      </motion.div>
    );
  }

  return (
    <motion.section
      className="mb-10"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Persona header */}
      <motion.div
        className="glass rounded-2xl p-5 mb-4 flex items-center gap-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.15 }}
        style={{
          borderLeft: `5px solid ${result.persona.color}`,
          boxShadow: `var(--shadow-soft)`,
        }}
      >
        <span className="text-3xl">{result.persona.emoji}</span>
        <div className="flex-1">
          <div className="flex items-baseline gap-2 flex-wrap">
            <h2
              className="font-serif-kr text-xl font-bold"
              style={{ color: result.persona.color }}
            >
              {result.persona.name}
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-full" style={{
              background: `${result.persona.color}22`,
              color: result.persona.color,
              border: `1px solid ${result.persona.color}44`,
            }}>
              {result.persona.title}
            </span>
          </div>
          <p className="text-xs mt-0.5" style={{ color: "var(--color-ink-light)" }}>
            {result.philosophy}
          </p>
        </div>
        {/* Share buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleKakaoShare}
            className="p-2 rounded-full transition-all hover:scale-110"
            style={{ background: "#FEE500", color: "#3A1D1D" }}
            title="카카오톡 공유"
            id={`kakao-share-${index}`}
          >
            <Share2 size={14} />
          </button>
          <button
            onClick={handleCopyLink}
            className="p-2 rounded-full transition-all hover:scale-110"
            style={{ background: "rgba(201,169,110,0.15)", color: "var(--color-gold-dark)" }}
            title="링크 복사"
            id={`copy-link-${index}`}
          >
            {copied ? <CheckCircle size={14} /> : <Copy size={14} />}
          </button>
        </div>
      </motion.div>

      {/* Name cards */}
      {result.names.map((name, i) => (
        <SingleNameCard
          key={i}
          suggestion={name}
          lastName={lastName}
          color={result.persona.color}
          index={i}
        />
      ))}
    </motion.section>
  );
}
