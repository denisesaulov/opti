import {NextFunction, Request, Response} from "express"
import jwt from "jsonwebtoken"
import {IPayload} from "../handlers/generateAccessToken"


export function getAuthTokenMiddleware(secrete: string) {
  return function authTokenMiddleware(req: Request, res: Response, next: NextFunction): void {
    if (req.method === "OPTIONS") {
      next()
    }
    const token = req.headers.authorization?.split(" ")[1]
    if (!token) {
      res.status(403).json({message: "user is not authorized"})
      return
    }
    try {
      const payload = jwt.verify(token, secrete) as IPayload
      if (!payload || !payload.login || !payload.roles) {
        res.status(403).json({message: "payload is not correct"})
        return
      }
      next()
    } catch (e: any) {
      res.status(400).json({message: "token is invalid"})
      return
    }
  }
}
