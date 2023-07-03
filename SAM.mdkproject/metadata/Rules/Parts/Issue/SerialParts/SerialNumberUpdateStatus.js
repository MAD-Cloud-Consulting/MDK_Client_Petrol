import commonlib from '../../../Common/Library/CommonLibrary';
import serialPartLoop from './SerialPartLoop';

export default function SerialNumberUpdateStatus(context) {
    let index = commonlib.getStateVariable(context,'SerialPartsCounter');
    let serialNum = commonlib.getListPickerValue(commonlib.getTargetPathValue(context,'#Control:SerialNumLstPkr/#Value'));
    let entitySet = context.binding['@odata.readLink'] + '/Material/SerialNumbers';
    if (!commonlib.isDefined(serialNum)) {
        return Promise.resolve();
    }
    return context.read('/SAPAssetManager/Services/AssetManager.service', entitySet,[], "$filter=SerialNumber eq '"+ serialNum + "'").then(result => {
        if (result && result.getItem(0)) {
            context.getClientData().SerialNumberUpdateReadLink = result.getItem(0)['@odata.readLink'];
            return context.executeAction('/SAPAssetManager/Actions/Parts/SerialPartUpdate.action');
        } else {
            if (!context.getClientData().isIssue) { //if a row doesn't exist in the master data then it means that the serial number was issued and synced. Hence, create a row
                context.getClientData().offsetForLocalId = index;
                context.getClientData().SerialNumberForCreate = serialNum; 
                return context.executeAction('/SAPAssetManager/Actions/Parts/SerialPartCreateRow.action');
            }
            return serialPartLoop(context);
        }
    });
}
