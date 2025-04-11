export type Token = {
  userid: string
  token: string
  type: 'access' | 'refresh'
}

export type Data<T> =
  | {
      success: false
      result: string
    }
  | {
      success: true
      result: T
    }
