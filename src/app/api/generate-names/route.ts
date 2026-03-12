import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import { GoogleGenerativeAI } from "@google/generative-ai"; // kept for potential future use
import type { NamingForm, NameSuggestion, AIResult } from "@/types";

// ── Shared prompt builder ─────────────────────────────────────────────────────
// This SAME prompt is sent to every AI — the user can see & compare responses.

export function buildPrompt(form: NamingForm): string {
  const genderLabel =
    form.babyGender === "boy" ? "아들" : form.babyGender === "girl" ? "딸" : "미정";

  return `당신은 한국의 작명 전문가입니다. 아래 부부 정보를 바탕으로 아이의 이름 3가지를 추천해 주세요.

[부부 정보]
• 남편: ${form.husband.name}${form.husband.hanja ? ` (${form.husband.hanja})` : ""}${form.husband.meaning ? ` — 뜻: ${form.husband.meaning}` : ""}
• 아내:  ${form.wife.name}${form.wife.hanja ? ` (${form.wife.hanja})` : ""}${form.wife.meaning ? ` — 뜻: ${form.wife.meaning}` : ""}

[아이 정보]
• 성별: ${genderLabel}
• 성씨: ${form.lastName}
• 출생/예정일: ${form.babyDueDate || "미입력"}

[부부의 소망]
${form.wishes || "건강하고 행복하게 자라나길 바랍니다."}

[이름 선정 기준 — 반드시 최우선으로 고려]
1. 어감의 아름다움: 소리 내어 불렀을 때 부드럽고 맑으며 기억에 남는 이름. 자음·모음의 조화, 리듬감, 받침 유무를 세심하게 고려하세요.
2. 뜻풀이의 서정성: 이름의 뜻을 설명하는 문장 자체가 시처럼 아름다워야 합니다. 단순한 한자 뜻 나열이 아닌, 자연·빛·계절·감정의 이미지를 담아 감동적으로 서술하세요.
${form.excludedNames && form.excludedNames.length > 0
      ? `\n[🚨 중복 및 유사 발음 금지 🚨 — 아래 이름들은 이미 추천받아 거절된 이름들입니다.
- 성씨 포함/미포함 관계없이 완벽히 똑같은 이름은 절대 추천하지 마세요.
- 초성, 중성, 종성이 비슷하여 발음이 유사한 이름도 최대한 피하세요 (예: '도겸' 제외 시 '도경', '동겸' 금지).
- 완전히 새로운 느낌의 이름을 제안해야 합니다.
[제외 목록]: ${form.excludedNames.map(n => `${n} (또는 ${form.lastName}${n})`).join(", ")}\n`
      : ""
    }
[요청]
위 정보를 바탕으로 아이 이름 9가지를 추천하고, 각 이름에 대해:
1. 이름(한글, 성씨 제외)
2. 한자
3. 이름의 뜻과 유래
4. 부부 이름의 한자 의미와 연결한 스토리텔링
5. 발음·음운 설명
6. 이름에 담긴 덕목 3개

[JSON 작성 시 주의사항 - 절대 지킬 것]
1. 아래 JSON 배열 형식으로만 응답하세요. JSON 외 어떤 텍스트도 출력하지 마세요.
2. 값(Value) 내부에 쌍따옴표(")를 절대 사용하지 마세요. (예: '태양'처럼 강조할 때는 작은따옴표(') 사용)
3. name 필드에는 반드시 이름만 넣으세요. 성씨(${form.lastName})를 절대 포함하지 마세요. (예: '서준' ⭕, '${form.lastName}서준' ❌)

[
  {
    "name": "한글 이름 (2글자, 성씨 제외)",
    "hanja": "한자 (예: 智煥)",
    "meaning": "이름의 뜻과 유래 — 시적이고 아름다운 문장으로 (2~3문장)",
    "story": "부부 이름 한자와 연결한 감동적인 스토리텔링 (3~4문장)",
    "pronunciation": "어감 설명 — 소리의 흐름, 부드러움, 리듬감 중심으로 (1~2문장)",
    "virtues": ["덕목1", "덕목2", "덕목3"]
  }
]`;
}

// ── Individual callers ────────────────────────────────────────────────────────

async function callGPT(prompt: string): Promise<{ names: NameSuggestion[]; durationMs: number }> {
  const t = Date.now();
  console.log("[GPT] 입력 프롬프트:\n", prompt);
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const res = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.85,
    max_tokens: 8192,
  });
  const raw = (res.choices[0].message.content ?? "[]").replace(/```json|```/g, "").trim();
  const result = { names: JSON.parse(raw), durationMs: Date.now() - t };
  console.log(`[GPT] ✅ 완료 ${result.durationMs}ms — 이름 ${result.names.length}개 생성`);
  return result;
}

async function callClaude(prompt: string): Promise<{ names: NameSuggestion[]; durationMs: number }> {
  const t = Date.now();
  console.log("[Claude] 입력 프롬프트:\n", prompt);
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const msg = await client.messages.create({
    model: "claude-haiku-4-5",
    max_tokens: 8192,
    messages: [{ role: "user", content: prompt }],
  });
  const raw = (msg.content[0].type === "text" ? msg.content[0].text : "[]")
    .replace(/```json|```/g, "").trim();
  const result = { names: JSON.parse(raw), durationMs: Date.now() - t };
  console.log(`[Claude] ✅ 완료 ${result.durationMs}ms — 이름 ${result.names.length}개 생성`);
  return result;
}

async function callGemini(prompt: string): Promise<{ names: NameSuggestion[]; durationMs: number }> {
  const t = Date.now();
  console.log("[Gemini] 입력 프롬프트:\n", prompt);

  const key = process.env.GEMINI_API_KEY ?? "";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": key,
    },
    // 강제로 JSON 포맷 응답 지시 (Gemini 1.5+ 지원 설정 활용)
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.85,
        maxOutputTokens: 8192,
        responseMimeType: "application/json"
      },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini ${res.status}: ${err}`);
  }

  const json = await res.json();
  let raw = (json.candidates?.[0]?.content?.parts?.[0]?.text ?? "[]");

  // 마크다운 코드 블록 제거 및 찌꺼기 텍스트 정리
  raw = raw.replace(/```json/gi, "").replace(/```/g, "").trim();

  // Gemini가 문자열 내분에 따옴표(")를 이스케이프 처리 없이 써서 깨지는 경우를 대비
  // 가장 흔한 원인인 Unterminated string 오류 완화 (완벽하진 않으나 대부분 해결)
  // 정규식으로 안전하게 처리하기 어려우므로, 프롬프트에서 더 강력하게 지시하는 것이 최선임

  let names = [];
  try {
    names = JSON.parse(raw);
  } catch (e) {
    console.error("[Gemini] JSON 파싱 실패! 넘어온 원본 텍스트:\n", raw);

    // 마지막 시도: 만약 JSON이 중간에 짤렸다면 (Unterminated string) 강제로 닫아봄
    if (e instanceof SyntaxError && e.message.includes("Unterminated string")) {
      try {
        const mended = raw + '"} \n]';
        names = JSON.parse(mended);
        console.warn("[Gemini] 강제로 JSON을 닫아서 파싱 성공함");
      } catch (mendedError) {
        throw new Error(`Gemini JSON 파싱 오류(복구 불가): ${e.message}\n응답 원문: ${raw.slice(0, 100)}...`);
      }
    } else {
      throw new Error(`Gemini JSON 파싱 오류: ${e instanceof Error ? e.message : String(e)}`);
    }
  }

  const parsed = { names, durationMs: Date.now() - t };
  console.log(`[Gemini] ✅ 완료 ${parsed.durationMs}ms`);
  return parsed;
}

async function callGrok(prompt: string): Promise<{ names: NameSuggestion[]; durationMs: number }> {
  const t = Date.now();
  console.log("[Grok] 입력 프롬프트:\n", prompt);
  const client = new OpenAI({
    apiKey: process.env.XAI_API_KEY,
    baseURL: "https://api.x.ai/v1",
  });
  const res = await client.chat.completions.create({
    model: "grok-4-fast",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.85,
    max_tokens: 8192,
  });
  const raw = (res.choices[0].message.content ?? "[]").replace(/```json|```/g, "").trim();
  const result = { names: JSON.parse(raw), durationMs: Date.now() - t };
  console.log(`[Grok] ✅ 완료 ${result.durationMs}ms — 이름 ${result.names.length}개 생성`);
  return result;
}

// ── Telegram notification ───────────────────────────────────────────────────

function sendTelegramAlert(form: NamingForm, results: AIResult[]): void {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  const genderMap = { boy: "👦 아들", girl: "👧 딸", unknown: "🤍 미정" };
  const kst = new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" });

  const statusLine = results
    .map((r) => {
      const status = r.error ? "❌ 실패" : `✅ ${(r.durationMs / 1000).toFixed(1)}s`;
      const namesList = r.names?.length
        ? r.names.map(n => `${form.lastName}${n.name}(${n.hanja})`).join(", ")
        : "없음";
      return `  • ${r.label}: ${status}\n    → ${namesList}`;
    })
    .join("\n");

  const text = [
    `🔔 *작명 의뢰 접수*`,
    ``,
    `👫 *부모 정보*`,
    `  남편: ${form.husband.name}${form.husband.hanja ? ` (${form.husband.hanja})` : ""}`,
    `  아내: ${form.wife.name}${form.wife.hanja ? ` (${form.wife.hanja})` : ""}`,
    ``,
    `👶 *아이 정보*`,
    `  성씨: ${form.lastName} / 성별: ${genderMap[form.babyGender]}`,
    form.babyDueDate ? `  출생 예정일: ${form.babyDueDate}` : null,
    ``,
    `📝 *추천 이름*`,
    statusLine,
    ``,
    `🕐 ${kst}`,
  ]
    .filter((l) => l !== null)
    .join("\n");

  // fire-and-forget — 응답 속도에 영향 없음
  fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: "Markdown" }),
  }).catch((e) => console.warn("[Telegram] 알림 실패:", e));
}

// ── Route ─────────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const { form }: { form: NamingForm } = await req.json();
    if (!form?.husband?.name || !form?.wife?.name || !form?.lastName) {
      return NextResponse.json({ error: "필수 입력값이 누락되었습니다." }, { status: 400 });
    }

    const prompt = buildPrompt(form);

    // Fire all four in parallel with the SAME prompt
    const [gptRes, claudeRes, geminiRes, grokRes] = await Promise.allSettled([
      callGPT(prompt),
      callClaude(prompt),
      callGemini(prompt),
      callGrok(prompt),
    ]);

    const toResult = (
      r: PromiseSettledResult<{ names: NameSuggestion[]; durationMs: number }>,
      model: AIResult["model"],
      label: string,
      vendor: string,
      color: string
    ): AIResult => {
      // AI가 name에 성씨를 포함시킨 경우 자동 제거 (예: "김서준" → "서준")
      const cleanedNames = r.status === "fulfilled"
        ? r.value.names.map(n => ({
            ...n,
            name: n.name.startsWith(form.lastName)
              ? n.name.slice(form.lastName.length)
              : n.name
          }))
        : [];

      return {
        model,
        label,
        vendor,
        color,
        names: cleanedNames,
        error: r.status === "rejected" ? String(r.reason) : null,
        durationMs: r.status === "fulfilled" ? r.value.durationMs : 0,
      };
    };

    const results: AIResult[] = [
      toResult(gptRes, "gpt", "GPT-4o mini", "OpenAI", "#10a37f"),
      toResult(claudeRes, "claude", "Claude 3.5 Haiku", "Anthropic", "#cc785c"),
      toResult(geminiRes, "gemini", "Gemini 2.0 Flash", "Google", "#4285f4"),
      toResult(grokRes, "grok", "Grok", "xAI", "#1d9bf0"),
    ];

    // 각 AI 오류 콘솔 출력
    for (const [label, res] of [
      ["GPT", gptRes],
      ["Claude", claudeRes],
      ["Gemini", geminiRes],
      ["Grok", grokRes],
    ] as [string, PromiseSettledResult<{ names: NameSuggestion[]; durationMs: number }>][]) {
      if (res.status === "rejected") {
        console.error(`[${label}] ❌ 오류:`, res.reason);
      }
    }

    const sessionId = `naming_${Date.now()}`;
    sendTelegramAlert(form, results);
    return NextResponse.json({ results, prompt, sessionId });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
