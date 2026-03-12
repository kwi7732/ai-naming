// ── Form input ────────────────────────────────────────────────────
export interface ParentInfo {
  name: string;    // 이름 (한글)
  hanja: string;   // 한자
  meaning: string; // 한자 뜻
}

export interface NamingForm {
  husband: ParentInfo;
  wife: ParentInfo;
  babyGender: "boy" | "girl" | "unknown";
  babyDueDate: string;
  lastName: string;
  wishes: string;
  excludedNames?: string[]; // 이미 추천받았던 이름들 (중복 방지용)
}

// ── Per-name result ───────────────────────────────────────────────
export interface NameSuggestion {
  name: string;          // 이름 (한글, 성씨 제외)
  hanja: string;         // 한자 표기
  hanjaReading: string;  // 한자 훈음 (예: "슬기 지, 비 우")
  meaning: string;       // 뜻 설명
  story: string;         // 부부 이름과 연결한 스토리텔링
  pronunciation: string; // 발음·음운 설명
  virtues: string[];     // 담긴 덕목
}

// ── Per-AI result ─────────────────────────────────────────────────
export type AIModel = "gpt" | "claude" | "gemini" | "grok";

export interface AIResult {
  model: AIModel;
  label: string;      // "GPT-4o mini"
  vendor: string;     // "OpenAI"
  color: string;      // CSS color
  names: NameSuggestion[];
  error: string | null;
  durationMs: number;
}

// ── API ───────────────────────────────────────────────────────────
export interface GenerateRequest {
  form: NamingForm;
}

export interface GenerateResponse {
  results: AIResult[];
  prompt: string;   // 공개되는 공통 프롬프트 (사용자가 확인 가능)
  sessionId: string;
}
