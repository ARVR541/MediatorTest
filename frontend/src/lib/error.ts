export function parseApiError(error: unknown): string {
  if (error instanceof Error) {
    try {
      const parsed = JSON.parse(error.message) as { message?: string };
      if (parsed.message) {
        return parsed.message;
      }
    } catch {
      return error.message;
    }
  }

  return 'Произошла ошибка. Попробуйте ещё раз.';
}
