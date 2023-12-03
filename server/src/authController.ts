import {IUser, UserRole} from "./models/User"
import bcrypt from "bcryptjs"
import {Document, Model} from "mongoose"
import {generateAccessToken} from "./handlers/generateAccessToken"
import {UserConsistentError, UserNotFoundError, UserPasswordError} from "./errors"

interface IAuthController {
  registerUser(login: string, password: string): Promise<Document>

  authUser(login: string, password: string): Promise<string>

  getUsers(): Promise<Document[]>
}

export class AuthController implements IAuthController {
  constructor(private readonly model: Model<IUser>, private readonly secreteCode: string) {
  }

  async authUser(login: string, password: string): Promise<string> {
    const user = await this.model.findOne({login})
    if (!user) {
      throw new UserNotFoundError(`user with name: ${login} didn't found`)
    }
    if (!user.password) {
      throw new UserConsistentError("user broken error")
    }
    const validPassword = bcrypt.compareSync(password, String(user.password))
    if (!validPassword) {
      throw new UserPasswordError("wrong password")
    }
    const payload = {
      login:  user.login,
      id: user._id.toString(),
      roles:user.roles
    }
    return generateAccessToken(payload, this.secreteCode)
  }

  async getUsers(): Promise<Document[]> {
    return this.model.find()
  }

  async registerUser(login: string, password: string): Promise<Document> {
    const hash = bcrypt.hashSync(password, 7)
    const newUser = new this.model({login, password: hash, roles: [UserRole.ADMIN]})
    await newUser.save()
    return newUser
  }
}

