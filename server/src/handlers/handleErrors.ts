import {validationResult} from "express-validator"
import {Request} from "express"

export const handleErrors = (req: Request) => {
  const errors = validationResult(req)
  if(!errors.isEmpty()) {
    return errors
  }
  return null
}