import jwt from "jsonwebtoken"
import configObject from "../config"
import {UserRole} from "../models/User"

export const generateAccessToken = (id: string, login: string, roles: UserRole[]): string => {
  const payload = {
    id, login, roles
  }
  return jwt.sign(payload, configObject.SECRETE_CODE, {expiresIn: "1h"})
}

export interface IPayload {
  id: string,
  login: string
  roles: string[]
}
