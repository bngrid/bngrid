type Data<T> =
  | {
      result: string
      success: false
    }
  | {
      result: T
      success: true
    }

export function data<T>(success: true, result: T): Data<T>
export function data(success: false, result: string): Data<never>
export function data(success: boolean, result: unknown) {
  return { result, success }
}
