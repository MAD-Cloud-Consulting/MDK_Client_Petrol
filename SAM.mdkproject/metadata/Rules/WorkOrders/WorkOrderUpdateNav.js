import libCommon from '../Common/Library/CommonLibrary';
import libWOStatus from './MobileStatus/WorkOrderMobileStatusLibrary';
import { WorkOrderLibrary as libWo } from './WorkOrderLibrary';

export default function WorkOrderUpdateNav(context) {
    return libWo.isServiceOrder(context).then(isServiceOrder => {
        let queryOption = '$select=*,Equipment/EquipId,FunctionalLocation/FuncLocIdIntern&$expand=MarkedJob,Equipment,FunctionalLocation,WODocuments,OrderMobileStatus_Nav';
        if (isServiceOrder) {
            queryOption += ',WOSales_Nav,WOPartners'; //expand on WOSales_Nav & WOPartners for service orders. It'll be used to populate sold-to-party field on edit screen.
        }
        let binding = libCommon.setBindingObject(context);
        let isLocal = !!binding['@sap.isLocal'];

        //Remove variable FollowUpFlagPage before update
        libWo.removeFollowUpFlagPage(context);

        libCommon.setOnCreateUpdateFlag(context, 'UPDATE');
        libCommon.removeStateVariable(context, 'WODefaultPlanningPlant');
        libCommon.removeStateVariable(context, 'WODefaultWorkCenterPlant');
        libCommon.removeStateVariable(context, 'WODefaultMainWorkCenter');
        if (!isLocal) {
            return libWOStatus.isOrderComplete(context).then(status => {
                if (!status) {
                    //Set the global TransactionType variable to CREATE
                    return libCommon.navigateOnRead(context, '/SAPAssetManager/Actions/WorkOrders/CreateUpdate/WorkOrderCreateUpdateNav.action', binding['@odata.readLink'] , queryOption);
                }
                return '';
            });
        }
        return libCommon.navigateOnRead(context, '/SAPAssetManager/Actions/WorkOrders/CreateUpdate/WorkOrderCreateUpdateNav.action', binding['@odata.readLink'] , queryOption);
    });
}
