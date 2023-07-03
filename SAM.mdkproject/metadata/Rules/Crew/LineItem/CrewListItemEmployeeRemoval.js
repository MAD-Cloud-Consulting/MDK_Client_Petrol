import libCommon from '../../Common/Library/CommonLibrary';
import crew from '../../Crew/CrewLibrary';

export default function CrewListItemEmployeeRemoval(clientAPI) {
    const addTimeMessage = clientAPI.localizeText('employee_remove_add_time');
    const deleteEntityMessage = clientAPI.localizeText('employee_removal');
    const deleteEntityTitle = clientAPI.localizeText('confirm_removal');
    const incompleteTitle = clientAPI.localizeText('time_sheet_incomplete');
    return libCommon.showWarningDialog(clientAPI, deleteEntityMessage, deleteEntityTitle).then(successResult => {
        if (successResult === true) {
            libCommon.showWarningDialog(clientAPI, addTimeMessage, incompleteTitle, clientAPI.localizeText('ok'), clientAPI.localizeText('no')).then(() => {
                crew.setTimesheetRemoveFlag(true);
                return clientAPI.executeAction('/SAPAssetManager/Actions/TimeSheets/TimeSheetEntryCreateUpdateNav.action');
            }, () => {
                return clientAPI.executeAction('/SAPAssetManager/Actions/Crew/CrewListUpdateDuringRemoval.action').then(function() {
                    return clientAPI.executeAction('/SAPAssetManager/Actions/Crew/CrewEmployeeRemove.action');
                });
            });
        } 
        return null;
    });
}
