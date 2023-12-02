import axios, {AxiosError} from "axios"

export const getAction =
  async (options: GetMethodOptions) => {
    const {sorted, url, brand, token, order} = options
    const requestUrl = `${url}/car/byBrand/${brand}?${sorted ? 'field=' + sorted + '&order=' + order : ''}`
    try {
      const response =
        await axios.get(requestUrl, {
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

interface GetMethodOptions {
  url: string
  brand: string
  sorted: string
  order: 'asc' | 'desc'
  token: string
}