import axios, {AxiosError} from 'axios'

export const updateAction = async (str: string, options: UpdateOptions) => {
  const {url, token, vin} = options
  const requestUrl = `${url}/car/${vin}`
  try {
    const body = JSON.parse(str)
    const response =
      await axios.patch(requestUrl, body, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
    console.log(response.data)
  } catch (e: unknown) {
    if (e instanceof AxiosError && e.response && e.response.status) {
      console.log({status: e.response.status, message: e.response.data.message})
    } else {
      console.log(e)
    }
  }
}

interface UpdateOptions {
  url: string
  token: string
  vin: string
}