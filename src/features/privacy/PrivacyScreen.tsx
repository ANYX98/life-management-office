const SECTIONS: { title: string; lines: string[] }[] = [
  { title: "저장하는 것", lines: ["닉네임, 캐릭터 설정, 시민증 정보(시민 번호, 유형, 등급, 칭호)", "민원 내용: 적은 글, 고른 항목, 판정과 처분", "누른 반응과 신고", "이메일과 비밀번호: 직접 연결한 경우에만. 비밀번호는 Supabase가 암호화해 보관하며 운영자도 볼 수 없습니다."] },
  { title: "다른 시민에게 보이는 것", lines: ["닉네임, 캐릭터, 시민 번호와 칭호 같은 시민증 정보는 공개됩니다.", "'익명 공개'로 낸 사건은 적은 글까지 공개됩니다. 내 기록에서 언제든 비공개로 바꿀 수 있습니다.", "반응은 개수만 보이고, 누가 눌렀는지는 보이지 않습니다.", "이메일은 보이지 않습니다."] },
  { title: "'나만 보기'로 쓴 글", lines: ["다른 시민에게는 보이지 않습니다.", "다만 서버에 저장되므로 서비스 운영자는 기술적으로 볼 수 있습니다. 비밀번호, 실명, 다른 사람의 개인정보는 적지 말아 주세요."] },
  { title: "맡기는 곳", lines: ["데이터 저장과 로그인: Supabase (서울 지역)", "사이트 운영: Vercel", "메일 발송: Supabase", "민원 판정은 미리 쓴 문구로 만들며, 글을 AI 회사로 보내지 않습니다."] },
  { title: "보관과 삭제", lines: ["직접 삭제할 때까지 보관합니다.", "'계정과 내 정보' 화면에서 시민증과 모든 기록을 언제든 삭제할 수 있습니다.", "브라우저 기록을 지우면 이 기기의 로그인이 풀립니다. 이메일을 연결하지 않았다면 시민증을 다시 찾을 수 없습니다."] },
  { title: "이용 대상", lines: ["만 14세 이상만 등록할 수 있습니다."] },
  { title: "문의와 신고", lines: ["운영자 이메일: lifeoffice.kr@gmail.com", "개인정보, 삭제 요청, 문제가 있는 글은 이 주소로 알려 주세요. 긴급한 위기 상황에는 이 메일 대신 109나 119에 연락해 주세요."] },
  { title: "많이 힘들 때", lines: ["이 서비스는 상담이나 치료를 대신하지 않습니다. 자살예방 상담전화 109는 24시간 받습니다. 지금 위험하다면 119에 연락해 주세요."] },
];

export function PrivacyScreen() {
  return (
    <article className="paper mx-auto mt-2 grid max-w-2xl gap-5 p-6">
      <h1 className="text-[28px]">개인정보 안내</h1>
      <p>이 안내만큼은 농담 없이 적었습니다.</p>
      {SECTIONS.map((section) => (
        <section key={section.title}>
          <h2 className="text-xl">{section.title}</h2>
          <ul className="m-0 mt-1 grid gap-1 pl-5">
            {section.lines.map((line) => <li key={line}>{line}</li>)}
          </ul>
        </section>
      ))}
    </article>
  );
}
