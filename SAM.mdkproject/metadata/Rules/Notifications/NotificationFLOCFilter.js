import libCom from '../Common/Library/CommonLibrary';
import { GlobalVar } from '../Common/Library/GlobalCommon';

export default function NotificationFLOCFilter(context) {
    if (context.binding['@odata.type'] === '#sap_mobile.InspectionCharacteristic') {
        return `$filter=FuncLocIdIntern eq '${context.binding.EAMChecklist_Nav.FunctionalLocation}'&$orderby=FuncLocId`;
    }

    let notificationPlanningPlant;

    if (GlobalVar.getUserSystemInfo().get('USER_PARAM.IWK')) {
        notificationPlanningPlant = GlobalVar.getUserSystemInfo().get('USER_PARAM.IWK');
    } else {
        notificationPlanningPlant = libCom.getAppParam(context, 'NOTIFICATION', 'PlanningPlant');
    }
    
    if (notificationPlanningPlant) {
        return `$orderby=FuncLocId&$filter=(PlanningPlant eq '' or PlanningPlant eq '${notificationPlanningPlant}')`;
    } else {
        return '&$orderby=FuncLocId';
    }
    
}
