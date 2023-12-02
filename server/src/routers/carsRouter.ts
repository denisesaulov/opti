import {NextFunction, Request, Response, Router} from "express"
import {CarController, CarCreateDto} from "../carController"
import {carCreateValidator, paramsValidator} from "../middlewares/validators"
// import {authLoginPassMiddleware} from "../middlewares/authLoginPassMiddleware"
import {authTokenMiddleware} from "../middlewares/authTokenMiddleware"
import Car from "../models/Car"
import {checkRequestError} from "../middlewares/checkRequestError"

const router = Router()
const controller = new CarController(Car)

export const updatableFields: Array<string> = ["manufacturer", "model", "manufacturedYear", "price", "color", "type"]
export const createFields: Array<string> = [...updatableFields, "vin"]
//guard on login and pass
// router.use(authLoginPassMiddleware)

//guard on token
router.use(authTokenMiddleware)

router.get("/byBrand/:brand",
  paramsValidator,
  checkRequestError,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {brand} = req.params
      const {field, order} = req.query
      const cars = await controller.getByManufacturer(brand, `${field}`, `${order}`)
      res.status(200).json(cars.map(car => car.toJSON()))
    } catch (e) {
      next(e)
    }
  }
)

router.delete("/:vin",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {vin} = req.params
      const car = await controller.remove(vin)
      res.status(201).json(car)
    } catch (e) {
      next(e)
    }
  })

router.patch("/:vin",
  carCreateValidator,
  checkRequestError,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {vin} = req.params
      const body = req.body as Record<string, string | number>
      const setUpdatable = Object.entries(body).filter(entry => updatableFields.includes(entry[0]) && entry[1])
      const carUpdated = await controller.update(vin, setUpdatable)
      res.status(201).json(carUpdated.toJSON())
    } catch (e) {
      next(e)
    }
  })

router.post("/",
  carCreateValidator,
  checkRequestError,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body
      const createBody = Object.fromEntries(Object.entries(body).filter(entry => createFields.includes(entry[0]) && entry[1])) as CarCreateDto
      const newCar = await controller.create(createBody)
      res.status(201).json(newCar)
    } catch (e) {
      next(e)
    }
  }
)

interface QueryParamsGet {
  field: keyof CarCreateDto,
  order: 'asc' | 'desc'
}

export default router