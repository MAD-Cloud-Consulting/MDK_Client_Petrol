import { TimeSheetLibrary as libTimesheet } from './TimeSheetLibrary';
import libCom from '../Common/Library/CommonLibrary';
import deleteEntityOnSuccess from '../Common/DeleteEntityOnSuccess';
import ODataDate from '../Common/Date/ODataDate';
import ExecuteActionWithAutoSync from '../ApplicationEvents/AutoSync/ExecuteActionWithAutoSync';

export default function TimeSheetUpdateCrewAfterDiscard(context) {

    let chosenDate = libCom.getFieldValue(context, 'DatePicker');
    let odataDate = new ODataDate(chosenDate);
    let localDateString = "datetime'" + odataDate.toLocalDateString() + "'";

    let query = `$expand=Employee&$filter=CrewList/OriginTimeStamp eq ${localDateString} and CrewItemType eq 'EMPLOYEE' and CrewItemKey eq '${context.binding.PersonnelNumber}'`;
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'CrewListItems', [], query).then(result => {
        if (result && result.length === 1) {
            context.getClientData().CrewListItemReadLink = result.getItem(0)['@odata.readLink'];

            //Subtract the original from CatsHours
            let existingDuration = result.getItem(0).CatsHours;
            let originalDuration = libTimesheet.getActualHours(context, libCom.getStateVariable(context, 'CrewTimeEntryOriginal'));

            context.getClientData().TotalCatsHours = existingDuration - originalDuration;
            //update the corresponding CrewListItem
            return context.executeAction('/SAPAssetManager/Actions/Crew/CrewListItemEmployeeUpdate.action').then(() => {
                return deleteEntityOnSuccess(context);
            });
        } else {
            return ExecuteActionWithAutoSync(context, '/SAPAssetManager/Actions/CreateUpdateDelete/DeleteEntitySuccessMessage.action');
        }
    });
}

