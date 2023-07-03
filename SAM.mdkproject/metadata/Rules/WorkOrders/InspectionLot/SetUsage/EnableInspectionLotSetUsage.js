import libCom from '../../../Common/Library/CommonLibrary';
import libVal from '../../../Common/Library/ValidationLibrary';
import { checkStatus } from '../../../InspectionCharacteristics/Update/EnableRecordResults';

export default function EnableInspectionLotSetUsage(context) {

    let value = libCom.getSetUsage(context);

    if (value === 'Y' && (libVal.evalIsEmpty(context.binding.UDCode) || context.binding['@sap.isLocal'])) { //UDCode is empty or the change is still local
        // if both of these conditions are met then check further
        if (context.binding.hasOwnProperty('InspectionPoints_Nav') && !libVal.evalIsEmpty(context.binding.InspectionPoints_Nav)) {
            for (let point of context.binding.InspectionPoints_Nav) {
                if (libVal.evalIsEmpty(point.ValuationStatus)) {
                    return false;
                }
            }
        }

       const woHeaderLink = context.binding.WOHeader_Nav['@odata.readLink'];
       const woHeaderBinding = context.binding.WOHeader_Nav;

       return checkStatus(context, woHeaderBinding, woHeaderLink);
    }

    return false;
}
