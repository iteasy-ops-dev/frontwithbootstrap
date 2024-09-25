import { Badge } from 'react-bootstrap';

export const NewBadge = () => {
	return (
		<>
			{' '}<Badge pill bg="danger">N</Badge>
		</>
	)
}

export const InfoBadge = () => {
	return (
		<>
			{' '}<Badge pill bg="info">I</Badge>
		</>
	)
}

export const UpdateBadge = () => {
	return (
		<>
			{' '}<Badge pill bg="success">U</Badge>
		</>
	)
}