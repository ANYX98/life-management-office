import type { CategoryId } from "./content";

/**
 * 규칙형 판정: AI 없이 진술 속 단어로 맞는 문구를 고른다. 글은 외부로 나가지 않는다.
 * - {word}는 글에서 찾은 단어로 바뀐다. 조사가 어색해지지 않게 '{word}' 건 형태로 쓴다.
 * - gentle은 농담하면 안 되는 일이다. 칭호도, 에너지 안내도 붙이지 않는다.
 * - 새 주제는 RULES에 추가하면 된다. 말투 원칙은 lib/daily/content.ts 상단을 따른다.
 */
export type StatementRule = {
  id: string;
  /** 민원 유형을 고르지 않았을 때 칭호 집계에 쓸 유형 */
  category?: CategoryId;
  keywords: readonly string[];
  titles: readonly string[];
  verdicts: readonly string[];
  dispositions: readonly string[];
};

export const GENTLE_RULE: StatementRule = {
  id: "gentle",
  keywords: ["장례", "돌아가셨", "돌아가시", "돌아가셔", "세상을떠", "사망", "암진단", "암이래", "응급실", "수술", "폭행", "성추행", "성폭력", "성희롱", "학폭", "왕따", "괴롭힘", "괴롭혀", "스토킹", "가정폭력", "유산했"],
  titles: ["접수 기록"],
  verdicts: ["이 건은 공단이 농담으로 처리하지 않겠습니다. 적어 주신 내용, 다 읽었습니다."],
  dispositions: ["도장은 찍지 않습니다. 혼자 들고 있기 무거우면 믿을 만한 사람이나 전문 기관에 넘기십시오."],
};

/** 긍정 글에는 다른 주제보다 이 문구를 먼저 쓴다. */
export const GOOD_RULE: StatementRule = {
  id: "good",
  keywords: ["좋았", "행복", "기뻤", "기뻐", "즐거", "재밌었", "재미있었", "신났", "뿌듯", "맛있었", "설렜"],
  titles: ["좋은 일 접수 사건", "이상 없음 보고 사건", "공단 전례 드문 사건"],
  verdicts: ["아 네. 좋으셨군요.", "그러세요. 잘됐네요.", "네, 자랑으로 접수했습니다.", "그렇군요. 공단은 할 일이 없습니다."],
  dispositions: ["별도 처분 없음.", "그대로 두십시오.", "서랍에 넣어 둡니다.", "끝."],
};

const NEGATIVE_NEARBY = ["안좋", "안 좋", "않았", "싫", "짜증", "힘들", "못 ", "최악", "좋았는데", "좋았지만"];

/** 지친 마음이 보이는 글. "안 궁금합니다"류를 쓰지 않고, 무심하되 짐을 덜어 준다. */
export const TIRED_RULE: StatementRule = {
  id: "tired",
  keywords: ["외로", "우울", "슬퍼", "슬펐", "힘들", "지쳐", "지쳤", "눈물", "울었", "무서", "불안", "혼자", "서러", "괴로", "허무", "막막"],
  titles: ["접수 건", "오늘 자 진술 사건", "서랍 보관 사건"],
  verdicts: ["네, 그렇군요. 들었습니다.", "그랬군요. 적어 두었습니다.", "네. 공단이 읽었습니다.", "그렇군요. 더 묻지 않겠습니다."],
  dispositions: ["오늘 못 한 일들은 전부 뒤 창고에서 태워 버렸습니다. 없는 걸로 합시다.", "할 일 목록은 공단 마당에 묻었습니다. 위치는 저도 모릅니다.", "오늘 받은 평가 서류는 전량 파쇄했습니다. 복사본도 없습니다.", "오늘 업무는 여기서 끝입니다.", "오늘 못 한 일은 없는 걸로 합니다.", "이 서류는 공단이 들고 있겠습니다.", "해결 기한은 없습니다."],
};

export const RULES: readonly StatementRule[] = [
  {
    id: "poop",
    keywords: ["똥", "응가", "화장실", "방귀", "변비", "설사", "대변"],
    titles: ["배변 보고 사건", "공단이 묻지 않은 사건", "화장실 관련 불필요 보고 사건"],
    verdicts: ["네, 그렇군요. 저희는 안 궁금합니다.", "아 그러세요.", "'{word}' 건이요. 왜 저희한테 말씀하시는 겁니까.", "네. 접수는 했습니다. 안 궁금합니다."],
    dispositions: ["물 내리십시오.", "처분 없음. 상세 보고도 사양합니다.", "손 씻으십시오.", "끝."],
  },
  {
    id: "weather",
    keywords: ["날씨", "비가", "비 와", "비와", "눈이", "눈 와", "우산", "더워", "더웠", "추워", "추웠", "미세먼지", "장마", "태풍"],
    titles: ["기상 민원 사건", "날씨 관할 착오 사건", "우산 판단 착오 사건"],
    verdicts: ["네, 날씨가 그랬군요.", "'{word}' 건이요. 아 그러세요.", "그건 기상청에 말씀하십시오.", "저희도 창밖은 봤습니다."],
    dispositions: ["별도 처분 없음.", "날씨 탓으로 처리합니다.", "우산은 알아서 챙기십시오.", "끝."],
  },
  {
    id: "job",
    category: "job",
    keywords: ["면접", "불합격", "탈락", "자소서", "자기소개서", "취업", "취준", "이력서", "채용", "인턴", "토익", "떨어졌", "서류전형", "서류 전형"],
    titles: ["취업 절차 해석 불능 사건", "'귀하의 뛰어난 역량에도' 수신 사건", "채용 공고 해독 사건"],
    verdicts: ["'{word}' 건이요. 그렇군요.", "네, 들었습니다.", "그건 회사 사정입니다.", "아 그러세요. 회사가 그렇습니다."],
    dispositions: ["불합격 통보서는 창고에서 태웠습니다. 잘 타더군요.", "자소서 성장 과정란은 찢어 버렸습니다. 그런 칸은 없는 걸로 합시다.", "오늘 지원 업무는 끝입니다.", "합격 여부 칸은 공단 서류에 없습니다.", "저녁이나 드십시오.", "처분 없음."],
  },
  {
    id: "school",
    keywords: ["시험", "과제", "학점", "교수", "수업", "팀플", "졸업", "휴학", "중간고사", "기말", "레포트", "리포트", "공강"],
    titles: ["학사 일정 충돌 사건", "과제 숙성 사건", "시험 범위 미확인 사건"],
    verdicts: ["'{word}' 건이요. 네.", "아 그러세요. 학교가 그렇습니다.", "그렇군요. 공단은 졸업했습니다.", "네, 접수했습니다."],
    dispositions: ["오늘 치 과제 걱정은 뒤 창고에서 태워 버렸습니다. 과제 자체는 남아 있습니다.", "학점표는 세단기에 넣었습니다. 공단 복사본만요.", "내일의 귀하에게 넘깁니다.", "교수님께는 비밀로 합니다.", "처분 없음.", "오늘은 여기까지."],
  },
  {
    id: "work",
    keywords: ["회사", "상사", "팀장", "부장", "과장", "야근", "출근", "퇴근", "월급", "알바", "사장님", "손님", "회식", "이직", "퇴사"],
    titles: ["직장 내 표정 관리 사건", "퇴근 시간 체감 지연 사건", "사회적 미소 과다 사용 사건"],
    verdicts: ["'{word}' 건이요. 네, 그렇군요.", "아 그러세요. 저도 출근했습니다.", "들었습니다. 회사가 그렇습니다.", "네. 저도 과장입니다."],
    dispositions: ["오늘 상사가 한 말은 전부 세단기에 넣었습니다.", "오늘 들은 잔소리는 전량 소각했습니다. 재도 안 남았습니다.", "퇴근하십시오.", "일 생각은 반입 금지입니다.", "처분 없음.", "표정 관리 의무를 면제합니다."],
  },
  {
    id: "family",
    keywords: ["엄마", "아빠", "부모님", "가족", "언니", "오빠", "누나", "동생", "할머니", "할아버지", "아들", "남편", "아내"],
    titles: ["가족 간 소통 지연 사건", "'밥은 먹었니' 수신 사건", "가정 내 외교 사건"],
    verdicts: ["'{word}' 건이요. 네.", "아 그러세요.", "그렇군요. 가족 일은 공단이 모릅니다.", "들었습니다."],
    dispositions: ["처분 없음.", "오늘 안에 해결 안 하셔도 됩니다.", "서랍에 넣어 둡니다.", "답장은 나중에 하십시오."],
  },
  {
    id: "relationship",
    keywords: ["친구", "애인", "남친", "여친", "남자친구", "여자친구", "썸", "연애", "이별", "헤어", "읽씹", "안읽씹", "답장", "카톡", "짝사랑", "손절"],
    titles: ["답장 지연 해석 사건", "대화 복기 과다 사건", "인간관계 임시 휴업 사건"],
    verdicts: ["'{word}' 건이요. 네, 그렇군요.", "아 그러세요.", "상대방 속마음은 저희도 모릅니다.", "들었습니다."],
    dispositions: ["그 대화 기록은 제가 태웠습니다. 복기할 자료가 없습니다.", "오늘은 그만 생각하십시오.", "처분 없음.", "답장 대기를 종료합니다.", "결론은 내일로 미룹니다."],
  },
  {
    id: "money",
    keywords: ["통장", "월세", "카드값", "적금", "용돈", "생활비", "잔고", "돈이", "돈을", "돈 없", "텅장", "대출", "결제"],
    titles: ["통장 잔고 실종 사건", "결제 내역 부인 사건", "월말 긴축 재정 사건"],
    verdicts: ["'{word}' 건이요. 네.", "아 그러세요. 저희도 없습니다.", "그렇군요. 공단 예산도 그렇습니다.", "돈은 원래 없어집니다."],
    dispositions: ["이번 달 카드 명세서는 창고에 넣고 불을 질렀습니다. 금액은 그대로입니다.", "잔액 확인을 면제합니다.", "지원금은 없습니다.", "처분 없음.", "월급일까지 버티십시오."],
  },
  {
    id: "food",
    category: "food",
    keywords: ["밥", "점심", "저녁", "라면", "치킨", "배달", "커피", "야식", "떡볶이", "먹었", "먹고", "편의점"],
    titles: ["끼니 해결 사건", "메뉴 심의 지연 사건", "심야 음식 반입 사건"],
    verdicts: ["네, '{word}' 건이요. 안 궁금합니다.", "아 그러세요. 맛있었으면 됐습니다.", "그렇군요. 저는 감자입니다.", "드셨군요. 네."],
    dispositions: ["다음 끼니는 알아서 하십시오.", "처분 없음.", "접수만 합니다.", "끝."],
  },
  {
    id: "sleep",
    category: "bed",
    keywords: ["늦잠", "졸려", "졸립", "불면", "낮잠", "침대", "이불", "못 잤", "못잤", "밤샘", "밤새", "잠이", "알람", "피곤"],
    titles: ["수면 부족 신고 사건", "침대와의 장기 밀착 사건", "알람 제압 사건"],
    verdicts: ["'{word}' 건이요. 네, 그렇군요.", "아 그러세요. 저도 졸립니다.", "그렇군요. 안 궁금합니다.", "주무십시오."],
    dispositions: ["일찍 누우십시오. 안 지켜도 모릅니다.", "낮잠을 승인합니다.", "처분 없음.", "끝."],
  },
  {
    id: "phone",
    category: "phone",
    keywords: ["유튜브", "인스타", "넷플", "쇼츠", "릴스", "틱톡", "게임", "휴대폰", "핸드폰", "스크롤"],
    titles: ["5분만 봤는데 2시간 사건", "남의 인생 장기 열람 사건", "알고리즘 납치 사건"],
    verdicts: ["'{word}' 건이요. 안 궁금합니다.", "네, 보셨군요.", "아 그러세요. 저도 봤습니다.", "그렇군요."],
    dispositions: ["못 본 걸로 합니다.", "처분 없음.", "끝.", "남은 건 내일 보십시오."],
  },
  {
    id: "transport",
    keywords: ["지하철", "버스", "환승", "지각", "택시", "기차", "정거장", "만원버스", "출근길"],
    titles: ["대중교통 체력 소진 사건", "정거장 오판 사건", "도착 시각 조정 사건"],
    verdicts: ["'{word}' 건이요. 네.", "아 그러세요. 도착은 하셨군요.", "그렇군요. 교통은 저희 소관이 아닙니다.", "네, 고생은 귀하가 하셨습니다."],
    dispositions: ["오늘의 운동으로 인정합니다.", "처분 없음.", "끝.", "도착 시각은 묻지 않겠습니다."],
  },
  {
    id: "body",
    keywords: ["감기", "두통", "머리가 아", "몸살", "아파", "아팠", "아프", "병원", "허리", "소화", "배탈"],
    titles: ["신체 민원 접수 사건", "몸 상태 항의 사건", "휴식 요청 사건"],
    verdicts: ["'{word}' 건이요. 네, 들었습니다.", "그렇군요. 감자에게 진찰받지 마십시오.", "아 그러세요. 쉬십시오.", "몸 쪽 민원이 우선입니다."],
    dispositions: ["오늘 할 일을 보류합니다.", "심하면 병원 가십시오.", "처분 없음.", "누워 계십시오."],
  },
  {
    id: "pet",
    keywords: ["고양이", "강아지", "댕댕", "냥이", "반려"],
    titles: ["털 달린 상급자 사건", "반려동물 관할 사건"],
    verdicts: ["'{word}' 건이요. 귀엽군요. 네.", "아 그러세요. 사진은 안 받습니다.", "그렇군요. 그쪽 말이 맞습니다.", "네."],
    dispositions: ["그쪽 지시를 따르십시오.", "처분 없음."],
  },
];

export type StatementMatch = { rule: StatementRule; word: string | null };

const compact = (text: string) => text.replace(/\s+/g, "");

function findWord(rule: StatementRule, text: string): { word: string; index: number } | null {
  const plain = compact(text);
  let best: { word: string; index: number } | null = null;
  for (const keyword of rule.keywords) {
    const index = plain.indexOf(compact(keyword));
    if (index >= 0 && (!best || index < best.index)) best = { word: keyword.trim(), index };
  }
  return best;
}

/** 우선순위: 농담하면 안 되는 일 > 지친 글 > 긍정 글 > 글에서 가장 먼저 나온 주제 */
export function matchStatement(text: string): StatementMatch | null {
  if (!text.trim()) return null;
  const gentle = findWord(GENTLE_RULE, text);
  if (gentle) return { rule: GENTLE_RULE, word: gentle.word };
  const tired = findWord(TIRED_RULE, text);
  if (tired) return { rule: TIRED_RULE, word: tired.word };
  const plain = compact(text);
  if (findWord(GOOD_RULE, text) && !NEGATIVE_NEARBY.some((word) => plain.includes(compact(word)))) {
    return { rule: GOOD_RULE, word: null };
  }
  let found: { rule: StatementRule; word: string; index: number } | null = null;
  for (const rule of RULES) {
    const hit = findWord(rule, text);
    if (hit && (!found || hit.index < found.index)) found = { rule, ...hit };
  }
  return found ? { rule: found.rule, word: found.word } : null;
}

export const fillWord = (line: string, word: string | null) => line.replaceAll("{word}", word ?? "해당");
