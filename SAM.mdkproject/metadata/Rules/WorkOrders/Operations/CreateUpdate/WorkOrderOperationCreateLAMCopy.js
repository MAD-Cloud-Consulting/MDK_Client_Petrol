import libCommon from '../../../Common/Library/CommonLibrary';
import lamEnabled from '../../../LAM/LAMIsEnabled';
import lamDefault from '../../../LAM/CreateUpdate/LAMGenericDefaultValues';

export default function WorkOrderOperationCreateLAMCopy(context) {
    //Check to see if the operation we just added needs new LAM entries created
    if (lamEnabled(context)) {
        libCommon.removeStateVariable(context, 'LAMDefaultRow');
        libCommon.removeStateVariable(context, 'LAMCreateType');
        libCommon.removeStateVariable(context, 'LAMHeaderReadLink');
        libCommon.setStateVariable(context, 'LAMDefaultRow', '');
        let order = libCommon.getStateVariable(context, 'LocalId');
        let op = libCommon.getStateVariable(context, 'lastLocalOperationId'); //Operation just added
        let opRow;
        if (op) {
            let lamDefaultRow = '', tempRow;
            //Read the operation row and its parent WO.  Work up the hierarchy looking for the first LAM record to use as a default
            let expand = '$expand=LAMObjectDatum_Nav,EquipmentOperation,FunctionalLocationOperation,EquipmentOperation/LAMObjectDatum_Nav,FunctionalLocationOperation/LAMObjectDatum_Nav,WOHeader,WOHeader/LAMObjectDatum_Nav,WOHeader/Equipment,WOHeader/Equipment/LAMObjectDatum_Nav,WOHeader/FunctionalLocation,WOHeader/FunctionalLocation/LAMObjectDatum_Nav';
            let filter = "&$filter=OrderId eq '" + order + "' and OperationNo eq '" + op + "'";
            return context.read('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderOperations', ['OperationNo'], expand + filter).then(function(opResults) {
                if (opResults && opResults.length > 0) {
                    opRow = opResults.getItem(0);
                    if (opRow.LAMObjectDatum_Nav) {
                        lamDefaultRow = opRow.LAMObjectDatum_Nav;
                    } else if (opRow.EquipmentOperation && opRow.EquipmentOperation.LAMObjectDatum_Nav) {
                        lamDefaultRow = opRow.EquipmentOperation.LAMObjectDatum_Nav;
                    } else if (opRow.FunctionalLocationOperation && opRow.FunctionalLocationOperation.LAMObjectDatum_Nav) {
                        lamDefaultRow = opRow.FunctionalLocationOperation.LAMObjectDatum_Nav;
                    } else if (opRow.WOHeader && opRow.WOHeader.LAMObjectDatum_Nav && opRow.WOHeader.LAMObjectDatum_Nav.length > 0) {
                        for (var i = 0; i < opRow.WOHeader.LAMObjectDatum_Nav.length; i++) {
                            tempRow = opRow.WOHeader.LAMObjectDatum_Nav[i];
                            if (tempRow.ObjectType === 'OR') { //Find the header row
                                lamDefaultRow = tempRow;
                                break;
                            }
                        }
                    }
                    if (!lamDefaultRow) {
                        if (opRow.WOHeader && opRow.WOHeader.Equipment && opRow.WOHeader.Equipment.LAMObjectDatum_Nav) {
                            lamDefaultRow = opRow.WOHeader.Equipment.LAMObjectDatum_Nav;
                        } else if (opRow.WOHeader && opRow.WOHeader.FunctionalLocation && opRow.WOHeader.FunctionalLocation.LAMObjectDatum_Nav) {
                            lamDefaultRow = opRow.WOHeader.FunctionalLocation.LAMObjectDatum_Nav;
                        }
                    }
                }
                if (lamDefaultRow) { //We found a LAM default, so create a new LAM entry for this operation
                    libCommon.setStateVariable(context, 'LAMDefaultRow', lamDefaultRow);
                    libCommon.setStateVariable(context, 'LAMCreateType', 'Operation');
                    libCommon.setStateVariable(context, 'LAMHeaderReadLink', opRow['@odata.readLink']);
                    libCommon.setStateVariable(context, 'ObjectCreatedName', 'Operation');
                    lamDefault(context); //Set the default values for this new LAM record
                    return context.executeAction('/SAPAssetManager/Actions/LAM/LAMGenericDataCreate.action').then(() => {
                        context.getBindingObject().TempLAMObjectType = '';
                    });
                }
                return Promise.resolve(false);
            });    
        }
        return Promise.resolve(false);
    }
    return Promise.resolve(false);  
}
