import libCom from '../../Common/Library/CommonLibrary';
import libVal from '../../Common/Library/ValidationLibrary';
import WOHistReadlink from './WorkOrderHistoryReadLink';

export default function WorkOrderHistoryListViewCaption(context) {

    let referenceType = libCom.getTargetPathValue(context, '#Page:-Previous/#ClientData/#Property:ReferenceType');
    let  historyReadLinkPath = WOHistReadlink(context);
    if (!libVal.evalIsEmpty(referenceType)) {
        if (referenceType === 'P') {
            return context.count('/SAPAssetManager/Services/AssetManager.service', historyReadLinkPath, "$filter=ReferenceType eq 'P'").then(count => {
                if (count) {
                    let params=[count];
                    return context.localizeText('pending_work_orders', params);
                } else {
                    return context.localizeText('no_related_work_orders');
                }
            });
        } else if (referenceType === 'H') {

            return context.count('/SAPAssetManager/Services/AssetManager.service', historyReadLinkPath, "$filter=ReferenceType eq 'H'").then(count => {
                if (count) {
                    let params=[count];
                    return context.localizeText('previous_work_orders', params);
                } else {
                    return context.localizeText('no_related_work_orders');
                }
            });
        } else {
            return context.localizeText('no_related_work_orders');
        }
    } else {
        return context.localizeText('no_related_work_orders');
    }
 }
