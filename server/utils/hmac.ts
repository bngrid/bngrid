import { createHmac } from 'node:crypto'

export default (value: string) =>
  createHmac('sha256', process.env.secretkey!).update(value).digest('hex')
