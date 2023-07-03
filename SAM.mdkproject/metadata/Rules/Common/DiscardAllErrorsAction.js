import discardErrorsAction from './DiscardErrorsAction';

export default function DiscardAllErrorsAction(context) {
    return context.executeAction('/SAPAssetManager/Actions/DiscardErrorWarningMessage.action').then(result => {
        if (result.data === true) {
            return discardErrorsAction(context);
        }
        return Promise.resolve();
    });
}
