import {Schema, model, ObjectId, InferSchemaType} from "mongoose"

export enum UserRole {
  ADMIN = "admin"
}

export interface IUser {
  _id: ObjectId
  login: string,
  password: string,
  roles: UserRole[]
}


const UserSchema = new Schema<IUser>({
  login: {type: String, require: true, unique: true},
  password: {type: String, require: true},
  roles: {type: [String]}
})

UserSchema.methods.toJSON = function () {
  const userObject = this.toObject({getters: true})
  delete userObject._id
  delete userObject.__v
  delete userObject.id
  delete userObject.roles
  return userObject
}

type User = InferSchemaType<typeof UserSchema>

export default model<User>("User", UserSchema)