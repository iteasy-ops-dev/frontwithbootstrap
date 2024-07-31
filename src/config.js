const config = {
	admin: process.env.REACT_APP_ADMIN,
  api: {
		baseUrl: process.env.REACT_APP_API_URL,
		method: {
			GET: "GET",
			POST: "POST"
		},
		path: {
			login: "/login",
			logout: "/logout",
			signup: "/signup",
			resetPassword: "reset_password",
			updatePassword: "update_password",
			ping: "/health",
			functions: "/functions",
			logs: "/logs",
			users: "/users",
			update_active: "/update_active",
			run: "/run",
			erpparser: "/erp-parser",
		}
	},
	jwt: {
		key: process.env.REACT_APP_JWT_KEY
	}
};

export default config;
