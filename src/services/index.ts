import axios from 'axios';
import { BASE_URL as baseURL } from '../constants/api.ts';

export default axios.create({ baseURL });
