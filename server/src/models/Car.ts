import {Schema, model, ObjectId, InferSchemaType} from "mongoose"

export enum CarType {
  SUV = "suv",
  SEDAN = "sedan",
  HATCHBACK = "hatchback",
  COUPE = "coupe",
  WAGON = "wagon",
  CROSSOVER = "crossover"
}

export interface ICar {
  _id: ObjectId,
  manufacturer: string,
  model: string,
  type: CarType,
  color: string,
  manufacturedYear: number,
  vin: string
  price: number,
  createAt: Date,
  updateAt: Date
}

const CarSchema = new Schema<ICar>({
  manufacturer: {type: String, index: true, require: true},
  model: {type: String, require: true},
  manufacturedYear: {type: Number, require: true},
  price: {type: Number, require: true},
  color: {type: String, require: true},
  vin: {type: String, unique: true, require: true, set: (value: String) => value.toUpperCase()},
  type: {type: String, require: true},
  createAt: {type: Date, require: true, default: Date.now()},
  updateAt: {type: Date, require: true, default: Date.now()}
})

CarSchema.methods.toJSON = function () {
  const carObject = this.toObject({getters: true})
  delete carObject._id
  delete carObject.__v
  return carObject
}

type Car = InferSchemaType<typeof CarSchema>

export default model<Car>("Car", CarSchema)

