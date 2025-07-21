import axios from 'axios';

// Configuración global de Axios
const instance = axios.create({
  baseURL: `${import.meta.env.VITE_API_SERVER_URI}/api/v2`,
  headers: {
    common: {
      'Content-Type': 'multipart/form-data',
    },
  },
});

// Interceptor para agregar la cabecera del idioma a todas las solicitudes
instance.interceptors.request.use((config) => {
  config.headers['Accept-Language'] = 'es';//localStorage.language;

  const token = localStorage.getItem('jwt'); // Obtiene el token JWT almacenado en el cliente
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Agrega el token JWT a la cabecera de autorización
  }

  return config;
});

const generateQueryString = (queries) =>
  queries
    ? Object.keys(queries)
        .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(queries[key])}`)
        .join('&')
    : '';

const createRoute = (path, queries) =>
  queries
    ? `${path}${generateQueryString(queries) ? `?${generateQueryString(queries)}` : ''}`
    : path;

// Rutas públicas
export const publicRoutes = {
  signup: (usersData, queries) => instance.post(createRoute(`/public/user`, queries), usersData),
  validToken: (token, queries) => instance.get(createRoute(`/public/token/${token}/valid`, queries)),
  login: (type, data) => instance.post(`/public/${type}/login`, data),
  recoverPasswordEmail: (type, email) => instance.patch(`/public/${type}/token/password`, { email }),
  recoverPassword: (type, token, data) => instance.patch(`/public/${type}/recover/${token}`, data),
  confirmAccount: (type, token, data, queries) => instance.patch(createRoute(`/public/${type}/${token}/confirm`, queries), data)
};

// Rutas autenticadas
export const authenticatedRoutes = {
  updateProfile: (profileData) => instance.put('/profile', profileData),
};

export default instance;
