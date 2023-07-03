import libVal from '../Common/Library/ValidationLibrary';

export default function OnlineSyncError(context) {
    let error = context.getPageProxy().getClientData().Error;
    if (!libVal.evalIsEmpty(error) && !libVal.evalIsEmpty(error.message)) {
        return error.message;
    }
    return context.localizeText('online_service_failure');
}
