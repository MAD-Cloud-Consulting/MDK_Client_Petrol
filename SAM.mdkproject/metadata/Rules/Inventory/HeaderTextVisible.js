import libCom from '../Common/Library/CommonLibrary';

export default function HeaderTextVisible(context) {
	let type = libCom.getStateVariable(context, 'IMObjectType');
	if (type === 'IB' || type === 'OB') {
		return false;
	} else {
		return true;
	}
}
