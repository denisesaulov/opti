import {NextFunction, Request, Response} from "express"
import {
  CarNotFoundError,
  DuplicateUserError,
  UserConsistentError,
  UserNotFoundError,
  UserPasswordError
} from "../errors"
import {duplicateInsertError} from "../handlers/errorTexts"

export function errorHandlerMiddleware(err: any, req: Request, res: Response, next: NextFunction) {
  if (err) {
    switch (true) {
      case (err instanceof CarNotFoundError):
      case (err instanceof UserNotFoundError):
      case (err instanceof UserConsistentError):
      case (err instanceof UserPasswordError):
      case (err instanceof DuplicateUserError): {
        res.status(err.status).json({code: err.code, message: err.message})
        break
      }

      default: {
        if (err.name === 'MongoServerError' && err.code === 11000 && err.keyPattern && err.keyValue) {
          return res.status(409).json({message: duplicateInsertError(err.keyValue)})
        }
        console.log(err)
        return res.status(500).json({error: err})
      }
    }
  }
}