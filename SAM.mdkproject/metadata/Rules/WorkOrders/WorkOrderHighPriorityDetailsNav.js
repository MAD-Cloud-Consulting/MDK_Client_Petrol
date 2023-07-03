import libCommon from '../Common/Library/CommonLibrary';
import {WorkOrderLibrary as libWo} from './WorkOrderLibrary';
import WorkOrderDetailsNavLib from '../WorkOrders/WorkOrderDetailsNav';
import userFeaturesLib from '../UserFeatures/UserFeaturesLibrary';

export default function WorkOrderHighPriorityDetailsNav(context) {
    if (userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Meter.global').getValue())) {
        return WorkOrderDetailsNavLib(context);
    }
    let binding = context.getPageProxy().getActionBinding();
    return libCommon.navigateOnRead(context.getPageProxy(), '/SAPAssetManager/Actions/WorkOrders/WorkOrderDetailsNav.action', binding['@odata.readLink'], libWo.getWorkOrderDetailsNavQueryOption(context));
}
