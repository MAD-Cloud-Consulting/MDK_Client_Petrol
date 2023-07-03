import DocumentAddFromOperationDetails from '../../Documents/DocumentAddFromOperationDetails';
import IsAllowedExpenseCreate from '../../Expense/CreateUpdate/IsAllowedExpenseCreate';
import EnableRecordResultsFromOperationDetails from '../../InspectionCharacteristics/Update/EnableRecordResultsFromOperationDetails';
import IsPDFAllowedForOperation from '../../PDF/IsPDFAllowedForOperation';
import MileageAddIsEnabled from '../../ServiceOrders/Mileage/MileageAddIsEnabled';
import EnableNotificationCreateFromWorkOrder from '../../UserAuthorizations/Notifications/EnableNotificationCreateFromWorkOrder';
import EnableSubOperation from '../../UserAuthorizations/WorkOrders/EnableSubOperation';
import EnableWorkOrderEdit from '../../UserAuthorizations/WorkOrders/EnableWorkOrderEdit';

/**
* Check all of the individual menu item rules and only show the menu if one of them is true
* @param {IClientAPI} clientAPI
*/
export default function WorkOrderOperationPopoverIsVisible(clientAPI) {

    let promises = [
        EnableSubOperation(clientAPI),
        EnableNotificationCreateFromWorkOrder(clientAPI),
        EnableWorkOrderEdit(clientAPI),
        EnableRecordResultsFromOperationDetails(clientAPI),
        DocumentAddFromOperationDetails(clientAPI),
        IsAllowedExpenseCreate(clientAPI),
        MileageAddIsEnabled(clientAPI),
        IsPDFAllowedForOperation(clientAPI),
    ];

    return Promise.all(promises).then(resultsArray => {
        return resultsArray.find(rule => rule === true);
    });
}
