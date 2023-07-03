import libCom from '../../../Common/Library/CommonLibrary';
import hideCancel from '../../../ErrorArchive/HideCancelForErrorArchiveFix';
import serialItem from '../../Validation/ShowAutoSerialNumberField';

export default function PhysicalInventoryCountUpdateOnPageLoad(context) {
    hideCancel(context);
    libCom.saveInitialValues(context);

    let quantity = libCom.getControlProxy(context, 'QuantitySimple');
    let zero = context.binding.ZeroCount;
    let binding = context.binding;

    //Remove old serial state variables if they exist
    libCom.removeStateVariable(context, 'OldSerialRows');
    libCom.removeStateVariable(context, 'NewSerialMap');
    return serialItem(context).then(function(serialized) { //Check if serialized material
        if (zero === 'X') { //Disable quantity if zero count set
            quantity.setValue('0');
            quantity.setEditable(false);
        }
        libCom.setStateVariable(context, 'NewSerialMap', new Map());
        let serialMap = libCom.getStateVariable(context, 'NewSerialMap');
        if (serialized) {
            quantity.setEditable(false);
            let query = "$orderby=SerialNumber&$filter=FiscalYear eq '" + binding.FiscalYear + "' and Item eq '" + binding.Item + "' and PhysInvDoc eq '" + binding.PhysInvDoc + "'";
            return context.read('/SAPAssetManager/Services/AssetManager.service', 'PhysicalInventoryDocItemSerials', ['SerialNumber'], query).then(function(results) {
                let date = new Date();
                if (results && results.length > 0) {
                    libCom.setStateVariable(context, 'OldSerialRows', results); //Save for use during delete routine when saving
                    results.forEach(function(row) {  //Load the existing serial numbers into the state variable for display on serial screen
                        let serial = {};                        
                        serial.SerialNumber = row.SerialNumber;
                        serial.Date = date; //Used for sorting on serial screen
                        serial.IsLocal = row['@sap.isLocal']; //Only local items can be deleted later on serial screen
                        serial.IsNew = false; //Tells us that this row already exists for save routine
                        serialMap.set(row.SerialNumber, serial);
                    });
                }
                return true;
            });
        }
        return true;
    });
}
