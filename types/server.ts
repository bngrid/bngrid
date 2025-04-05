export type Data<T> = Promise<
  | {
      success: false
      result: string
    }
  | {
      success: true
      result: T
    }
>
