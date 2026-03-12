import type { AIResult } from "@/types";

const mockNames = [
  {
    name: "서윤",
    hanja: "瑞潤",
    hanjaReading: "상서로울 서, 윤택할 윤",
    meaning: "상서로운 기운이 촉촉하게 스며드는 이름. 이슬에 젖은 새벽 풀잎처럼, 세상을 부드럽게 적시는 존재가 되길 바랍니다.",
    story: "부부의 이름에 담긴 깊은 뜻처럼, 아이도 세상에 맑은 기운을 전하는 사람이 되길 소망합니다. 서로를 아끼는 부부의 사랑이 아이에게도 고스란히 전해져, 따스한 마음을 가진 사람으로 자라날 것입니다.",
    pronunciation: "'서'의 부드러운 입김과 '윤'의 둥근 울림이 어우러져, 부르는 이에게 포근한 여운을 남깁니다.",
    virtues: ["지혜", "온화함", "넉넉함"],
  },
  {
    name: "하율",
    hanja: "夏律",
    hanjaReading: "여름 하, 법칙 율",
    meaning: "여름날의 리듬처럼 생동감 넘치는 이름. 자연의 질서 속에서 자유롭게 춤추는 아이의 모습을 담았습니다.",
    story: "부부가 함께 걸어온 길의 조화로움이 아이의 이름에 스며들어, 세상과 조화를 이루며 살아가는 사람이 되길 바라는 마음을 담았습니다.",
    pronunciation: "'하'의 탁 트인 개방감과 '율'의 경쾌한 리듬감이 만나, 밝고 활기찬 인상을 줍니다.",
    virtues: ["활력", "조화", "자유"],
  },
  {
    name: "윤서",
    hanja: "允書",
    hanjaReading: "허락할 윤, 글 서",
    meaning: "하늘이 허락한 아름다운 글처럼, 세상에 의미 있는 이야기를 써내려갈 존재. 맑은 마음으로 세상을 읽어갈 아이입니다.",
    story: "부부의 이름이 품고 있는 진실됨과 따뜻함이 아이에게 전해져, 진심 어린 말과 글로 세상을 감동시키는 사람이 될 것입니다.",
    pronunciation: "'윤'의 둥글고 부드러운 첫 음절이 '서'의 차분한 마무리와 만나, 우아하고 정갈한 어감을 선사합니다.",
    virtues: ["진실", "학문", "감성"],
  },
  {
    name: "도겸",
    hanja: "道謙",
    hanjaReading: "길 도, 겸손할 겸",
    meaning: "바른 길을 걸으며 겸손함을 잃지 않는 이름. 산길에 피어난 작은 들꽃처럼, 낮은 자리에서도 빛나는 존재입니다.",
    story: "부부의 삶에서 배운 겸손과 성실함을 아이에게 물려주어, 어떤 높은 곳에 올라서도 초심을 잃지 않는 사람이 되길 바랍니다.",
    pronunciation: "'도'의 단단한 시작과 '겸'의 부드러운 마무리가 조화를 이루며, 듬직하면서도 다정한 인상을 줍니다.",
    virtues: ["겸손", "성실", "인내"],
  },
  {
    name: "시온",
    hanja: "時溫",
    hanjaReading: "때 시, 따뜻할 온",
    meaning: "때를 알고 따뜻함을 전하는 이름. 봄볕이 대지를 깨우듯, 적절한 때에 온기를 나누는 지혜로운 존재입니다.",
    story: "부부가 서로에게 주었던 따뜻한 위로처럼, 아이도 주변 사람들에게 때맞춘 온기를 전하는 사람으로 자라나길 소망합니다.",
    pronunciation: "'시'의 맑고 가벼운 시작이 '온'의 포근한 울림으로 이어져, 듣는 이에게 안정감을 줍니다.",
    virtues: ["지혜", "따뜻함", "배려"],
  },
  {
    name: "채원",
    hanja: "彩源",
    hanjaReading: "빛날 채, 근원 원",
    meaning: "빛나는 색채의 근원이 되는 이름. 무지개가 하늘을 물들이듯, 세상에 다채로운 아름다움을 선사하는 존재입니다.",
    story: "부부의 사랑이라는 아름다운 물감으로 탄생한 아이가 세상이라는 캔버스 위에 자신만의 색을 펼쳐나가길 바라는 마음을 담았습니다.",
    pronunciation: "'채'의 화사하고 경쾌한 소리와 '원'의 깊고 둥근 울림이 조화를 이루어, 밝으면서도 깊이 있는 인상을 줍니다.",
    virtues: ["창의성", "아름다움", "근원"],
  },
  {
    name: "지안",
    hanja: "智安",
    hanjaReading: "슬기 지, 편안할 안",
    meaning: "슬기로운 지혜로 평안을 이루는 이름. 고요한 호수처럼 깊은 지혜를 품고, 주변에 평화를 선사하는 존재입니다.",
    story: "부부가 함께 이루어온 평온한 가정의 기운이 아이에게도 전해져, 어디에서든 마음의 안식을 찾고 나누는 사람이 되길 바랍니다.",
    pronunciation: "'지'의 또렷한 시작과 '안'의 편안한 마무리가 만나, 지적이면서도 포근한 느낌을 전합니다.",
    virtues: ["지혜", "평화", "안정"],
  },
  {
    name: "예준",
    hanja: "禮俊",
    hanjaReading: "예도 예, 준걸 준",
    meaning: "예의를 아는 빼어난 인재라는 뜻의 이름. 봄날의 매화처럼 고결하면서도 따뜻한 품격을 지닌 존재입니다.",
    story: "부부의 이름에서 느껴지는 단아함과 강인함이 아이에게 고스란히 전해져, 안팎으로 균형 잡힌 멋진 사람이 될 것입니다.",
    pronunciation: "'예'의 맑은 울림과 '준'의 힘찬 마무리가 어우러져, 단정하면서도 활력 있는 인상을 줍니다.",
    virtues: ["예의", "품격", "용기"],
  },
  {
    name: "소율",
    hanja: "素律",
    hanjaReading: "바탕 소, 법칙 율",
    meaning: "순수한 바탕에 아름다운 리듬을 담은 이름. 아침 이슬이 풀잎 위에서 빛나듯, 꾸밈없는 아름다움으로 세상을 밝힙니다.",
    story: "부부의 순수한 사랑에서 태어난 아이가 자신만의 리듬으로 인생이라는 아름다운 음악을 연주해나가길 소망합니다.",
    pronunciation: "'소'의 맑고 가벼운 시작이 '율'의 경쾌한 율동감으로 이어져, 상쾌하고 기분 좋은 어감을 선사합니다.",
    virtues: ["순수", "자연", "조화"],
  },
];

export function getMockResults(): { results: AIResult[]; prompt: string; sessionId: string } {
  // 9개 이름을 4개 AI에 각각 분배 (섞어서)
  const shuffle = <T,>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);

  const results: AIResult[] = [
    {
      model: "gpt",
      label: "GPT-4o mini",
      vendor: "OpenAI",
      color: "#10a37f",
      names: shuffle(mockNames).slice(0, 9),
      error: null,
      durationMs: 3200 + Math.floor(Math.random() * 2000),
    },
    {
      model: "claude",
      label: "Claude 3.5 Haiku",
      vendor: "Anthropic",
      color: "#cc785c",
      names: shuffle(mockNames).slice(0, 9),
      error: null,
      durationMs: 4100 + Math.floor(Math.random() * 3000),
    },
    {
      model: "gemini",
      label: "Gemini 2.0 Flash",
      vendor: "Google",
      color: "#4285f4",
      names: shuffle(mockNames).slice(0, 9),
      error: null,
      durationMs: 2800 + Math.floor(Math.random() * 2000),
    },
    {
      model: "grok",
      label: "Grok",
      vendor: "xAI",
      color: "#1d9bf0",
      names: shuffle(mockNames).slice(0, 9),
      error: null,
      durationMs: 5200 + Math.floor(Math.random() * 3000),
    },
  ];

  return {
    results,
    prompt: "[DEV 모드] 실제 API 호출 없이 Mock 데이터를 사용합니다.",
    sessionId: `mock_${Date.now()}`,
  };
}
