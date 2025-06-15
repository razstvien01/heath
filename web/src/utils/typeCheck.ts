export function isSerializedBuffer(
  obj: unknown
): obj is { type: string; data: number[] } {
  return (
    typeof obj === "object" &&
    obj !== null &&
    (obj as { type?: string }).type === "Buffer" &&
    Array.isArray((obj as { data?: unknown }).data)
  );
}
