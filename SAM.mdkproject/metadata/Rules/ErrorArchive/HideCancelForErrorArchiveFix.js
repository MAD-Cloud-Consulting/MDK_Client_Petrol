import Logger from '../Log/Logger';

export default function HideCancelForErrorArchiveFix(context) {
    try {
        if (context.evaluateTargetPathForAPI('#Page:-Previous').getClientData().FromErrorArchive) {
            context.setActionBarItemVisible(0, false);
        } else if (context.evaluateTargetPathForAPI('#Page:-Previous').getClientData().ErrorObject) {
            context.setActionBarItemVisible(0, false);
        }
    } catch (err) {
        Logger.error('ErrorArchieve', err.message);
    }
}
