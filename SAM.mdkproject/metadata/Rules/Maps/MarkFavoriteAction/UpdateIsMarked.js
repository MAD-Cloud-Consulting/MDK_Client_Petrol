import MarkedJobLibrary from '../../MarkedJobs/MarkedJobLibrary';

export default function UpdateIsMarked(context) {
    return MarkedJobLibrary.isMarked(context).then(result => {
        if (result) {
            MarkedJobLibrary.unmark(context);
        }
        MarkedJobLibrary.mark(context);
    }).catch(() => {
        context.executeAction('/SAPAssetManager/Actions/WorkOrders/MarkedJobUpdateFailed.action');
    });
}
