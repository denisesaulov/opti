import {check, query} from "express-validator"

const min = 6
const max = 10

export const loginAndPasswordValidators = [
  check("login", "login can't be empty").notEmpty(),
  check("password", `password should be between ${min} and ${max} symbols`).isLength({min, max})
]

export const carCreateValidator = [
  check([
    "manufacturer",
    "model",
    "manufacturedYear",
    "price",
    "color",
    "vin",
    "type"
  ], (value) => {
    return `${value} can't be empty`
  }).notEmpty()
]

export const paramsValidator = [
  query("field").replace(undefined, '').default("model").isIn(["manufacturer", "model", "manufacturedYear", "price", "color", "type", "vin"]),
  query("order").replace(undefined, '').default("asc").isIn(["asc", "desc"])
]