import { Tooltip } from 'react-bootstrap';

export const consoleTooltip = (props) => {
	return (
		<Tooltip id="button-tooltip" {...props}>
			작업할 서버의 접속 정보를 입력하고 눌러주세요!
		</Tooltip>
	);
}

export const deleteTooltip = (props) => {
	return (
		<Tooltip id="button-tooltip" {...props}>
			제외 업체 삭제!
		</Tooltip>
	)
};

export const addTooltip = (props) => {
	return (
		<Tooltip id="button-tooltip" {...props}>
			제외 업체 추가!
		</Tooltip>
	)
};

export const moveTooltip = (props) => {
	return (
		<Tooltip id="button-tooltip" {...props}>
			작업의뢰 페이지로 이동!
		</Tooltip>
	)
};