export type Token = {
  userid: string
  token: string
  type: 'access' | 'refresh'
}

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
