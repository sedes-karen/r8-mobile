export async function readApiError(response: Response, fallback: string): Promise<Error> {
  try {
    const data = (await response.json()) as { message?: string; error?: string };
    return new Error(data.message ?? data.error ?? fallback);
  } catch {
    return new Error(fallback);
  }
}
