import { HOST } from "@/utils/constants"
import axios from "axios"


const apiClient = axios.create({
  baseURL : HOST,
  withCredentials: true,
})

export default apiClient;