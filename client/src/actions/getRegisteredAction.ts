import axios, {AxiosError} from "axios"

export const getRegisteredAction = async (options: GetRegisterOptions) => {
  const {url} = options
  try {
    const response = await axios.get(`${url}/auth/users`)
    console.log(response.data)
  } catch (e: unknown) {
    if (e instanceof AxiosError && e.response && e.response.status) {
      console.log({status: e.response.status, message: e.response.data.message})
    } else {
      console.log(e)
    }
  }
}

interface GetRegisterOptions {
  url: string
}