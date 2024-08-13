export const toMultipartFormData = (form) => {
	console.log(form)
	const formData = new FormData();
	for (const [key, value] of Object.entries(form)) {
		// 옵션
		if (key === "options") {
			for (const [okey, ovalue] of Object.entries(form.options)) {
				if (okey === "files") {
					for (const file of form.options[okey]) {
						formData.append('files', file);
					}
				} else {
					formData.append(okey, ovalue)
				}
			}
		// 기본 폼
		} else if (key === "ips") {
			formData.append(key, JSON.stringify(value))
		} else {
			formData.append(key, value)
		}
	}
	return formData
};