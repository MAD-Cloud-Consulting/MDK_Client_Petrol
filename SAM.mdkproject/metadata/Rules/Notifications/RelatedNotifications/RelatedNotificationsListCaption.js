import libCom from '../../Common/Library/CommonLibrary';
import RelatedNotifReadlink from './NotificationHistoryReadLink';
export default function RelatedNotificatiionsListCaption(context) {

    let referenceType = libCom.getTargetPathValue(context, '#Page:-Previous/#ClientData/#Property:ReferenceType');
    let  historyReadLinkPath = RelatedNotifReadlink(context);
    if (libCom.isDefined(referenceType)) {
        if (referenceType === 'P') {
            return context.count('/SAPAssetManager/Services/AssetManager.service', historyReadLinkPath, "$filter=ReferenceType eq 'P'").then(count => {
                if (count) {
                    let params=[count];
                    return context.localizeText('pending_notifications_with_count', params);
                } else {
                    return context.localizeText('no_pending_notifications');
                }
            });
        } else if (referenceType === 'H') {

            return context.count('/SAPAssetManager/Services/AssetManager.service', historyReadLinkPath, "$filter=ReferenceType eq 'H'").then(count => {
                if (count) {
                    let params=[count];
                    return context.localizeText('previous_notifications_with_count', params);
                } else {
                    return context.localizeText('no_previous_notifications');
                }
            });
        } else {
            return context.localizeText('no_related_notifications');
        }
    } else {
        return context.localizeText('no_related_notifications');
    }
 }
