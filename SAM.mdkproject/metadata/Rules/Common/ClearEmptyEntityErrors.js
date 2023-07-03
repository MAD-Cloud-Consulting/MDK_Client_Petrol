/**
 * 
 * Clears all errors, which doesn't have AffectedEntity in body.
 * As it called from Material doc delete, so ignoring related items error delete, because they're already been deleted
 */

export default function clearEmptyEntityErrors(context, noRelatedCheck = false) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'ErrorArchive', [] ,'').then(function(results) {
        if (results.length) {
            let promises = [];
            results.forEach(res => {
                let relatedCheckFlag = noRelatedCheck;
                if (!noRelatedCheck) {
                    relatedCheckFlag = res.RequestURL.indexOf('RelatedItem') === -1;
                }
                if (!res.AffectedEntity && res.RequestID && res.RequestURL && relatedCheckFlag) {
                    promises.push(context.getPageProxy().executeAction({ 'Name': '/SAPAssetManager/Actions/Common/ErrorArchiveDiscardNoClosePage.action', 'Properties': {
                        'Target': {
                            'EntitySet': 'ErrorArchive',
                            'Service': '/SAPAssetManager/Services/AssetManager.service',
                            'QueryOptions': `$filter=RequestID eq ${res.RequestID}`,
                        },
                        'OnSuccess': '',
                        'OnFailure': '',
                        // uncomment this to debug and find the exact place where error fails
                        // 'OnFailure': context.getPageProxy().executeAction({ 'Name': '/SAPAssetManager/Actions/CreateUpdateDelete/DeleteEntityFailureMessage.action', 'Properties': {
                        //     'Message': `Error - ${res.RequestID}`,
                        // }}),
                    }}));
                }
            });
            return Promise.all(promises);
        }
        return true;
    });
}
