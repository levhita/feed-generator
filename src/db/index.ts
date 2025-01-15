import dotenv from 'dotenv'
import { createPool } from 'mysql2' 
import { Kysely, Migrator, MysqlDialect } from 'kysely'
import { DatabaseSchema } from './schema'
import { migrationProvider } from './migrations'

dotenv.config();
const mysqlHost=process.env.FEEDGEN_MYSQL_HOST;
const mysqlUser=process.env.FEEDGEN_MYSQL_USER;
const mysqlPassword=process.env.FEEDGEN_MYSQL_PASSWORD;


const dialect = new MysqlDialect({
  pool: createPool({
    database: 'yamodev',
    host: mysqlHost,
    user: mysqlUser,
    password: mysqlPassword,
    port: 3306,
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
