import { Collection, WithId } from 'mongodb'

export type User = {
  username: string
  account: string
  password: string
  coin: number
  status: boolean
  active: boolean
  token: string
  create: Date
  updata: Date
}

export type Verify = {
  collection: Collection<User>
  user: WithId<User>
}
