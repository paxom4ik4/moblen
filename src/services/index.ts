import axios from 'axios';
import { getBaseUrl } from './services.utils.ts';

export default axios.create({ baseURL: getBaseUrl() });
