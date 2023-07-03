import libCommon from '../Common/Library/CommonLibrary';
import libPersona from '../Persona/PersonaLibrary';
import { WorkOrderLibrary as libWo} from './WorkOrderLibrary';
import libSuper from '../Supervisor/SupervisorLibrary';
import getFSMQueryOptions from './ListView/WorkOrdersFSMQueryOption';

export default function WorkOrderListViewCaption(context) {

    const isFST = libPersona.isFieldServiceTechnician(context);
    let queryOption, totalQueryOption = '';
    let orderTypesPromise;
    if (libCommon.isDefined(context.binding) && libCommon.isDefined(context.binding.isHighPriorityList)) {
        queryOption = libWo.getFilterForHighPriorityWorkorders(context);
    } else if (libCommon.isDefined(context.binding) && (libSuper.isSupervisorFeatureEnabled(context)) && libCommon.isDefined(context.binding.isSupervisorWorkOrdersList)) {
        queryOption = libSuper.getFilterForWOPendingReview(context, false);
    } else if (libCommon.isDefined(context.binding) && (libSuper.isSupervisorFeatureEnabled(context)) && libCommon.isDefined(context.binding.isTechnicianWorkOrdersList)) {
        queryOption = libSuper.getFilterForSubmittedWO(context, false);
    } else {
        queryOption = libCommon.getStateVariable(context,'WORKORDER_FILTER');
    }

    if (isFST) { 
        orderTypesPromise = getFSMQueryOptions(context);
    } else {
        orderTypesPromise = Promise.resolve();
    }

    return orderTypesPromise.then(result => {
        if (isFST) { 
            totalQueryOption = '$filter=' + result;

            if (queryOption === '$filter=') {
                queryOption += result;
            } else {
                queryOption += ' and ' + result;
            }
        }
    
        var params = [];
        let totalCountPromise = context.count('/SAPAssetManager/Services/AssetManager.service','MyWorkOrderHeaders', totalQueryOption);
        let countPromise = context.count('/SAPAssetManager/Services/AssetManager.service','MyWorkOrderHeaders', queryOption);
    
        return Promise.all([totalCountPromise, countPromise]).then(function(resultsArray) {
            let totalCount = resultsArray[0];
            let count = resultsArray[1];
            let caption = '';
            
            params.push(count);
            params.push(totalCount);
            
            if (count === totalCount) {
                caption = isFST ? context.localizeText('service_order_x', [totalCount]) : context.localizeText('work_order_x', [totalCount]);
            } else {
                caption = isFST ? context.localizeText('service_order_x_x', params) : context.localizeText('work_order_x_x', params);
            }

            return context.setCaption(caption);
        });
    });   
}
