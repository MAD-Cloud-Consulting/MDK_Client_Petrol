import libCom from '../Common/Library/CommonLibrary';
export default function GLAccountVisible(context) {

	let move = libCom.getStateVariable(context, 'IMMovementType');
	if (move === 'R') {
		return true;
	}
	return false;
}
