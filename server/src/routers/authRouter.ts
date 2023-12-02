import {Router, Response, Request, NextFunction} from "express"
import {loginAndPasswordValidators} from "../middlewares/validators"
import User from "../models/User"
import {checkRequestError} from "../middlewares/checkRequestError"
import {AuthController} from "../authController"

const router = Router()
const controller = new AuthController(User)

router.post("/login",
  loginAndPasswordValidators,
  checkRequestError,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {login, password} = req.body
      const token = await controller.authUser(login, password)
      res.status(201).json({token})
    } catch (e) {
      next(e)
    }
  })

router.get("/users",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await controller.getUsers()
      res.status(200).json(users.map(user => user.toJSON()))
    } catch (e) {
      next(e)
    }
  })

router.post("/register",
  loginAndPasswordValidators,
  checkRequestError,
  async function (req: Request, res: Response, next: NextFunction) {
    try {
      const {login, password} = req.body
      const user = await controller.registerUser(login, password)
      res.status(201).json(user.toJSON())
    } catch (e) {
      next(e)
    }
  })

export default router