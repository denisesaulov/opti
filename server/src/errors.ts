export class DuplicateUserError extends Error{
  public readonly name = "DuplicateUserError"
  public status: number
  public code: string
  constructor(message:string) {
    super(message)
    this.status = 409
    this.code = "user/create-error"
  }
}
export class UserNotFoundError extends Error{
  public readonly name = "UserNotFoundError"
  public status: number
  public code: string
  constructor(message:string) {
    super(message)
    this.status = 404
    this.code = "user/not-found"
  }
}

export class UserConsistentError extends Error{
  public readonly name = "UserConsistentError"
  public status: number
  public code: string
  constructor(message:string) {
    super(message)
    this.status = 400
    this.code = "user/broken"
  }
}
export class UserPasswordError extends Error{
  public readonly name = "UserPasswordError"
  public status: number
  public code: string
  constructor(message:string) {
    super(message)
    this.status = 400
    this.code = "user/password-error"
  }
}
export class CarNotFoundError extends Error{
  public readonly name = "CarNotFoundError"
  public status: number
  public code: string
  constructor(message:string) {
    super(message)
    this.status = 404
    this.code = "car/not-found"
  }
}