import axios from 'axios';
import { getApiUrl } from '../assets/getapi';

const api = axios.create({
  baseURL: getApiUrl(), // Usa la URL centralizada para el backend
});

export default api;
