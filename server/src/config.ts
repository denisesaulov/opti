import {config} from "dotenv"

const configObject = {} as Record<string, string>
config({ processEnv: configObject})

export default configObject
