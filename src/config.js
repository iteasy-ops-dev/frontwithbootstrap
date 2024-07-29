// src/config.js
const config = {
  api: {
		baseUrl: "http://localhost:8080",
		method: {
			GET: "GET",
			POST: "POST"
		},
		path: {
			login: "/login",
			logout: "/logout",
			signup: "/signup",
			ping: "/health",
			functions: "/functions",
			get: "/get",
			run: "/run",
			erpparser: "/erp-parser",
		}
	},
	jwt: {
		key: "token"
	}
};

export default config;
