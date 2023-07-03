import libCommon from '../Library/CommonLibrary';
import Logger from '../../Log/Logger';

export default function PartnerPersonnelNumberForWO(context) {
    let assignmentType = libCommon.getWorkOrderAssignmentType(context);
    if (assignmentType === '1') {
        return libCommon.getPersonnelNumber();
    } else if (assignmentType === '7') {
        return libCommon.getSapUserName(context);
    } else {
        Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryPartner.global').getValue(), 'SAPUserName or PERNO are missing');
    }
}
