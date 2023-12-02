import axios, {AxiosError} from "axios"

export const delAction = async (options: DelOptions) => {
  const {url, vin, token} = options
  const requestUrl = `${url}/car/${vin}`
  try {
    await axios.delete(requestUrl, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    console.log("deleted")
  } catch (e: unknown) {
    if (e instanceof AxiosError && e.response && e.response.status) {
      console.log({status: e.response.status, message: e.response.data.message})
    } else {
      console.log(e)
    }
  }
}

interface DelOptions {
  url: string
  vin: string
  token: string
}