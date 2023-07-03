import libCom from '../../Common/Library/CommonLibrary';

export default function IsGoodsVisible(context) {
    const objectType = libCom.getStateVariable(context, 'IMObjectType');

    if (objectType === 'ADHOC' || objectType === 'TRF' || objectType === 'PO' || objectType === 'REV' || objectType === 'PRD') {
        return true;
    }
    return false;
}
