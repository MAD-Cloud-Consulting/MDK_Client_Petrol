import SyncErrorsCount from '../ErrorArchive/SyncErrorsCount';

export default function DiscardErrorAction(context) {
    return SyncErrorsCount(context).then(errorsCount => {
        return context.executeAction('/SAPAssetManager/Actions/DiscardErrorWarningMessage.action').then(result => {
            if (result.data === true) {

                if (errorsCount === 1) {
                     return context.executeAction(
                        '/SAPAssetManager/Actions/Common/ErrorArchiveDiscard.action'
                        ).then(() => Promise.resolve());
                }

                return context.executeAction(
                    '/SAPAssetManager/Actions/Common/ErrorArchiveDiscardNoClosePage.action'
                    ).then(()=> {
                        context.executeAction('/SAPAssetManager/Actions/ErrorArchive/ErrorArchiveCloseTopModal.action');
                        return Promise.resolve();
                    });
            }
            return Promise.resolve();
        });
    });
}
