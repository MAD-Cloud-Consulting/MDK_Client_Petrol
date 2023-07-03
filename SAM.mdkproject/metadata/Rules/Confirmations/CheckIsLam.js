import lamIsEnabled from '../LAM/LAMIsEnabled';

export default function CheckIsLam(context, confirmRow) {
    if (lamIsEnabled(context)) {
        let op = confirmRow.Operation;
        let order = confirmRow.OrderID;
        let lamDefaultRow = '', tempRow;
        //Read the operation row and its parent WO.  Work up the hierarchy looking for the first LAM record to use as a default
        let expand = '$expand=LAMObjectDatum_Nav,EquipmentOperation,FunctionalLocationOperation,EquipmentOperation/LAMObjectDatum_Nav,FunctionalLocationOperation/LAMObjectDatum_Nav,WOHeader,WOHeader/LAMObjectDatum_Nav,WOHeader/Equipment,WOHeader/Equipment/LAMObjectDatum_Nav,WOHeader/FunctionalLocation,WOHeader/FunctionalLocation/LAMObjectDatum_Nav';
        return context.read('/SAPAssetManager/Services/AssetManager.service', "MyWorkOrderOperations(OperationNo='" + op + "',OrderId='" + order + "')", ['OperationNo'], expand).then(function(opResults) {
            if (opResults && opResults.length > 0) {
                let opRow = opResults.getItem(0);
                if (opRow.LAMObjectDatum_Nav && opRow.LAMObjectDatum_Nav.StartPoint !== '' && opRow.LAMObjectDatum_Nav.EndPoint !== '' && opRow.LAMObjectDatum_Nav.Length !== '') { // Ignore bogus LAM entries
                    lamDefaultRow = opRow.LAMObjectDatum_Nav;
                } else if (opRow.EquipmentOperation && opRow.EquipmentOperation.LAMObjectDatum_Nav) {
                    lamDefaultRow = opRow.EquipmentOperation.LAMObjectDatum_Nav;
                } else if (opRow.FunctionalLocationOperation && opRow.FunctionalLocationOperation.LAMObjectDatum_Nav) {
                    lamDefaultRow = opRow.FunctionalLocationOperation.LAMObjectDatum_Nav;
                } else if (opRow.WOHeader && opRow.WOHeader.LAMObjectDatum_Nav && opRow.WOHeader.LAMObjectDatum_Nav.length > 0) {
                    for (var i = 0; i < opRow.WOHeader.LAMObjectDatum_Nav.length; i++) {
                        tempRow = opRow.WOHeader.LAMObjectDatum_Nav[i];
                        if (tempRow.ObjectType === 'OR' && tempRow.StartPoint !== '' && tempRow.EndPoint !== '' && tempRow.Length !== '') { //Find the header row, Ignore bogus LAM entries
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

            return lamDefaultRow;
        });
    }

    return Promise.resolve('');
}
