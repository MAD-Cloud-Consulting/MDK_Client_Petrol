import Logger from '../../Log/Logger';
import libCom from '../../Common/Library/CommonLibrary';

/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function InspectionCharacteristicsOnLoaded(context) {
    try {
        if (context.evaluateTargetPathForAPI('#Page:-Previous').getClientData().FromErrorArchive) {
            context.setActionBarItemVisible(0, false);
            context.setActionBarItemVisible(1, false);
        } else if (context.evaluateTargetPathForAPI('#Page:-Previous').getClientData().ErrorObject) {
            context.setActionBarItemVisible(0, false);
            context.setActionBarItemVisible(1, false);
        }
    } catch (err) {
        Logger.error('ErrorArchieve', err.message);
    }

    libCom.saveInitialValues(context);
}
