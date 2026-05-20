export type DateInput = string | number | Date;

/**
 * Formats a date to a string based on the provided locale and options.
 * @param date The date to format.
 * @param locale The locale to use for formatting.
 * @param options The options to use for formatting.
 * @returns The formatted date string.
 */
export function formatDate(
  date: DateInput | null | undefined,
  locale: string = 'en-GB',
  options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }
): string {
  if (!date) return '';

  const parsedDate = new Date(date);

  if (isNaN(parsedDate.getTime())) {
    return '';
  }

  return parsedDate.toLocaleDateString(locale, options);
}