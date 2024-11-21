const config = {
	admin: process.env.REACT_APP_ADMIN || "iteasy.ops.dev@gmail.com",
	ws: {
		url: process.env.REACT_APP_WS_API_URL || "ws://localhost:8080/ws"
	},
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
			update_work_history: "/update-work-history",
			workhistory: "/workhistory",
			get_work_history: "/get-work-history",
			insight: "/insight",
			sentinelone: {
				update: "/sentinelone/update"
			}
		}
	},
	mm_api: {
		baseUrl: process.env.REACT_APP_MANAGED_MONITOR_API_URL || "http://localhost:8081",
		method: {
			GET: "GET",
			POST: "POST"
		},
		path: {
			list: "/list",
			start: "/start",
			updateStatus: "/updateStatus",
			done: "/done"
		}
	},
	jwt: {
		key: process.env.REACT_APP_JWT_KEY || "OPST"
	},
	chart: {
		bgColor: {
			red: 'rgba(255, 99, 132, 0.2)',
			blue: 'rgba(54, 162, 235, 0.2)',
			yellow: 'rgba(255, 206, 86, 0.2)',
			green: 'rgba(75, 192, 192, 0.2)',
			purple: 'rgba(153, 102, 255, 0.2)',
			orange: 'rgba(255, 159, 64, 0.2)'
		},
		borderColor: {
			red: 'rgba(255, 99, 132, 1)',
			blue: 'rgba(54, 162, 235, 1)',
			yellow: 'rgba(255, 206, 86, 1)',
			green: 'rgba(75, 192, 192, 1)',
			purple: 'rgba(153, 102, 255, 1)',
			orange: 'rgba(255, 159, 64, 1)'
		},
		doughnutOptions: {
			responsive: true,
			plugins: {
				legend: {
					position: 'top',
				},
				tooltip: {
					callbacks: {
						label: (context) => `${context.label}: ${context.raw}`,
					},
				},
			},
		}
	},
	localStorage: {
		lockPassword: "lockPassword",
		functions: "functions",
		monitor: {
			excludedCompanies: "excludedCompanies",
			alertThreshold: "alertThreshold",
			intervalMinutes: "intervalMinutes"
		}
	}
};

export default config;
