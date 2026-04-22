// Central API configuration
// ⚠️ IMPORTANT: Replace with your actual backend URL before building APK
// - For local testing with Android emulator: http://10.0.2.2:8000
// - For local testing with real phone: http://<YOUR_PC_IP>:8000
// - For deployed backend: https://your-deployed-url.onrender.com

const BASE_URL = 'http://172.19.34.67:8000'; // Current Local IP address for mobile app testing

export const API_ENDPOINTS = {
  REGISTER: `${BASE_URL}/users/api/register/`,
  USER_LOGIN: `${BASE_URL}/users/api/login/`,
  ADMIN_LOGIN: `${BASE_URL}/admins/api/login/`,
  PREDICT: `${BASE_URL}/users/api/predict/`,
  DASHBOARD: `${BASE_URL}/users/api/dashboard/`,
};

export default BASE_URL;
