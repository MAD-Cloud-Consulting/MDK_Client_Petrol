import libPersona from '../../Persona/PersonaLibrary';
import libCommon from '../../Common/Library/CommonLibrary';
import WorkOrdersFSMQueryOption from '../ListView/WorkOrdersFSMQueryOption';

export default function WorkOrderCreateGetDefaultOrderType(context) {
    if (libPersona.isFieldServiceTechnician(context)) {
        return WorkOrdersFSMQueryOption(context).then(fsmOrderTypes => {
            return context.read('/SAPAssetManager/Services/AssetManager.service', 'OrderTypes', [], `$filter=${fsmOrderTypes}&$orderby=OrderType&$top=1`).then(types => {
                if (types && types.length > 0) {
                    return types.getItem(0).OrderType;
                }
                
                return undefined;
            });
        });
    } else {
        return Promise.resolve(libCommon.getAppParam(context, 'WORKORDER', 'OrderType'));
    }
}
