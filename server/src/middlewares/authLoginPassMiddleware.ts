import {NextFunction, Request, Response} from "express"
import {validationResult} from "express-validator"
import User, {IUser} from "../models/User"
import bcrypt from "bcryptjs"

export async function authLoginPassMiddleware(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  if (req.method === "OPTIONS") {
    return next()
  }
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({message: `login password validation error ${errors}`})
    }
    const {login, password} = req.body

    const user = await User.findOne<IUser>({login}).exec()
    if (!user) {
      return res.status(401).json({message: "access denied"})
    }
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({message: "access denied"})
    }
    return next()
  } catch (e) {
    return res.status(500).json({error: e})
  }
}