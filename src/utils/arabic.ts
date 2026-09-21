export function toArabicNumerals(numStr: string): string {
  if (!numStr) return '';
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return numStr.replace(/[0-9]/g, (w) => arabicDigits[+w]);
}

export function formatDateToArabicHijri(dateStr: string): string {
  if (!dateStr) return '';
  // if already has slashes or digits, convert numbers
  return toArabicNumerals(dateStr);
}
