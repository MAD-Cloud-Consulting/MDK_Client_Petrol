
import MobileStatusCompleted from '../../MobileStatus/MobileStatusCompleted';
import { GlobalVar as globals } from '../../Common/Library/GlobalCommon';
import WorkOrdersFSMQueryOption from '../../WorkOrders/ListView/WorkOrdersFSMQueryOption';
import libPersona from '../../Persona/PersonaLibrary';
import libVal from '../../Common/Library/ValidationLibrary';

export default function WorkOrderPickerQueryOptions(context) {

    let completedVariable = MobileStatusCompleted(context);

    let query = '';
    let binding = context.getBindingObject();
    if (binding.OrderID !== undefined && binding.OrderID.length > 0) { // if the order id is defined
        query = `$filter=OrderId eq '${binding.OrderID}'`;
    } else {
        query = `$expand=OrderMobileStatus_Nav&$filter=OrderMobileStatus_Nav/MobileStatus ne '${completedVariable}'`;
    }

	try {
		// If autorelease is off, or we can't do local MobileStatuses, filter out local work orders
		if (globals.getAppParam().WORKORDER.AutoRelease !== 'Y' || globals.getAppParam().MOBILESTATUS.EnableOnLocalBusinessObjects !== 'Y') {
			query += " and(not startswith(OrderId, 'LOCAL_W'))";
		}
	} catch (exc) {
		// App parameter can't be fetched. Assume no autorelease and no local MobileStatus
		query += " and(not startswith(OrderId, 'LOCAL_W'))";
	}

    if (libPersona.isFieldServiceTechnician(context)) {
        return WorkOrdersFSMQueryOption(context).then(fsmQueryOptions => {
            if (!libVal.evalIsEmpty(fsmQueryOptions)) {
                query += ' and ' + fsmQueryOptions;
            }

            query += '&$orderby=OrderId asc';

            return query;
        });
    } else {
        query += '&$orderby=OrderId asc';

        return query;
    }
}
