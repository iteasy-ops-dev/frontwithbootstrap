const config = {
	admin: process.env.REACT_APP_ADMIN || "iteasy.ops.dev@gmail.com",
  api: {
		baseUrl: process.env.REACT_APP_API_URL || "http://localhost:8080",
		method: {
			GET: "GET",
			POST: "POST"
		},
		path: {
			login: "/login",
			extend_extension: "/extend_extension",
			dashboad: "/dashboad",
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
		key: process.env.REACT_APP_JWT_KEY || "token"
	}
};

export default config;
