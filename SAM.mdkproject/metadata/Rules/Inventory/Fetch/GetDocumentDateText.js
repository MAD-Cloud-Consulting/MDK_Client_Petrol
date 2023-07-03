import common from '../../Common/Library/CommonLibrary';

/**
 * Calculates the text for the status property at the Inbound List screen
 */
 
export default function GetDocumentDateText(clientAPI) {
    var binding = clientAPI.getBindingObject();
    if (binding.ObjectDate || binding.CountDate) {
        var date;
        if (binding.ObjectDate) {
            date = common.dateStringToUTCDatetime(binding.ObjectDate);
        } else {
            date = common.dateStringToUTCDatetime(binding.CountDate);
        }
        var dateText = common.getFormattedDate(date, clientAPI);
        return dateText;
    }
    if (binding.IMObject === 'MDOC') {
        return binding.MatDocYear;
    }
    return '';
}
