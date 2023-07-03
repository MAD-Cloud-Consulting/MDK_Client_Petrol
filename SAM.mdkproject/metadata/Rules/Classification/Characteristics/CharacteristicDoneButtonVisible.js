import libCom from '../../Common/Library/CommonLibrary';

export default function CharacteristicDoneButtonVisible(context) {
    let controlName = libCom.getStateVariable(context,'VisibleControlFrom');
    if (controlName ==='CurrencyMultipleValue' || controlName ==='CharacterMultipleValue' || controlName ==='NumberMultipleValue' || controlName === 'TimeMultipleValue' || controlName === 'DateMultipleValue') {
        return false;
    } else {
        return true;
    }
}
