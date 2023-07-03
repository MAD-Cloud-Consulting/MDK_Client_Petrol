import libCommon from '../../Common/Library/CommonLibrary';

export default function CrewListItemRemoval(clientAPI) {
    const deleteEntityMessage = clientAPI.localizeText('vehicle_removal');
    const deleteEntityTitle = clientAPI.localizeText('confirm_discard');
    return libCommon.showWarningDialog(clientAPI, deleteEntityMessage, deleteEntityTitle).then(successResult => {
        if (successResult === true) {
            return clientAPI.executeAction('/SAPAssetManager/Actions/Crew/CrewListUpdateDuringRemoval.action').then(function() {
                return clientAPI.executeAction('/SAPAssetManager/Actions/Crew/Vehicle/VehicleDelete.action').then(function() {
                    return clientAPI.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action');
                });
            });
        } 
        return null;
    });
}
