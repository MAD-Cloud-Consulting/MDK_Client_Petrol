import ODataDate from '../../Common/Date/ODataDate';
import libCom from '../../Common/Library/CommonLibrary';
/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function PhysicalInventoryDocumentDate(context) {
    return new ODataDate(libCom.getControlProxy(context,'CountDatePicker').getValue()).toLocalDateString();
}
