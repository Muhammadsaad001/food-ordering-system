import axios from 'axios';

export const AxiosRequest = axios.create({
    baseURL: 'http://192.168.100.17:9000' ,
    timeout: 10000, // Use your actual IP address
    
});
