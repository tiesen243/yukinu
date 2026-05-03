export async function verifyTurnstile(event: React.SubmitEvent): Promise<void> {
  const resonse = await fetch('/api/turnstile', {
    method: 'POST',
    body: new FormData(event.target),
  })
  const result = (await resonse.json()) as
    | { success: true }
    | { success: false; message: string }
  if (!result.success)
    throw new Error(result.message ?? 'Turnstile verification failed')
}
