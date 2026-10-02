// A guard against common accidental credential pastes, not a general secret detector.
export function containsCredentialText(value: string): boolean {
  return /(?:sk-(?:proj-)?[A-Za-z0-9_-]{24,}|gh[pousr]_[A-Za-z0-9]{24,}|Bearer\s+[A-Za-z0-9._-]{24,})/i.test(value);
}
