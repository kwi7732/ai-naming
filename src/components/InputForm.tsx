"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, User } from "lucide-react";
import type { NamingForm } from "@/types";

interface Props {
  onSubmit: (form: NamingForm) => void;
  isLoading: boolean;
}

export default function InputForm({ onSubmit, isLoading }: Props) {
  const [form, setForm] = useState<NamingForm>({
    husband: { name: "", hanja: "", meaning: "" },
    wife:    { name: "", hanja: "", meaning: "" },
    babyGender: "unknown",
    babyDueDate: "",
    lastName: "",
    wishes: "",
  });

  const set = <K extends keyof NamingForm>(k: K, v: NamingForm[K]) =>
    setForm((p) => ({ ...p, [k]: v }));

  const setParent = (
    who: "husband" | "wife",
    field: "name" | "hanja" | "meaning",
    v: string
  ) => setForm((p) => ({ ...p, [who]: { ...p[who], [field]: v } }));

  const canSubmit = form.husband.name.trim() && form.wife.name.trim() && form.lastName.trim();

  return (
    <motion.form
      onSubmit={(e) => { e.preventDefault(); if (canSubmit) onSubmit(form); }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full"
      style={{ maxWidth: 680, margin: "0 auto" }}
    >
      {/* ── 부모 정보 ───────────────────────────────── */}
      <div
        className="card-glass p-5 mb-3"
        style={{ borderRadius: 14 }}
      >
        <p className="label mb-4" style={{ fontSize: "0.7rem", letterSpacing: "0.08em" }}>
          👫 부부 정보
        </p>

        {/* 남편 */}
        <div className="mb-4">
          <div className="flex items-center gap-1.5 mb-2">
            <User size={12} style={{ color: "#10a37f" }} />
            <span style={{ fontSize: "0.72rem", fontWeight: 600, color: "#10a37f" }}>남편</span>
          </div>
          <div className="grid gap-2" style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
            <input id="h-name"    className="field" placeholder="이름 (필수)"  value={form.husband.name}    onChange={(e) => setParent("husband","name",e.target.value)}    required />
            <input id="h-hanja"   className="field" placeholder="한자 (선택)"  value={form.husband.hanja}   onChange={(e) => setParent("husband","hanja",e.target.value)}   />
            <input id="h-meaning" className="field" placeholder="뜻 (선택)"    value={form.husband.meaning} onChange={(e) => setParent("husband","meaning",e.target.value)} />
          </div>
        </div>

        {/* 아내 */}
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <User size={12} style={{ color: "#cc785c" }} />
            <span style={{ fontSize: "0.72rem", fontWeight: 600, color: "#cc785c" }}>아내</span>
          </div>
          <div className="grid gap-2" style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
            <input id="w-name"    className="field" placeholder="이름 (필수)"  value={form.wife.name}    onChange={(e) => setParent("wife","name",e.target.value)}    required />
            <input id="w-hanja"   className="field" placeholder="한자 (선택)"  value={form.wife.hanja}   onChange={(e) => setParent("wife","hanja",e.target.value)}   />
            <input id="w-meaning" className="field" placeholder="뜻 (선택)"    value={form.wife.meaning} onChange={(e) => setParent("wife","meaning",e.target.value)} />
          </div>
        </div>
      </div>

      {/* ── 아이 정보 ───────────────────────────────── */}
      <div className="card-glass p-5 mb-3" style={{ borderRadius: 14 }}>
        <p className="label mb-4" style={{ fontSize: "0.7rem", letterSpacing: "0.08em" }}>
          👶 아이 정보
        </p>
        <div className="grid gap-3" style={{ gridTemplateColumns: "1fr 1fr" }}>
          {/* 성씨 */}
          <div>
            <label className="label">성씨 <span style={{color:"#f87171"}}>*</span></label>
            <input
              id="baby-lastname"
              className="field"
              placeholder="예: 김 (金)"
              value={form.lastName}
              onChange={(e) => set("lastName", e.target.value)}
              required
            />
          </div>
          {/* 날짜 */}
          <div>
            <label className="label">출생 / 예정일</label>
            <input
              id="baby-date"
              type="date"
              className="field"
              value={form.babyDueDate}
              onChange={(e) => set("babyDueDate", e.target.value)}
            />
          </div>
          {/* 성별 (span 2) */}
          <div style={{ gridColumn: "1 / -1" }}>
            <label className="label">성별</label>
            <div className="flex gap-2">
              {([
                { value:"boy",     label:"👦 아들", color:"#9bbfd4" },
                { value:"girl",    label:"👧 딸",   color:"#f6a8a0" },
                { value:"unknown", label:"🤍 미정", color:"#c9a96e" },
              ] as const).map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  id={`gender-${opt.value}`}
                  onClick={() => set("babyGender", opt.value)}
                  className="btn flex-1"
                  style={{
                    padding: "0.55rem 0.5rem",
                    fontSize: "0.82rem",
                    background: form.babyGender === opt.value ? `${opt.color}22` : "transparent",
                    border: `1.5px solid ${form.babyGender === opt.value ? opt.color : "rgba(255,255,255,0.07)"}`,
                    color: form.babyGender === opt.value ? opt.color : "var(--muted)",
                    borderRadius: 8,
                    transition: "all 0.18s",
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── 소망 ────────────────────────────────────── */}
      <div className="card-glass p-5 mb-4" style={{ borderRadius: 14 }}>
        <label className="label" style={{ fontSize:"0.7rem", letterSpacing:"0.08em" }}>
          💌 아이에게 담고 싶은 소망 / 가치관
        </label>
        <textarea
          id="wishes"
          className="field mt-1"
          style={{ minHeight: 90, fontSize: "0.875rem" }}
          placeholder="예: 지혜롭고 따뜻한 마음을 가진 아이로 자라나길 바랍니다. 어떤 어려움에서도 빛나는 사람이 되길..."
          value={form.wishes}
          onChange={(e) => set("wishes", e.target.value)}
        />
      </div>

      {/* ── Submit ──────────────────────────────────── */}
      <motion.button
        type="submit"
        className="btn btn-gold w-full"
        style={{ padding: "0.85rem", fontSize: "0.95rem", borderRadius: 10 }}
        disabled={!canSubmit || isLoading}
        whileHover={{ scale: canSubmit && !isLoading ? 1.015 : 1 }}
        whileTap={{ scale: 0.98 }}
        id="submit-btn"
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            4인의 전문가가 작명 중
            <span style={{ display:"flex", gap:3 }}>
              <span className="dot" style={{ background:"#10a37f" }} />
              <span className="dot" style={{ background:"#cc785c" }} />
              <span className="dot" style={{ background:"#4285f4" }} />
            </span>
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Sparkles size={16} />
            4인의 작명 전문가에게 의뢰하기
          </span>
        )}
      </motion.button>

      {/* note */}
      <p className="text-center mt-3" style={{ fontSize:"0.72rem", color:"var(--muted)" }}>
        GPT · Claude · Gemini · Grok 전문가 4인이 각자의 감각으로 이름을 제안합니다
      </p>
    </motion.form>
  );
}
