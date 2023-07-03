export default class MarkedJobLibrary {

    /**
     * mark a job as favorite
     * @param {*} context pageProxy
     */
    static mark(context) {
        return MarkedJobLibrary.isMarked(context).then(result => {
            //if marked job is not null, which mean this workorder already marked, thus return false
            if (result) {
                return false;
            }
            return context.executeAction('/SAPAssetManager/Actions/WorkOrders/MarkedJobCreate.action').then(() => {
                return true;
            }).catch(() => {
                return false;
            });
        });
    }

    /**
     * unmark a job as favorite by deleting the associated MarkedJob entity
     * @param {*} context 
     */
    static unmark(context) {
        return MarkedJobLibrary.isMarked(context).then(result => {
            if (result) {
                return context.executeAction('/SAPAssetManager/Actions/WorkOrders/MarkedJobDelete.action').then(() => {
                    return true;
                }).catch(() => {
                    return false;
                });
            }
            //if marked job is null, which mean this workorder already unmarked, thus return false
            return false;
        });
    }

    static isMarked(context) {
        if (context && context.binding && context.binding.OrderId) {
            return context.count('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderHeaders(\'' + context.binding.OrderId + '\')/MarkedJob', [], '').then(count => {
                return count > 0;
            });
        }
        return Promise.reject(false);
    }

}
