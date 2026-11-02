/** 사생활 보호 모드 등에서 localStorage가 예외를 던져도 앱이 멈추지 않게 한다. */
export function readJson<T>(key: string): T | null {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

/** 저장에 실패하면 false를 돌려주어, 호출자가 '저장됨'으로 잘못 표시하지 않게 한다. */
export function writeJson(key: string, value: unknown): boolean {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function removeKey(key: string): void {
  try {
    window.localStorage.removeItem(key);
  } catch {
    /* 지울 수 없어도 다음 로드에서 무시된다. */
  }
}
