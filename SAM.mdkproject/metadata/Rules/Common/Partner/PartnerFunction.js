import libCommon from '../Library/CommonLibrary';
import {PartnerFunction as PFGlobal} from '../Library/PartnerFunction';
import Logger from '../../Log/Logger';

export default function PartnerFunction(context) {
    let assignmentType = libCommon.getWorkOrderAssignmentType(context);
    if (assignmentType === '1') {
        return PFGlobal.getPersonnelPartnerFunction();
    } else if (assignmentType === '7') {
        return 'VU';
    } else {
        Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryPartner.global').getValue() , 'partner function is missing');
    }
}
