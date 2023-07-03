import tableKey from './LAMMeasurementDocTableKey';
import libCommon from '../../Common/Library/CommonLibrary';

export default function LAMTransactionID(context) {

    //Generate a LAM transaction id using the keys from the LAMObjectData entity row
    let lamObjectType;
    if (context.getBindingObject() && context.getBindingObject().TempLAMObjectType) {
        lamObjectType = context.getBindingObject().TempLAMObjectType;
    } else {
        let type = libCommon.getStateVariable(context, 'LAMCreateType');
        if (type === 'MeasurementPoint') {
            lamObjectType = 'MD';
        } else if (type === 'Confirmation') {
            lamObjectType = 'RU';
        }
    }
    return tableKey(context).then(function(results) {
        return results + lamObjectType;
    });
}
