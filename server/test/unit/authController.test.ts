import {expect} from "chai"
import {describe, it} from "mocha"
import sinon from "sinon"
import {Document, Model} from "mongoose"
import User, {IUser, UserRole} from "../../src/models/User"
import bcrypt from "bcryptjs"
import {AuthController} from "../../src/authController"
import {UserNotFoundError, UserPasswordError} from "../../src/errors"


describe("AuthController", () => {
  const password = "12345678"
  const user = new User({
    login: "Denis",
    password: bcrypt.hashSync(password, 7),
    roles: [UserRole.ADMIN]
  })

  it("should register user success", async () => {
    const save = sinon.stub().resolves()

    const userModelStub = class mock extends User {
      save = save

      constructor(body: any) {
        super(body)
      }
    } as unknown as Model<IUser>

    const userController = new AuthController(userModelStub, "secret_code")
    const registeredUser = await userController.registerUser(user.login, password)

    expect(save.calledOnce).to.be.true
    expect(registeredUser instanceof Document).to.be.true
    expect(registeredUser.toJSON()).to.have.keys(["login", "password"])
  })

  it("should returns list of users success", async () => {
    const find = sinon.stub().resolves([])

    const userModelStub = {
      find

    } as unknown as Model<IUser>

    const userController = new AuthController(userModelStub, "secret_code")
    const registeredUsers = await userController.getUsers()

    expect(find.calledOnce).to.be.true
    expect(registeredUsers).to.be.an("array")
  })

  it("should auth registered user success", async () => {
    const findOne = sinon.stub().resolves(user)
    const userModelStub = {
      findOne

    } as unknown as Model<IUser>

    const userController = new AuthController(userModelStub,"secret_code")
    const token = await userController.authUser(user.login, password)

    expect(findOne.calledOnce).to.be.true
    expect(token).to.be.an("string")
  })

  it("should auth registered user fail", async () => {
    const findOne = sinon.stub().resolves()
    const userModelStub = {
      findOne

    } as unknown as Model<IUser>

    const userController = new AuthController(userModelStub,"secret_code")
    try {
      await userController.authUser(user.login, password)
    } catch (e) {
      expect(e instanceof UserNotFoundError).to.be.true
      if (e instanceof UserNotFoundError) {
        expect(e.message).to.be.eq(`user with name: ${user.login} didn't found`)
        return true
      }
      throw Error("should not pass")
    }
  })

  it("should auth registered user fail", async () => {
    const findOne = sinon.stub().resolves(new User({login: user.login, password: "wrong_hash"}))
    const userModelStub = {
      findOne
    } as unknown as Model<IUser>

    const userController = new AuthController(userModelStub,"secret_code")
    try {
      await userController.authUser(user.login, password)
    } catch (e) {
      expect(e instanceof UserPasswordError).to.be.true
      if (e instanceof UserPasswordError) {
        expect(e.message).to.be.eq(`wrong password`)
        return true
      }
      throw Error("should not pass")
    }
  })

})