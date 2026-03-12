"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, Sparkles } from "lucide-react";
import InputForm from "@/components/InputForm";
import CompareView from "@/components/CompareView";
import LoadingState from "@/components/LoadingState";
import { getMockResults } from "@/lib/mockData";
import type { NamingForm, AIResult } from "@/types";
import toast from "react-hot-toast";

type Page = "home" | "loading" | "results";

const isDev = process.env.NODE_ENV === "development";

export default function Home() {
  const [page, setPage] = useState<Page>("home");
  const [results, setResults] = useState<AIResult[]>([]);
  const [prompt, setPrompt] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [formSnap, setFormSnap] = useState<NamingForm | null>(null);
  const [pageIndex, setPageIndex] = useState(0); // 현재 보여주는 3개 묶음의 인덱스

  const handleSubmit = async (form: NamingForm, isLoadMore = false) => {
    if (!isLoadMore) {
      setFormSnap(form);
      setPageIndex(0);
    }
    setPage("loading");
    try {
      let data: { results: AIResult[]; prompt: string; sessionId: string };

      if (isDev) {
        // 🔧 로컬 개발: Mock 데이터 사용 (API 호출 없음)
        await new Promise((r) => setTimeout(r, 1000));
        data = getMockResults();
      } else {
        // 🚀 프로덕션: 실제 API 호출
        const res = await fetch("/api/generate-names", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ form }),
        });
        if (!res.ok) {
          const e = await res.json().catch(() => ({}));
          throw new Error(e.error || "서버 오류");
        }
        data = await res.json();
      }

      setResults(data.results);
      setPrompt(data.prompt);
      setSessionId(data.sessionId);
      if (isLoadMore) {
        setPageIndex(0);
      }
      setPage("results");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "오류 발생");
      setPage("home");
    }
  };

  const handleLoadMore = () => {
    if (!formSnap) return;
    
    const nextIndex = pageIndex + 1;
    const nextStart = nextIndex * 3;
    
    // 성공한 AI들 중에서 다음 페이지에 보여줄 이름이 1개라도 남아있는지 확인
    const hasMoreNames = results.some(r => (r.names?.length ?? 0) > nextStart);
    
    if (hasMoreNames) {
      // 캐시에 아직 보여줄 이름이 있으면 즉시 표시 (API 호출 없음)
      setPageIndex(nextIndex);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // 캐시가 완전히 고갈되었으면 API 새로 호출
      // 현재까지 모인 모든 이름들을 excludedNames에 담아서 중복 방지
      const allSeenNames = results.flatMap(r => r.names?.map(n => n.name) || []);
      const uniqueExcluded = Array.from(new Set([
        ...(formSnap.excludedNames || []),
        ...allSeenNames
      ]));
      
      const newForm = { ...formSnap, excludedNames: uniqueExcluded };
      setFormSnap(newForm);
      handleSubmit(newForm, true);
    }
  };

  const reset = () => { setPage("home"); setResults([]); setPrompt(""); setPageIndex(0); setFormSnap(null); };

  return (
    <main className="relative z-10 min-h-screen flex flex-col">
      {/* ── Header ───────────────────────────────────── */}
      <header
        className="text-center px-4"
        style={{ padding: page === "home" ? "2.5rem 1rem 1.5rem" : "1rem 1rem 0.5rem" }}
      >
        <motion.div
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* badge — 홈에서만 */}
          {page === "home" && (
            <div
              className="inline-flex items-center gap-1.5 mb-4"
              style={{
                padding: "0.3rem 0.85rem",
                borderRadius: 99,
                background: "rgba(201,169,110,0.1)",
                border: "1px solid rgba(201,169,110,0.25)",
                fontSize: "0.72rem",
                fontWeight: 600,
                color: "var(--gold)",
                letterSpacing: "0.03em",
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--gold)", display: "inline-block" }} />
              4인의 작명 전문가 패널
            </div>
          )}

          <h1
            className="font-serif text-gradient"
            style={{
              fontSize: page === "home" ? "clamp(2rem, 6vw, 3rem)" : "clamp(1.1rem, 3vw, 1.4rem)",
              fontWeight: 700,
              lineHeight: 1.2,
            }}
          >
            AI 작명소
          </h1>

          {/* 설명 — 홈에서만 */}
          {page === "home" && (
            <p
              className="font-serif"
              style={{
                fontSize: "clamp(0.82rem, 2vw, 0.95rem)",
                color: "var(--muted)",
                marginTop: "0.6rem",
                lineHeight: 1.7,
                wordBreak: "keep-all",
              }}
            >
              4인의 작명 전문가가 각자의 감각으로 이름을 제안합니다 — 비교하고 직접 선택하세요
            </p>
          )}
        </motion.div>

        {/* AI brand pills — 홈에서만 */}
        {page === "home" && (
          <motion.div
            className="flex items-center justify-center gap-2 mt-4 flex-wrap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {[
              { label: "GPT-4o mini", color: "#10a37f", dot: true },
              { label: "Claude 3.5 Haiku", color: "#cc785c", dot: true },
              { label: "Gemini 2.0 Flash", color: "#4285f4", dot: true },
              { label: "Grok", color: "#1d9bf0", dot: true },
            ].map((ai) => (
              <span
                key={ai.label}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "0.28rem 0.75rem",
                  borderRadius: 99,
                  background: `${ai.color}12`,
                  border: `1px solid ${ai.color}30`,
                  fontSize: "0.72rem",
                  color: ai.color,
                  fontWeight: 500,
                }}
              >
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: ai.color, display: "inline-block" }} />
                {ai.label}
              </span>
            ))}
          </motion.div>
        )}
      </header>

      {/* ── Divider ──────────────────────────────────── */}
      <div style={{ height: 1, background: "rgba(255,255,255,0.05)", width: "100%", margin: "0 0 1.5rem" }} />

      {/* ── Content ──────────────────────────────────── */}
      <div className="flex-1 w-full pb-16" style={{ maxWidth: 980, margin: "0 auto", paddingLeft: 24, paddingRight: 24 }}>
        <AnimatePresence mode="wait">
          {page === "home" && (
            <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <InputForm onSubmit={handleSubmit} isLoading={false} />
            </motion.div>
          )}

          {page === "loading" && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <LoadingState />
            </motion.div>
          )}

          {page === "results" && formSnap && (
            <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <CompareView
                results={results.map(r => ({
                  ...r,
                  names: (r.names || []).slice(pageIndex * 3, (pageIndex + 1) * 3)
                }))}
                prompt={prompt}
                form={formSnap}
                sessionId={sessionId}
              />
              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
                <button
                  onClick={handleLoadMore}
                  className="btn"
                  style={{
                    padding: "0.85rem 1.8rem",
                    borderRadius: 99,
                    fontSize: "0.95rem",
                    fontWeight: 500,
                    gap: "0.5rem",
                    background: "var(--primary)",
                    color: "white",
                  }}
                >
                  <Sparkles size={16} /> 동일한 정보로 더 추천받기
                </button>
                <button
                  onClick={reset}
                  className="btn btn-ghost"
                  style={{
                    padding: "0.85rem 1.8rem",
                    borderRadius: 99,
                    fontSize: "0.95rem",
                    gap: "0.4rem",
                    color: "var(--muted)"
                  }}
                  id="reset-btn"
                >
                  <RefreshCw size={15} /> 정보 수정해서 다시 하기
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Footer ───────────────────────────────────── */}
      <footer style={{ textAlign: "center", padding: "1.5rem 1rem", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <p style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.2)" }}>
          작명 결과는 참고용이며, 전문 명리학자의 감수를 권장합니다
        </p>
      </footer>
    </main>
  );
}
