import axios, {AxiosError} from "axios"

export const registerAction = async (options: RegisterOptions) => {
  const {url, login, pass} = options
  try {
    const response = await axios.post(`${url}/auth/register`, {login, password: pass})
    console.log(response.data)
  } catch (e: unknown) {
    if (e instanceof AxiosError && e.response && e.response.status) {
      console.log({status: e.response.status, message: e.response.data.message})
    } else {
      console.log(e)
    }
  }
}

interface RegisterOptions {
  url: string
  login: string
  pass: string
}