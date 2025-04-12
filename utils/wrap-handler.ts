type Handler = (...args: any[]) => Promise<any> | any

export default async function wrapHandler(
  handler: Handler | undefined,
  setLoading: (loading: boolean) => void,
  ...args: any[]
) {
  if (!handler) return
  setLoading(true)
  try {
    await Promise.resolve(handler(...args))
  } finally {
    setLoading(false)
  }
}
