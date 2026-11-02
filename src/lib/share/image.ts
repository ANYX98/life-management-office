export const SITE_HOST = "life-management-office.vercel.app";

/** 화면 밖에 그려 둔 카드를 PNG로 만든다. 세로 1080x1920이 되도록 2배로 찍는다. */
export async function captureCard(node: HTMLElement): Promise<Blob> {
  const { toBlob } = await import("html-to-image");
  // 글꼴이 늦게 도착하면 대체 글꼴로 찍히므로 기다린다.
  await document.fonts?.ready;
  const blob = await toBlob(node, { pixelRatio: 2, backgroundColor: "#F6F0E5" });
  if (!blob) throw new Error("이미지를 만들지 못했습니다.");
  return blob;
}

/** 휴대폰은 공유 창을 열고, 안 되면 파일로 내려받는다. */
export async function shareOrDownload(blob: Blob, filename: string): Promise<"shared" | "saved" | "cancelled"> {
  const file = new File([blob], filename, { type: "image/png" });
  const coarse = window.matchMedia?.("(pointer: coarse)").matches;
  if (coarse && navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file] });
      return "shared";
    } catch (cause) {
      if (cause instanceof DOMException && cause.name === "AbortError") return "cancelled";
    }
  }
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
  return "saved";
}
