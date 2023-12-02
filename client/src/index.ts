import {Command} from 'commander'

const program = new Command()
import {getAction} from "./actions/getAction"
import {delAction} from "./actions/delAction"
import {createAction} from "./actions/createAction"
import {updateAction} from "./actions/updateAction"
import {registerAction} from "./actions/registerAction"
import {authorizeAction} from "./actions/authorizeAction"
import {getRegisteredAction} from "./actions/getRegisteredAction"

program
  .name("request-client")
  .version('0.0.1')
  .description('CLI client for making requests to the server')

program
  .command("get")
  .description("get cars by brand")
  .option('-u, --url <uri>', 'Specify the backend address (like: http(s)://127.0.0.1:3000)', "http://127.0.0.1:3000")
  .option('-b, --brand <brand>', 'Specify the brand (e.g., bmw)')
  .option('-s, --sorted <sorted>', 'Specify the field to sort by (e.g., price)')
  .option('-o, --order <order>', 'Specify the sorting order (asc or desc)')
  .option('-t, --token <token>', 'Specify the authentication token')
  .action(getAction)

program
  .command("del")
  .description("delete car by vin")
  .option('-u, --url <uri>', 'Specify the backend address (like: http(s)://127.0.0.1:3000)', "http://127.0.0.1:3000")
  .option('-v, --vin <vin>', 'Specify the car vin')
  .option('-t, --token <token>', 'Specify the authentication token')
  .action(delAction)

program
  .command("create")
  .description("create car")
  .option('-u, --url <uri>', 'Specify the backend address (like: http(s)://127.0.0.1:3000)', "http://127.0.0.1:3000")
  .option('-t, --token <token>', 'Specify the authentication token')
  .argument('<string>', 'Provide valid json string with object description (\'{"manufacturer": "BMW", "color": "white".....}\')')
  .action(createAction)

program
  .command("update")
  .description("update car")
  .option('-u, --url <uri>', 'Specify the backend address (like: http(s)://127.0.0.1:3000)', "http://127.0.0.1:3000")
  .option('-t, --token <token>', 'Specify the authentication token')
  .option('-v, --vin <vin>', 'Specify the car vin')
  .argument('<string>', 'Provide valid json string with object description ({"manufacturer": "BMW", "color": "white".....})')
  .action(updateAction)

program
  .command("register")
  .description("create user")
  .option('-u, --url <uri>', 'Specify the backend address (like: http(s)://127.0.0.1:3000)', "http://127.0.0.1:3000")
  .option('-l, --login <login>', 'Specify login')
  .option('-p, --pass <pass>', 'Specify password between 6 and 10')
  .action(registerAction)

program
  .command("login")
  .description("authorizing user by releasing token")
  .option('-u, --url <uri>', 'Specify the backend address (like: http(s)://127.0.0.1:3000)', "http://127.0.0.1:3000")
  .option('-l, --login <login>', 'Specify login')
  .option('-p, --pass <pass>', 'Specify password between 6 and 10')
  .action(authorizeAction)

program
  .command("users")
  .description("get registered users")
  .option('-u, --url <uri>', 'Specify the backend address (like: http(s)://127.0.0.1:3000)', "http://127.0.0.1:3000")
  .action(getRegisteredAction)

program
  .parse()


