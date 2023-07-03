import IsAllowedExpenseCreate from '../Expense/CreateUpdate/IsAllowedExpenseCreate';
import MeasuringPointsTakeReadingsIsVisible from '../Measurements/Points/MeasuringPointsTakeReadingsIsVisible';
import IsPDFAllowedForOrder from '../PDF/IsPDFAllowedForOrder';
import MileageAddIsEnabled from '../ServiceOrders/Mileage/MileageAddIsEnabled';
import EnableNotificationCreateFromWorkOrder from '../UserAuthorizations/Notifications/EnableNotificationCreateFromWorkOrder';
import EnableWorkOrderCreateFromWorkOrder from '../UserAuthorizations/WorkOrders/EnableWorkOrderCreateFromWorkOrder';
import EnableWorkOrderEdit from '../UserAuthorizations/WorkOrders/EnableWorkOrderEdit';
import AllowMeterCreate from './Meter/Details/AllowMeterCreate';

/**
* Check all of the individual menu item rules and only show the menu if one of them is true
* @param {IClientAPI} clientAPI
*/
export default function WorkOrderDetailsPopoverIsVisible(clientAPI) {
    
    let promises = [
        EnableWorkOrderCreateFromWorkOrder(clientAPI), 
        EnableWorkOrderEdit(clientAPI),
        AllowMeterCreate(clientAPI),
        EnableNotificationCreateFromWorkOrder(clientAPI),
        MeasuringPointsTakeReadingsIsVisible(clientAPI),
        IsAllowedExpenseCreate(clientAPI),
        MileageAddIsEnabled(clientAPI),
        IsPDFAllowedForOrder(clientAPI),
    ];

    return Promise.all(promises).then(resultsArray => {
        return resultsArray.find(rule => rule === true);
    });
}
