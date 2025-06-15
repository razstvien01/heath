export function formatCurrency(value: number | undefined | null): string {
  if (typeof value !== "number") return "₱0.00";

  return value.toLocaleString("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
  });
}
