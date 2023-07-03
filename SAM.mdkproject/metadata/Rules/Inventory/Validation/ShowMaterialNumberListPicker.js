import libCom from '../../Common/Library/CommonLibrary';

export default function ShowMaterialNumberListPicker(context) {
    let type = libCom.getStateVariable(context, 'IMObjectType');
     
    if ((!(libCom.getPreviousPageName(context) === 'StockDetailsPage')) && (type === 'ADHOC' || type === 'TRF')) {
        return true;
    }

    return false;
}
