import axios from "axios";

export const api = axios.create({
    // 임시 주소
    baseURL : 'http://10.0.2.2:8081',
    timeout: 5000,
})