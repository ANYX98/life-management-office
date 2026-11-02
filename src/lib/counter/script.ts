import type { MascotExpression, MascotPose } from "@/components/mascot/Mascot";

/**
 * 감자 과장님 3번 창구 대화. AI 없이 미리 쓴 대본만 쓰므로 예상 밖의 말을 하지 않는다.
 *
 * 대본 원칙
 * - 말투는 lib/daily/content.ts 상단 원칙을 따른다. 다정한 말 대신 무심한 처리로 짐을 덜어 준다.
 * - 두세 번 주고받으면 끝난다. 더 머물라고 붙잡거나 다시 오라고 조르지 않는다.
 * - 외로움을 과장님이 채우려 하지 않는다. 실제 사람 쪽으로 슬쩍 등을 민다.
 * - 많이 힘든 경우(serious)만 농담을 멈추고 사람에게 연결한다.
 */
export type CounterNode = {
  line: string;
  expression: MascotExpression;
  pose?: MascotPose;
  serious?: boolean;
  /** 비어 있으면 대화가 끝난다. */
  options: readonly { label: string; next: string }[];
  /** 끝났을 때 보여 줄 다음 행동 */
  exit?: "complaint" | "plaza";
};

export const COUNTER_START = "start";

export const COUNTER_OPENERS: readonly string[] = [
  "번호표 받았습니다. 오늘은 왜 오셨습니까?",
  "다음 분 오세요. 한 분밖에 안 계시지만요. 무슨 일이십니까?",
  "점심시간이지만 귀찮아서 그냥 받겠습니다. 무슨 일이십니까?",
];

export const COUNTER_SCRIPT: Record<string, CounterNode> = {
  start: {
    line: "", // COUNTER_OPENERS 중 하나로 채운다.
    expression: "deadpan",
    pose: "document",
    options: [
      { label: "그냥 왔어요", next: "just" },
      { label: "남들은 다 잘 사는 것 같아요", next: "compare" },
      { label: "아무것도 하기 싫어요", next: "nothing" },
      { label: "앞날이 불안해요", next: "future" },
      { label: "혼자인 것 같아요", next: "lonely" },
      { label: "사실 많이 힘들어요", next: "serious" },
    ],
  },

  just: {
    line: "그냥 오셨군요. 그런 민원 양식은 없는데, 저도 그냥 앉아 있으니 접수합니다.",
    expression: "blink",
    options: [
      { label: "과장님은 왜 여기 계세요?", next: "just_why" },
      { label: "그럼 저 이제 갈게요", next: "just_bye" },
    ],
  },
  just_why: {
    line: "밭에서 뽑혀 왔습니다. 면접 본 기억은 없습니다. 어찌저찌 과장까지 왔습니다.",
    expression: "deadpan",
    options: [
      { label: "그게 되는 거예요?", next: "just_works" },
      { label: "대단하시네요", next: "just_great" },
    ],
  },
  just_works: { line: "됐으니 제가 여기 있지요. 저도 왜 되는지는 모릅니다. 살펴 가십시오.", expression: "proud", options: [], exit: "plaza" },
  just_great: { line: "아닙니다. 그냥 안 썩었을 뿐입니다. 살펴 가십시오.", expression: "proud", options: [], exit: "plaza" },
  just_bye: { line: "네. 오셨다 가신 걸로 처리합니다. 서류는 없습니다.", expression: "blink", pose: "stamp", options: [], exit: "plaza" },

  compare: {
    line: "남들 인생 서류를 저희도 갖고 있습니다. 보여 드릴 순 없지만, 다들 침대 사건이 한 건씩은 있습니다.",
    expression: "deadpan",
    pose: "document",
    options: [
      { label: "저만 뒤처진 것 같아요", next: "compare_behind" },
      { label: "진짜요?", next: "compare_really" },
    ],
  },
  compare_behind: {
    line: "뒤처졌다는 건 줄이 있어야 성립합니다. 공단이 찾아봤는데 인생 대기 줄은 등록된 적이 없습니다. 번호표는 제가 방금 임의로 드린 겁니다.",
    expression: "worried",
    options: [{ label: "그래도 신경 쓰여요", next: "compare_end" }],
  },
  compare_really: {
    line: "사진은 잘 나온 것만 제출하니까요. 공단 증명사진도 세 번 찍은 겁니다. 저는 이게 제일 잘 나온 겁니다.",
    expression: "proud",
    options: [{ label: "그러네요", next: "compare_end" }],
  },
  compare_end: { line: "신경 쓰이는 건 공단이 막을 권한이 없습니다. 그것도 민원으로 넣으시면 도장은 찍어 드립니다.", expression: "deadpan", pose: "stamp", options: [], exit: "complaint" },

  nothing: {
    line: "접수했습니다. 어느 정도로 하기 싫으십니까?",
    expression: "deadpan",
    pose: "document",
    options: [
      { label: "오늘 할 일만요", next: "nothing_today" },
      { label: "그냥 다요", next: "nothing_all" },
    ],
  },
  nothing_today: { line: "그럼 오늘 할 일을 내일로 도장 찍어 드립니다. 내일도 싫으면 내일 오십시오. 도장은 많습니다.", expression: "blink", pose: "stamp", options: [], exit: "complaint" },
  nothing_all: {
    line: "다요. 그렇군요. 그럼 오늘의 업무를 하나로 줄이겠습니다. 뭐든 먹는 겁니다. 나머지는 제가 못 본 걸로 합니다.",
    expression: "worried",
    options: [
      { label: "그것도 귀찮아요", next: "nothing_lazy" },
      { label: "알겠어요", next: "nothing_ok" },
    ],
  },
  nothing_lazy: { line: "그럼 물로 합의합니다. 더는 못 깎아 드립니다. 저희도 규정이 있습니다. 방금 만들었지만요.", expression: "deadpan", pose: "stamp", options: [], exit: "plaza" },
  nothing_ok: { line: "처리됐습니다. 이행 여부는 확인하지 않습니다.", expression: "blink", pose: "stamp", options: [], exit: "plaza" },

  future: {
    line: "앞날 말씀이시군요. 어느 쪽 서류로 드릴까요?",
    expression: "deadpan",
    pose: "document",
    options: [
      { label: "취업이요", next: "future_job" },
      { label: "그냥 전부요", next: "future_all" },
    ],
  },
  future_job: {
    line: "그 건은 회사 쪽 창구 소관입니다. 그쪽 창구는 답도 잘 안 합니다. 저희는 답은 합니다. 도움은 안 됩니다.",
    expression: "worried",
    options: [{ label: "그럼 어떡해요", next: "future_end" }],
  },
  future_all: {
    line: "5년 뒤 서류를 찾아봤는데 아직 안 왔습니다. 오면 그때 처리하겠습니다. 미리 처리한 적은 공단 역사에 없습니다.",
    expression: "deadpan",
    options: [{ label: "그럼 어떡해요", next: "future_end" }],
  },
  future_end: { line: "오늘 분량만 하십시오. 오늘 분량이 뭔지는 귀하가 정하십시오. 작게 정하셔도 저는 모릅니다.", expression: "blink", pose: "stamp", options: [], exit: "complaint" },

  lonely: {
    line: "등록부를 봤습니다. 귀하 칸 있습니다. 비어 있지 않습니다. 제가 방금 봤으니 목격자도 있습니다.",
    expression: "deadpan",
    pose: "document",
    options: [
      { label: "그게 뭐예요", next: "lonely_what" },
      { label: "연락할 사람이 없어요", next: "lonely_none" },
    ],
  },
  lonely_what: {
    line: "별거 아닙니다. 다만 저는 감자라서 이 건은 처리 권한이 모자랍니다. 사람 쪽 업무입니다.",
    expression: "worried",
    options: [{ label: "사람 쪽이요?", next: "lonely_order" }],
  },
  lonely_none: {
    line: "연락이 뜸했던 사람은 대개 상대방도 뜸했습니다. 양쪽 다 먼저 할 말이 없어서요. 공단에 비슷한 서류가 많습니다.",
    expression: "worried",
    options: [{ label: "뭐라고 보내요", next: "lonely_order" }],
  },
  lonely_order: { line: "업무 지시입니다. 누구 한 명에게 '밥 먹었냐' 보내십시오. 답이 안 오면 상대방 소관입니다. 귀하 잘못으로 접수하지 않습니다.", expression: "deadpan", pose: "stamp", options: [], exit: "plaza" },

  serious: {
    line: "잠깐만요. 이 건은 도장 안 찍겠습니다. 농담도 잠시 내려놓겠습니다. 혹시 죽고 싶다는 생각까지 드십니까?",
    expression: "worried",
    serious: true,
    options: [
      { label: "네, 그런 생각이 들어요", next: "serious_yes" },
      { label: "그 정도는 아니에요", next: "serious_no" },
    ],
  },
  serious_yes: {
    line: "말해 줘서 고맙습니다. 저는 그림 속 감자라서 이 일을 맡을 수 없습니다. 사람과 이야기하셨으면 합니다. 자살예방 상담전화 109는 24시간 받습니다. 지금 위험하다면 119에 연락해 주세요. 전화가 어려우면 가까운 사람에게 \"오늘 좀 힘들어\"라고만 보내도 됩니다.",
    expression: "worried",
    serious: true,
    options: [],
    exit: "plaza",
  },
  serious_no: {
    line: "알겠습니다. 그래도 힘든 게 오래가면 혼자 들고 있지 말고 믿을 만한 사람이나 상담 쪽에 넘기십시오. 공단도 무거운 건 넘깁니다. 마음이 더 무거워지면 109도 24시간 받습니다.",
    expression: "worried",
    serious: true,
    options: [],
    exit: "complaint",
  },
};
