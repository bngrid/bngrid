import { Db, MongoClient } from 'mongodb'

let database: Db
export default async () => {
  if (!database) {
    const uri = `mongodb+srv://${process.env.dbaccount}:${process.env.dbpassword}@bngrid.h6qdqrg.mongodb.net/?retryWrites=true&w=majority&appName=bngrid`
    const client = new MongoClient(uri)
    await client.connect()
    database = client.db('bngrid')
  }
  return database
}
