import {ICar} from "./models/Car"
import {Document, Model} from "mongoose"
import {CarNotFoundError} from "./errors"

export interface ICarController {
  create(body: CarCreateDto): Promise<Document>

  getByManufacturer(manufacturer: string, sortedField: string, order: string): Promise<Document[]>

  remove(vin: string): Promise<Document>

  update(vin: string, setForUpdate: [string, string | number][]): Promise<Document>
}

export class CarController implements ICarController {
  constructor(private readonly model: Model<ICar>) {
  }

  async remove(vin: string): Promise<Document> {
    const car = await this.model.findOneAndDelete({vin: vin.toUpperCase()}, {}).exec()
    if (!car) {
      throw new CarNotFoundError(`the car with vin ${vin} was not found`)
    }
    return car
  }


  async getByManufacturer(manufacturer: string, sortedField = "model", order = 'asc'): Promise<Document[]> {
    let sorting: Record<string, string | number> = {}
    if (sortedField) {
      sorting[sortedField] = order
    }
    return await this.model.find({manufacturer: new RegExp(manufacturer, "i")}, {}, {sort: sorting}).exec()
  }

  async create(body: CarCreateDto): Promise<Document> {
    const car = new this.model(body)
    await car.save()
    return car
  }

  async update(vin: string, setForUpdate: [string, string | number][]): Promise<Document> {
    const setOptions: Partial<Record<string, string | number> & Record<"updateAt", number>> = {}
    for (let [key, value] of setForUpdate) {
      setOptions[key] = value
    }
    setOptions["updateAt"] = Date.now()
    const carUpdated = await this.model.findOneAndUpdate({vin: vin.toUpperCase()}, setOptions, {returnDocument: "after"})
    if (!carUpdated) {
      throw new CarNotFoundError(`car with vin ${vin} was not found`)
    }
    return carUpdated
  }
}

export type CarCreateDto = Omit<ICar, "_id" | "createAt" | "updateAt">