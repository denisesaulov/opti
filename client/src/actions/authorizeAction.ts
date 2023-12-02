import axios, {AxiosError} from "axios"

export const authorizeAction = async (options: AuthorizeOptions) => {
  const {url, login, pass} = options
  try {
    const response = await axios.post(`${url}/auth/login`, {login, password: pass})
    console.log(response.data)
  } catch (e: unknown) {
    if (e instanceof AxiosError && e.response && e.response.status) {
      console.log({status: e.response.status, message: e.response.data.message})
    } else {
      console.log(e)
    }
  }
}

interface AuthorizeOptions {
  url: string
  login: string
  pass: string
}