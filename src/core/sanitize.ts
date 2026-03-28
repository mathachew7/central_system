export const sanitizeText = (value: string): string => value.replace(/[\u0000-\u001F\u007F]/g, " ").trim();
