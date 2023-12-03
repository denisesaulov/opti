import {config} from "dotenv"

const configObject = {} as Record<keyof IConfig, string>
config({ processEnv: configObject})

export default configObject

interface IConfig {
  PORT: string
  MONGO_URI: string
  DB_NAME: string
  SECRETE_CODE: string
}