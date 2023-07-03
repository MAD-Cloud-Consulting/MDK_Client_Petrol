import libCom from '../Common/Library/CommonLibrary';

export default function ItemTextVisible(context) {
	let type = libCom.getStateVariable(context, 'IMObjectType');
	if (type === 'IB' || type === 'OB') {
		return false;
	} else {
		return true;
	}
}
