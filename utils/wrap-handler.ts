type Handler<Args extends unknown[], Return> = (...args: Args) => Promise<Return> | Return

export default async function wrapHandler<Args extends unknown[], Return>(
  handler: Handler<Args, Return>,
  setLoading: (loading: boolean) => void,
  ...args: Args
): Promise<Return> {
  setLoading(true)
  try {
    return await Promise.resolve(handler(...args))
  } finally {
    setLoading(false)
  }
}
