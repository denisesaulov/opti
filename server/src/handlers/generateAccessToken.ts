import jwt from "jsonwebtoken"

export const generateAccessToken = (payload: Record<string, any>, secretCode: string): string => {
  return jwt.sign(payload, secretCode, {expiresIn: "1h"})
}

export interface IPayload {
  id: string,
  login: string
  roles: string[]
}
