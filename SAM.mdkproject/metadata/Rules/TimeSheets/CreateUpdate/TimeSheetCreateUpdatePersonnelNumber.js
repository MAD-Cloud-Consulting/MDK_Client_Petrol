import libCom from '../../Common/Library/CommonLibrary';
export default function TimeSheetCreateUpdatePersonnelNumber(clientAPI) {
    let personnelNumber;

    if (clientAPI.getClientData().PersonnelNumber) {
        personnelNumber = clientAPI.getClientData().PersonnelNumber;
    } else if (clientAPI.binding.PersonnelNumber) {
        personnelNumber = clientAPI.binding.PersonnelNumber;
    }
    if (!personnelNumber) { //if personnel number doesn't exist then time is being added for the logged in user so use that personnel number
        personnelNumber = libCom.getPersonnelNumber(clientAPI);
    }
    return personnelNumber;
}
