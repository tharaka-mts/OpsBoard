import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // Connects via Ingress in K8s or local proxy in Dev
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
