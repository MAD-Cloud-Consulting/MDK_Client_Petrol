import libWOStatus from '../WorkOrders/MobileStatus/WorkOrderMobileStatusLibrary';
import libCommon from '../Common/Library/CommonLibrary';
import setCaption from './PartsListViewCaption';
import openQuantityQueryOptions from '../Extensions/BarcodeScannerQueryOptions';

export default function PartsListViewOnLoad(context) {
    let currentReadLink = libCommon.getTargetPathValue(context, '#Property:@odata.readLink');
    let isLocal = libCommon.isCurrentReadLinkLocal(currentReadLink);
    setCaption(context);
    if (!isLocal) {
        return libWOStatus.isOrderComplete(context).then(status => {
            if (status) {
                context.setActionBarItemVisible(0, false);
            }
            return context.count('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderComponents', openQuantityQueryOptions(context)).then(count => {
                if (count === 0) {
                    context.setActionBarItemVisible(1, false);
                }
            });
        });
    }
}

