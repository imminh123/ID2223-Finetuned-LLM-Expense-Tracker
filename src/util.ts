export const parseDate = (date: string | Date): string =>
    new Date(date).toLocaleDateString();