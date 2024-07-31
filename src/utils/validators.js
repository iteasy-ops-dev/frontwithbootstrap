const validateStatus = (message = null) => {
	let status = true
	if (!message) {
		return { status, message }
	} else {
		status = false
		return { status, message }
	}
}

export const validateEmail = (email) => {
	const emailRegex = /^[a-zA-Z0-9._%+-]+@iteasy\.co\.kr$/;
	const excludedEmail = 'iteasy.ops.dev@gmail.com';
	if (!emailRegex.test(email) && email !== excludedEmail) {
		return validateStatus('이메일 도메인이 @iteasy.co.kr 이여야합니다.')
	}
	return validateStatus()
}

export const validatePassword = (password) => {
	const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
	if (!passwordRegex.test(password)) {
		return validateStatus('비밀번호는 8자리 이상, 대소문자, 특수문자(@$!%*?&), 숫자가 반드시 하나 이상 포함되어야 합니다.')
	}
	return validateStatus()
}

export const validateconfirmPassword = (p1, p2) => {
	if (p1 !== p2) {
		return validateStatus('패스워드가 일치하지 않습니다.')
	}
	return validateStatus()
}