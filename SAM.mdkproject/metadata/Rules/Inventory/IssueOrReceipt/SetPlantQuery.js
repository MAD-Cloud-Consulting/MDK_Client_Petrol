import SetMaterialQuery from './SetMaterialQuery';
import libCom from '../../Common/Library/CommonLibrary';

/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function SetPlantQuery(context) {
    let page = context.getPageProxy();
    let storageLocationPicker = page.evaluateTargetPathForAPI('#Control:StorageLocationLstPkr');
    let sLocPickerSpecifier = storageLocationPicker.getTargetSpecifier();
    let userSLoc = libCom.getUserDefaultStorageLocation();
    let transferType = libCom.getControlProxy(page,'TransferSeg').getValue()[0].ReturnValue;
    let isTransferFrom = transferType === context.localizeText('from_vehicle');
    let query;
    if (context.getValue().length > 0) {
        let plant = context.getValue()[0].ReturnValue;
        if (plant) {
            query = `$filter=Plant eq '${plant}'`;
        }
    }
    if (isTransferFrom && libCom.isDefined(userSLoc)) {
        query += libCom.isDefined(query) ? ` and StorageLocation ne '${userSLoc}'` : `$filter=StorageLocation ne '${userSLoc}'`;
    }
    query += '&$orderby=StorageLocation';
    sLocPickerSpecifier.setQueryOptions(query);
    storageLocationPicker.setTargetSpecifier(sLocPickerSpecifier);
    if (!isTransferFrom) {
        SetMaterialQuery(context);
    }
}
