import {describe} from "mocha"
import {duplicateInsertError} from "../../src/handlers/errorTexts"
import {expect} from "chai"
import {generateAccessToken} from "../../src/handlers/generateAccessToken"
import {UserRole} from "../../src/models/User"
import jwt from "jsonwebtoken"

describe("Handlers tests", () => {
  it("should create correct error text", () => {
    const keyValue = {
      vin: "ksdhfkshdf"
    }
    const entries = Object.entries(keyValue)
    const result = duplicateInsertError(keyValue)

    expect(result).to.be.eq(`record with key:${entries[0][0]} and value:${entries[0][1]} already exists`)
  })

  it("should generate token", () => {
    const secreteCode = "secret_code"
    const payload = {
      login: "Denis",
      id: "1234567",
      roles: [UserRole.ADMIN]
    }

    const token = generateAccessToken(payload, secreteCode)
    const {id, login, roles, exp, iat} = jwt.verify(token, secreteCode) as typeof payload & {exp: number, iat: number}

    expect(id).to.be.deep.eq(payload.id)
    expect(login).to.be.deep.eq(payload.login)
    expect(roles).to.be.an("array")
    expect(roles).to.have.members([UserRole.ADMIN])
    expect(exp-iat).to.be.eq(3600) // valid for 1h
  })
})