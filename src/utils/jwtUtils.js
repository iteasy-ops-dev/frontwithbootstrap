import { jwtDecode } from 'jwt-decode'; // Use named import

export const getEmailFromToken = (token) => {
  try {
    const decodedToken = jwtDecode(token);
    return decodedToken.email || null;
  } catch (error) {
    console.error('Invalid token:', error);
    return null;
  }
};
