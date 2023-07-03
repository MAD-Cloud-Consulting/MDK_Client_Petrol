import SetMaterialQuery from './SetMaterialQuery';
import libCom from '../../Common/Library/CommonLibrary';
/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function StorageLocationValueChange(context) {
    let transferType = libCom.getControlProxy(context.getPageProxy(),'TransferSeg').getValue()[0].ReturnValue;
    let isTransferFrom = transferType === context.localizeText('from_vehicle');
    if (!isTransferFrom) {
        SetMaterialQuery(context);
    }
}
