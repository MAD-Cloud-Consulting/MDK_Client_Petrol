
import ConfirmationDateFromOData from '../ConfirmationDateFromOData';
import QueryBuilder from '../../Common/Query/QueryBuilder';
import FetchRequest from '../../Common/Query/FetchRequest';
import libVal from '../../Common/Library/ValidationLibrary';
import getPostingOverride from '../ConfirmationsGetPostingDateOverride';
import libSuper from '../../Supervisor/SupervisorLibrary';
import libMobile from '../../MobileStatus/MobileStatusLibrary';

export default function ConfirmationUpdateNav(context, completionBinding) {

    return setupClientData(context, completionBinding).then(() => {
        return setupBinding(context, completionBinding).then(() => {
            return context.executeAction('/SAPAssetManager/Actions/Confirmations/ConfirmationsCreateUpdateNav.action');
        });
    });
}

function setupClientData(context, completionBinding) {
    var binding = completionBinding || context.getBindingObject();
    let queryBuilder = new QueryBuilder();
    queryBuilder.addFilter(`PostingDate eq datetime'${binding.PostingDate}'`);
    queryBuilder.addExtra('top=1');
    let request = new FetchRequest('ConfirmationOverviewRows', queryBuilder.build());

    return request.execute(context).then(result => {

        if (context.getClientData().FromErrorArchive) {
            context.getClientData().ConfirmationOverviewRowReadlink = binding['@odata.readLink'];
        } else {
            if (libVal.evalIsEmpty(result)) {
                context.getClientData().ConfirmationOverviewRowReadlink = '';
            } else {
                context.getClientData().ConfirmationOverviewRowReadlink = result.getItem(0)['@odata.readLink'];
            }
        }
        return true;
    });
}

function setupBinding(context, completionBinding) {
    let binding = completionBinding || context.getBindingObject();
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderHeaders', [], `$filter=OrderId eq '${binding.OrderID}'&$expand=OrderMobileStatus_Nav,UserTimeEntry_Nav&$top=1`).then(result => {

        binding.IsOnCreate = false;
        binding.IsWorkOrderChangable = false;
        binding.IsOperationChangable = false;
        binding.IsSubOperationChangable = false;
        binding.WorkOrderHeader = result.getItem(0);
        binding.IsFinal = binding.FinalConfirmation === 'X';

        let confirmationStartDate = ConfirmationDateFromOData(context, binding, true);
        binding._Start = confirmationStartDate.date().toISOString();

        let confirmationEndDate = ConfirmationDateFromOData(context, binding, false);
        binding._End = confirmationEndDate.date().toISOString();

        if (getPostingOverride(context)) { //Convert the local override posting date back to UTC for display on screen
            let dt = binding.PostingDate;
            let offset = new Date().getTimezoneOffset() * 60 * 1000; 
            let date = new Date(new Date(dt).getTime() + offset);
            binding._Posting = date;
        }

        return libSuper.checkReviewRequired(context, binding).then(review => {
            if (review && !libMobile.isSubOperationStatusChangeable(context)) { //If not sub-operation assignment and needs review, then don't allow final confirmation to be set by user
                binding.IsFinalChangable = false;
            }
            return context.read('/SAPAssetManager/Services/AssetManager.service', 'ConfirmationLongTexts', [], `$filter=ConfirmationNum eq '${binding.ConfirmationNum}'`).then(longTextArray => {
                if (!libVal.evalIsEmpty(longTextArray)) {
                    binding.LongText = longTextArray.getItem(0);
                }
                if (context.setActionBinding) {
                    context.setActionBinding(binding);
                } else {
                    context.getPageProxy().setActionBinding(binding);
                }
                return true;
            });
        });
    });
}



