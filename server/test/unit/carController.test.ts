import {expect} from "chai"
import {describe, it} from "mocha"
import sinon from "sinon"
import {CarController} from "../../src/carController"
import Car, {CarType, ICar} from "../../src/models/Car"
import {Document, Model} from "mongoose"
import {CarNotFoundError} from "../../src/errors"


describe("CarController", () => {
  const car = new Car({
    manufacturer: "BMW",
    model: "318",
    type: CarType.COUPE,
    color: "white",
    price: "1234",
    vin: "slsjdfskjdfksj",
    manufacturedYear: 2020,
  })
  const defaultSorting = {
    model: "asc"
  }

  it("should remove a car success", async () => {
    const vin = car.vin
    const exec = sinon.stub().resolves(car)
    const deleteOneStub = sinon.stub().returns({exec})

    const carModelStub = {
      findOneAndDelete: deleteOneStub,
    } as unknown as Model<ICar>

    const carController = new CarController(carModelStub)
    await carController.remove(vin)

    expect(deleteOneStub.calledOnce).to.be.true
    expect(exec.calledOnce).to.be.true
    expect(deleteOneStub.calledWith({vin: vin})).to.be.true
  })

  it("should remove a car fail", async () => {
    const vin = car.vin
    const exec = sinon.stub().resolves()
    const deleteOneStub = sinon.stub().returns({exec})

    const carModelStub = {
      findOneAndDelete: deleteOneStub,
    } as unknown as Model<ICar>

    const carController = new CarController(carModelStub)
    try {
      await carController.remove(vin)
    } catch (e) {
      if (e instanceof CarNotFoundError) {
        expect(e.code).to.be.eq("car/not-found")
        expect(e.status).to.be.eq(404)
        expect(e.message).to.be.eq(`the car with vin ${vin} was not found`)
        return true
      }
      throw new Error("should not pass")
    }

    expect(deleteOneStub.calledOnce).to.be.true
    expect(exec.calledOnce).to.be.true
    expect(deleteOneStub.calledWith({vin: vin})).to.be.true
  })

  it("should returns list of cars success", async () => {
    const manufacturer = car.manufacturer
    const exec = sinon.stub().resolves([car, car])
    const find = sinon.stub().returns({exec})


    const carModelStub = {
      find,
    } as unknown as Model<ICar>

    const carController = new CarController(carModelStub)
    await carController.getByManufacturer(manufacturer)

    expect(find.calledOnce).to.be.true
    expect(exec.calledOnce).to.be.true
    expect(find.firstCall.args[0]).to.be.have.key("manufacturer")
    expect(find.firstCall.args[1]).to.deep.equal({})
    expect(find.firstCall.args[2]).to.deep.equal({sort: defaultSorting})
  })

  it("should returns list of cars and change type of sorting success", async () => {
    const manufacturer = car.manufacturer
    const sortField = "price"
    const order = "desc"
    const exec = sinon.stub().resolves([car, car])
    const find = sinon.stub().returns({exec})


    const carModelStub = {
      find,
    } as unknown as Model<ICar>

    const carController = new CarController(carModelStub)
    const result = await carController.getByManufacturer(manufacturer, sortField, order)

    expect(find.calledOnce).to.be.true
    expect(exec.calledOnce).to.be.true
    expect(find.firstCall.args[0]).to.be.have.key("manufacturer")
    expect(find.firstCall.args[1]).to.deep.equal({})
    expect(find.firstCall.args[2]).to.deep.equal({sort: {[sortField]: order}})
    expect(result).to.be.an("array")
    expect(result[0] instanceof Document).to.be.true
  })

  it("should create the car success", async () => {
    const save = sinon.stub().resolves(car)

    const carModelStub = class mock extends Car {
      save = save
      constructor(body: any) {
        super(body)
      }
    } as unknown as Model<ICar>

    const carController = new CarController(carModelStub)
    const result = await carController.create(car)

    expect(save.calledOnce).to.be.true
    expect(result).to.be.not.null
    expect(result instanceof Document).to.be.true
    expect(result.toJSON()).to.be.have.keys(["id", "manufacturer", "model", "type", "color", "price", "vin", "manufacturedYear", "createAt", "updateAt"])
  })

  it("should update the car success", async () => {
    const vin = car.vin
    const fieldsForUpdate = {
      model: "123",
      price: "666",
      color: "transparent"
    }
    const findOneAndUpdate = sinon.stub().resolves(car)

    const carModelStub = {
      findOneAndUpdate
    } as unknown as Model<ICar>

    const carController = new CarController(carModelStub)
    const result = await carController.update(vin, Object.entries(fieldsForUpdate))
    const hydratedCar = result.toJSON()

    expect(findOneAndUpdate.calledOnce).to.be.true
    expect(result).to.be.not.null
    expect(result instanceof Document).to.be.true
    expect(hydratedCar).to.be.have.keys(["id", "manufacturer", "model", "type", "color", "price", "vin", "manufacturedYear", "createAt", "updateAt"])
    expect(findOneAndUpdate.firstCall.args[0]).to.deep.equal({vin: car.vin})
    expect(findOneAndUpdate.firstCall.args[1].price).to.deep.equal(fieldsForUpdate.price)
    expect(findOneAndUpdate.firstCall.args[1].model).to.deep.equal(fieldsForUpdate.model)
    expect(findOneAndUpdate.firstCall.args[1].color).to.deep.equal(fieldsForUpdate.color)
    expect(findOneAndUpdate.firstCall.args[1]).to.have.keys(["updateAt", "price", "color", "model"])
    expect(findOneAndUpdate.firstCall.args[2]).to.deep.equal({returnDocument: "after"})
  })

  it("should update the car fail", async () => {
    const vin = car.vin
    const fieldsForUpdate = {
      model: "123",
      price: "666",
      color: "transparent"
    }
    const findOneAndUpdate = sinon.stub().resolves()

    const carModelStub = {
      findOneAndUpdate
    } as unknown as Model<ICar>

    const carController = new CarController(carModelStub)
    try {
      await carController.update(vin, Object.entries(fieldsForUpdate))
    } catch (e) {
      expect(findOneAndUpdate.calledOnce).to.be.true
      if (e instanceof CarNotFoundError) {
        expect(e.code).to.be.eq("car/not-found")
        expect(e.status).to.be.eq(404)
        expect(e.message).to.be.eq(`car with vin ${vin} was not found`)
        return true
      }
      throw new Error("should not pass")
    }

  })
})



