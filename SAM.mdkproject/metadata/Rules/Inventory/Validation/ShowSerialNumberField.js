import libCom from '../../Common/Library/CommonLibrary';

export default function ShowSerialNumberField(context) {
    if (context.binding) {
        let plant;
        let material;
        let movTypePicker;
        let type = context.binding['@odata.type'].substring('#sap_mobile.'.length);
        let move = libCom.getStateVariable(context, 'IMMovementType');
        let objectType = libCom.getStateVariable(context, 'IMObjectType');
        let target = context.binding;

        try {
            movTypePicker = context.getPageProxy().getControl('FormCellContainer').getControl('MovementTypePicker');
        } catch (err) {
            // eslint-disable-next-line no-console
            console.log(err);
        }

        if (objectType === 'REV' && (!movTypePicker || (movTypePicker && movTypePicker.getValue().length === 0))) {
            return Promise.resolve(false);
        }

        //Find the record we are working with
        if (type === 'MaterialDocItem' && objectType !== 'REV') {
            if (context.binding.PurchaseOrderItem_Nav) {
                target = context.binding.PurchaseOrderItem_Nav;
            } else if (context.binding.StockTransportOrderItem_Nav) {
                target = context.binding.StockTransportOrderItem_Nav;
                plant = context.binding.StockTransportOrderItem_Nav.StockTransportOrderHeader_Nav.SupplyingPlant;
            } else if (context.binding.ReservationItem_Nav) {
                target = context.binding.ReservationItem_Nav;
            }
            material = context.binding.Material;
        } else if (type === 'StockTransportOrderItem') {
            plant = context.binding.StockTransportOrderHeader_Nav.SupplyingPlant;
            material = context.binding.MaterialNum;
        }

        if (plant && material) {
            if (objectType === 'STO' && move === 'I') { //Issuing an STO, so need to look up serial profile manually instead of using nav link on the item that points to receiving plant
                let query = "MaterialPlants(MaterialNum='" + material + "',Plant='" + plant + "')";
                return context.read('/SAPAssetManager/Services/AssetManager.service', query, [], '').then(function(results) {
                    if (results && results.length > 0) {
                        let row = results.getItem(0);
                        if (row.SerialNumberProfile) {
                            return true;
                        }
                    }
                    return false;
                });
            }
        }

        if (target.MaterialPlant_Nav && target.MaterialPlant_Nav.SerialNumberProfile) {
            return Promise.resolve(true);
        } else if (target.Material && target.Material.MaterialPlants && target.Material.MaterialPlants.length > 0 && target.Material.MaterialPlants[0].SerialNumberProfile) {
            return Promise.resolve(true);
        } else if (target.SerialNum && target.SerialNum.length > 0) {
            return Promise.resolve(true);
        }
    }
    return Promise.resolve(false);
}
