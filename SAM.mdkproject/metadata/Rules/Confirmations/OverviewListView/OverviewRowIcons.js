import QueryBuilder from '../../Common/Query/QueryBuilder';
import FetchRequest from '../../Common/Query/FetchRequest';
import isAndroid from '../../Common/IsAndroid';
import CommonLibrary from '../../Common/Library/CommonLibrary';
import PersonaLibrary from '../../Persona/PersonaLibrary';
import ValidationLibrary from '../../Common/Library/ValidationLibrary';
import WorkOrdersFSMQueryOption from '../../WorkOrders/ListView/WorkOrdersFSMQueryOption';

export default function OverviewRowIcons(context) {

    let date = context.getBindingObject().PostingDate;
    let queryBuilder = new QueryBuilder();
    queryBuilder.addFilter(`PostingDate eq datetime'${date}'`);

    if (PersonaLibrary.isFieldServiceTechnician(context)) { //Only take the FST confirmations into account
        return WorkOrdersFSMQueryOption(context).then(orderTypes => {
            if (!ValidationLibrary.evalIsEmpty(orderTypes)) {
                queryBuilder.addFilter(orderTypes);
            }

            return executeFetchRequest(context, queryBuilder);
        });
    } else {
        return executeFetchRequest(context, queryBuilder);
    }
}

function executeFetchRequest(context, queryBuilder) {
    const mileageActivityType = CommonLibrary.getMileageActivityType(context);
    const expenseActivityType = CommonLibrary.getExpenseActivityType(context);

    if (mileageActivityType) {
        queryBuilder.addFilter(`ActivityType ne '${mileageActivityType}'`);
    }

    if (expenseActivityType) {
        queryBuilder.addFilter(`ActivityType ne '${expenseActivityType}'`);
    }

    let fetchRequest = new FetchRequest('Confirmations', queryBuilder.build());

    return fetchRequest.execute(context).then(result => {

        let icons = [];

        result.some(conf => {
            
            if (conf['@sap.isLocal']) {
                icons.push(isAndroid(context) ? '/SAPAssetManager/Images/syncOnListIcon.android.png' : '/SAPAssetManager/Images/syncOnListIcon.png');
                return true;
            }
            return false;
        });
        return icons;
    });    
}
