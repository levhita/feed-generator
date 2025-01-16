import dotenv from 'dotenv'
import { createPool } from 'mysql2' 
import { Kysely, Migrator, MysqlDialect } from 'kysely'
import { DatabaseSchema } from './schema'
import { migrationProvider } from './migrations'

dotenv.config();
const dialect = new MysqlDialect({
  pool: createPool({
    database: process.env.FEEDGEN_MYSQL_DATABASE,
    host: process.env.FEEDGEN_MYSQL_HOST,
    user: process.env.FEEDGEN_MYSQL_USER,
    password: process.env.FEEDGEN_MYSQL_PASSWORD,
    port: process.env.FEEDGEN_MYSQL_PORT,
    connectionLimit: 10,
  })
})

export const createDb = (location: string): Database => {
  return new Kysely<DatabaseSchema>({
    dialect,
  })
}

export const migrateToLatest = async (db: Database) => {
  const migrator = new Migrator({ db, provider: migrationProvider })
  const { error } = await migrator.migrateToLatest()
  if (error) throw error
}

export type Database = Kysely<DatabaseSchema>
