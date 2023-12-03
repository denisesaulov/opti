
## Client Execution

To build the client, you can generate an executable file using the following command:

```bash
npm run compile:client
```

## Register user
```
./client register -l login -p password
```

## Login user - get token
```
./client login -l {login} -p {password}
```

## Get cars
```
./client get -b bmw -t {token}
```

## Help for addition commands and details
```
./client help
```
## Commands

- **get [options]:** Get cars by brand
- **del [options]:** Delete car by vin
- **create [options] <string>:** Create car
- **update [options] <string>:** Update car
- **register [options]:** Create user
- **login [options]:** Authorize user by generating token
- **users [options]:** Get registered users
- **help [command]:** Display help for command


