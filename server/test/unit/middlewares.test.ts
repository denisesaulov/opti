import {describe, it} from "mocha"
import {expect} from "chai"
import {Request, Response} from "express"
import {getAuthTokenMiddleware} from "../../src/middlewares/authTokenMiddleware"
import sinon from "sinon"
import {UserRole} from "../../src/models/User"
import jwt from "jsonwebtoken"

describe(" Auth token middleware", () => {
  const mockUserPayload = {
    id:"123",
    login:"Denis",
    roles:[UserRole.ADMIN]
  }

  const secretCode = "secret"

  const mockRequest = (token: string) => {
    return {
      method: "GET",
      headers: {authorization: `Bearer ${token}`},
    } as Request
  }

  const mockResponse = () => {
    const res = {} as Response
    res.status = sinon.stub().returns(res)
    res.json = sinon.stub().returns(res)
    return res
  }
    const mockNext = () => sinon.stub()

  it("authTokenMiddleware token is not passed - failed", () => {
    const authTokenMiddleware = getAuthTokenMiddleware(secretCode)

    const req = mockRequest("")
    const res = mockResponse()
    const next = mockNext()

    authTokenMiddleware(req, res, next)

    const status = res.status as sinon.SinonStub
    const json = res.json as sinon.SinonStub
    const statusFirstCall = status.firstCall
    const jsonFirstCall = json.firstCall

    expect(status.calledOnce).to.be.true
    expect(json.calledOnce).to.be.true
    expect(statusFirstCall.args[0]).to.be.eq(403)
    expect(jsonFirstCall.args[0]).to.be.deep.eq({message: "user is not authorized"})
  })

  it("authTokenMiddleware token is not correct - failed", () => {
    const authTokenMiddleware = getAuthTokenMiddleware("another_secrete")
    const token = jwt.sign(mockUserPayload, secretCode)

    const next = mockNext()
    const req = mockRequest(token)
    const res = mockResponse()

    authTokenMiddleware(req, res, next)

    const status = res.status as sinon.SinonStub
    const json = res.json as sinon.SinonStub
    const statusFirstCall = status.firstCall
    const jsonFirstCall = json.firstCall

    expect(status.calledOnce).to.be.true
    expect(json.calledOnce).to.be.true
    expect(statusFirstCall.args[0]).to.be.eq(400)
    expect(jsonFirstCall.args[0]).to.be.deep.eq({"message": "token is invalid"})
  })

  it("authTokenMiddleware token payload is empty - failed", () => {
    const authTokenMiddleware = getAuthTokenMiddleware(secretCode)
    const token = jwt.sign({}, secretCode)
    const next = sinon.stub()
    const req = mockRequest(token)
    const res = mockResponse()

    authTokenMiddleware(req, res, next)

    const status = res.status as sinon.SinonStub
    const json = res.json as sinon.SinonStub
    const statusFirstCall = status.firstCall
    const jsonFirstCall = json.firstCall

    expect(status.calledOnce).to.be.true
    expect(json.calledOnce).to.be.true
    expect(statusFirstCall.args[0]).to.be.eq(403)
    expect(jsonFirstCall.args[0]).to.be.deep.eq({message: "payload is not correct"})
  })

  it("authTokenMiddleware - success", () => {
    const authTokenMiddleware = getAuthTokenMiddleware(secretCode)
    const token = jwt.sign(mockUserPayload, secretCode)
    const next = sinon.stub()
    const req = mockRequest(token)
    const res = mockResponse()

    authTokenMiddleware(req, res, next)

    const status = res.status as sinon.SinonStub
    const json = res.json as sinon.SinonStub

    expect(status.calledOnce).to.be.false
    expect(json.calledOnce).to.be.false
    expect(next.calledOnce).to.be.true
  })

})