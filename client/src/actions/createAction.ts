import axios, {AxiosError} from 'axios'

export const createAction = async (str: string, options: CreateOptions) => {
  const {url, token} = options
  const requestUrl = `${url}/car`
  try {
    const body = JSON.parse(str)
    const response =
      await axios.post(requestUrl, body,{
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

interface CreateOptions {
  url: string
  token: string
}
