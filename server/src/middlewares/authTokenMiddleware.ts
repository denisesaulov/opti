import {NextFunction, Request, Response} from "express"
import jwt from "jsonwebtoken"
import configObject from "../config"
import {IPayload} from "../handlers/generateAccessToken"



export function authTokenMiddleware(req: Request, res: Response, next: NextFunction): void {
  if (req.method === "OPTIONS") {
    next()
  }
  try {
    const token = req.headers.authorization?.split(" ")[1]
    if (!token) {
      res.status(403).json({message: "user is not authorized"})
      return
    }
    const payload = jwt.verify(token, configObject.SECRETE_CODE) as IPayload
    next()
  } catch (e) {
    console.log(e)
    res.status(400).json({message: "user unauthorized"})
    return
  }
}