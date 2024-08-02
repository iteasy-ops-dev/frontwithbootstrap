import { jwtDecode } from 'jwt-decode'; // Use named import

export const getUserFromToken = (token) => {
  try {
    const decodedToken = jwtDecode(token);
    // email, exp
    return decodedToken || null;
  } catch (error) {
    console.error('Invalid token:', error);
    return null;
  }
};

