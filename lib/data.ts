type Data<T> =
  | {
      success: false
      result: string
    }
  | {
      success: true
      result: T
    }

export function data<T>(success: true, result: T): Data<T>
export function data(success: false, result: string): Data<never>
export function data(success: boolean, result: unknown) {
  return { success, result }
}
